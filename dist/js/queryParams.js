/*!***************************************
 * Level Up GHL Embed Tools
 * https//levelupghl.com
 * Version: v1.0.3
 ****************************************/

(function (exports) {
  'use strict';

  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }

  function getQueryParams(url_or_search = null) {
    let search;
    if (url_or_search) {
      search = url_or_search.startsWith("?") ? url_or_search : new URL(url_or_search).search;
    } else {
      search = window.location.search || new URL(window.location.href).search;
    }
    const params = new URLSearchParams(search);
    const queryParams = {};
    params.forEach((value, key) => {
      queryParams[key] = value;
    });
    return queryParams;
  }
  function mergeObjects(objects) {
    const result = {};
    objects.forEach((obj) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = obj[key];
        }
      }
    });
    return result;
  }

  function hasLocalStorage() {
    try {
      const t = "__storage_test__";
      const store = window.localStorage;
      store.setItem(t, t);
      const v = store.getItem(t);
      store.removeItem(t);
      return t === v;
    } catch (e) {
      return false;
    }
  }

  var _a, _b, _c, _d;
  const DEBUG = false;
  const iframeSelector = "iframe:not([data-embed-tools-init])";
  const iframesList = [];
  const search_cache = window.location.search;
  const SUPPORTS_LOCALSTORAGE = hasLocalStorage();
  const GHL_EMBED_SRCS = ["/form", "/survey", "/booking", "/group"];
  let send_queue = [];
  const embedTools = {
    debug: DEBUG,
    sendQueryParams
  };
  function sendQueryParams(params, iframe = null) {
    _sendQueryParams(params, iframe);
    send_queue.push(params);
  }
  function _sendQueryParams(params, iframe = null) {
    if (iframe) {
      postQueryParams(iframe, params);
    } else {
      iframesList.forEach((iframe2) => {
        postQueryParams(iframe2, params);
      });
    }
  }
  function postQueryParams(iframe, params) {
    var _a2, _b2;
    const url = new URL(document.location.href);
    const locationId = iframe.dataset.embedToolsLocationId;
    const cached_session = getCachedSession(locationId);
    const referrer = cached_session ? cached_session.referrer : document.referrer;
    const id = ((_a2 = iframe.dataset) == null ? void 0 : _a2.layoutIframeId) || iframe.id;
    (_b2 = iframe.contentWindow) == null ? void 0 : _b2.postMessage(
      ["query-params", params, url.toString(), referrer, id],
      "*"
    );
  }
  function getCachedSession(locationId) {
    if (!SUPPORTS_LOCALSTORAGE || !locationId) {
      return;
    }
    const key = `v3_first_session_event_${locationId}`;
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        return null;
      }
      const data = JSON.parse(value);
      return (/* @__PURE__ */ new Date()).getTime() > data.expiry ? (localStorage.removeItem(key), null) : data.value;
    } catch (err) {
      return null;
    }
  }
  function getIframeByEventSource(source) {
    if (!source) return;
    const iframes = Array.from(document.getElementsByTagName("iframe"));
    for (let item of iframes) {
      if (item.contentWindow === source) {
        return item;
      }
    }
  }
  function processIframeMessage(evt) {
    if (embedTools.debug) {
      console.log("[EMBEDTOOLS] received message:", evt, evt.data);
    }
    const data = evt.data;
    if (typeof data === "object" && data[0] === "fetch-query-params") {
      const iframe = getIframeByEventSource(evt.source);
      if (iframe) {
        iframe.dataset.embedToolsLocationId = data[2];
      }
      const search = window.location.search.length > 1 ? window.location.search : search_cache;
      let params = getQueryParams(search);
      if (send_queue && send_queue.length) {
        params = mergeObjects([params, ...send_queue]);
      }
      setTimeout(() => {
        _sendQueryParams(params, iframe || null);
      }, 10);
    }
  }
  function setupIframesAndObserve(document2) {
    var _a2, _b2, _c2, _d2, _e;
    const filterIframes = (iframe) => {
      if (iframe.dataset.embedToolsInit) {
        return false;
      }
      const src = iframe.src || iframe.dataset.src || "";
      return GHL_EMBED_SRCS.some((r) => src.includes(r));
    };
    const initIframes = () => {
      Array.from(document2.querySelectorAll(iframeSelector)).filter(filterIframes).forEach((iframe) => {
        iframe.dataset.embedToolsInit = "true";
        iframesList.push(iframe);
      });
    };
    window.addEventListener("message", processIframeMessage);
    initIframes();
    if ((_c2 = (_b2 = (_a2 = window.levelup) == null ? void 0 : _a2.sendQueryParams) == null ? void 0 : _b2.queue) == null ? void 0 : _c2.length) {
      send_queue = (_e = (_d2 = window.levelup) == null ? void 0 : _d2.sendQueryParams) == null ? void 0 : _e.queue;
    }
    const observer = new MutationObserver(debounce(initIframes, 50));
    observer.observe(document2.body, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }
  setupIframesAndObserve(window.document);
  if (!window.levelup) {
    window.levelup = embedTools;
  } else {
    (_b = (_a = window.levelup).debug) != null ? _b : _a.debug = embedTools.debug;
    (_d = (_c = window.levelup).sendQueryParams) != null ? _d : _c.sendQueryParams = embedTools.sendQueryParams;
  }
  console.log(`Powered by Level Up Embed Tools v1.0.3:`, "https://levelupghl.com");

  exports.sendQueryParams = sendQueryParams;

  return exports;

})({});
//# sourceMappingURL=queryParams.js.map
