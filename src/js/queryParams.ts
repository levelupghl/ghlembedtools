import { debounce } from "./lib/debounce"
import { getQueryParams, mergeObjects } from "./lib/utils"
import { hasLocalStorage } from "./lib/supports"

const DEBUG = true
const iframeSelector = "iframe:not([data-embed-tools-init])"
const iframesList: Array<IFrame> = []
const search_cache = window.location.search
const SUPPORTS_LOCALSTORAGE = hasLocalStorage()
// GHL iframe urls to match; see form_embed line 838
const GHL_EMBED_SRCS = ["/form", "/survey", "/booking", "/group"]
let send_queue: Array<object> = []

const embedTools = {
  debug: DEBUG,
  sendQueryParams,
}

export interface CustomWindow extends Window {
  levelup: {
    debug: boolean
    sendQueryParams: any
  }
}
declare let window: CustomWindow

interface IFrame extends HTMLIFrameElement {
  dataset: {
    embedToolsInit?: string
    embedToolsLocationId?: string
    src?: string
    layoutIframeId?: string
  }
}

export function sendQueryParams(params: object, iframe: IFrame | null = null) {
  _sendQueryParams(params, iframe)
  send_queue.push(params)
}

function _sendQueryParams(params: object, iframe: IFrame | null = null) {
  if (iframe) {
    postQueryParams(iframe, params)
  } else {
    iframesList.forEach((iframe) => {
      postQueryParams(iframe, params)
    })
  }
}


function postQueryParams(iframe: IFrame, params: object) {
  const url = new URL(document.location.href)
  const locationId = iframe.dataset.embedToolsLocationId
  const cached_session = getCachedSession(locationId)
  const referrer = cached_session ? cached_session.referrer : document.referrer
  const id = iframe.dataset?.layoutIframeId || iframe.id
  iframe.contentWindow?.postMessage(
    ["query-params", params, url.toString(), referrer, id],
    "*"
  )
}

// From form_embed.js [line 512]
function getCachedSession(locationId: string | undefined) {
  if (!SUPPORTS_LOCALSTORAGE || !locationId) {
    return
  }
  const key = `v3_first_session_event_${locationId}`
  try {
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    const data = JSON.parse(value)
    return new Date().getTime() > data.expiry
      ? (localStorage.removeItem(key), null)
      : data.value
  } catch (err) {
    return null
  }
}

function getIframeByEventSource(
  source: MessageEventSource | null
): IFrame | void {
  if (!source) return
  const iframes = Array.from(document.getElementsByTagName("iframe"))
  for (let item of iframes) {
    if (item.contentWindow === source) {
      return item
    }
  }
}

// Listen for fetch-query-params messages
function processIframeMessage(evt: MessageEvent) {
  if (embedTools.debug) {
    console.log("[EMBEDTOOLS] received message:", evt, evt.data)
  }
  const data = evt.data
  if (typeof data === "object" && data[0] === "fetch-query-params") {
    const iframe = getIframeByEventSource(evt.source)
    if (iframe) {
      // Cache location ID on the iframe; needed for later postMessage
      iframe.dataset.embedToolsLocationId = data[2]
    }
    // Use the current location.search or default to cache if the search params happened to have been removed from url
    const search =
      window.location.search.length > 1 ? window.location.search : search_cache
    let params = getQueryParams(search)

    // Add any params that were previously queued up
    if (send_queue && send_queue.length) {
      params = mergeObjects([params, ...send_queue])
    }

    // Set a timeout to allow time for form_embed.js to send query params, then
    // send our params that may contain custom params from window.levelup.sendQueryParams
    setTimeout(() => {
      _sendQueryParams(params, iframe || null)
    }, 10)
  }
}

function setupIframesAndObserve(document: Document): void {
  const filterIframes = (iframe: IFrame): boolean => {
    if (iframe.dataset.embedToolsInit) {
      return false
    }
    // Some WP plugins like lazysizes removes iframe.src until the iframe is visible.
    // Since GHL's form_embed.js only filters on src, we need support both src and dataset.src.
    const src = iframe.src || iframe.dataset.src || ""
    return GHL_EMBED_SRCS.some((r) => src.includes(r))
  }

  const initIframes = (): void => {
    Array.from(document.querySelectorAll<IFrame>(iframeSelector))
      .filter(filterIframes)
      .forEach((iframe) => {
        iframe.dataset.embedToolsInit = "true"
        iframesList.push(iframe)
      })
  }

  window.addEventListener("message", processIframeMessage)

  // Start by initializing any iframes already present
  initIframes()

  // Save any queued sendQueryParams
  if (window.levelup?.sendQueryParams?.queue?.length) {
    send_queue = window.levelup?.sendQueryParams?.queue
  }

  // Rerun initFrames anytime the DOM changes, but debounced every 50ms
  const observer = new MutationObserver(debounce(initIframes, 50))
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  })
}

setupIframesAndObserve(window.document)

// Export sendQueryParams to window.levelup.sendQueryParams
if (!window.levelup) {
  window.levelup = embedTools
} else {
  window.levelup.debug ??= embedTools.debug
  window.levelup.sendQueryParams ??= embedTools.sendQueryParams
}
