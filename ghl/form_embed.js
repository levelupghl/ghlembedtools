;(() => {
  function pe() {
    "use strict"
    function e(o, p, g) {
      "addEventListener" in window
        ? o.addEventListener(p, g, !1)
        : "attachEvent" in window && o.attachEvent("on" + p, g)
    }
    function i() {
      var o,
        p = ["moz", "webkit", "o", "ms"]
      for (o = 0; o < p.length && !E; o += 1)
        E = window[p[o] + "RequestAnimationFrame"]
      E || n(" RequestAnimationFrame not supported")
    }
    function t() {
      var o = "Host page"
      return (
        window.top !== window.self &&
          (o = window.parentIFrame
            ? window.parentIFrame.getId()
            : "Nested host page"),
        o
      )
    }
    function r(o) {
      return U + "[" + t() + "]" + o
    }
    function n(o) {
      l.log && typeof window.console == "object" && console.log(r(o))
    }
    function c(o) {
      typeof window.console == "object" && console.warn(r(o))
    }
    function f(o) {
      function p() {
        function u() {
          s(w), m(), l.resizedCallback(w)
        }
        F("Height"), F("Width"), k(u, w, "resetPage")
      }
      function g(u) {
        var v = u.id
        n(" Removing iFrame: " + v),
          u.parentNode.removeChild(u),
          l.closedCallback(v),
          n(" --")
      }
      function x() {
        var u = H.substr(T).split(":")
        return {
          iframe: document.getElementById(u[0]),
          id: u[0],
          height: u[1],
          width: u[2],
          type: u[3],
        }
      }
      function F(u) {
        var v = Number(l["max" + u]),
          N = Number(l["min" + u]),
          z = u.toLowerCase(),
          $ = Number(w[z])
        if (N > v)
          throw new Error(
            "Value for min" + u + " can not be greater than max" + u
          )
        n(" Checking " + z + " is in range " + N + "-" + v),
          N > $ && (($ = N), n(" Set " + z + " to min value")),
          $ > v && (($ = v), n(" Set " + z + " to max value")),
          (w[z] = "" + $)
      }
      function B() {
        var u = w.iframe.src
        !u &&
          w.iframe.getAttribute("data-src") &&
          (u = w.iframe.getAttribute("data-src"))
        var v = o.origin,
          N = u.split("/").slice(0, 3).join("/")
        if (
          l.checkOrigin &&
          (n(" Checking connection is from: " + N), "" + v != "null" && v !== N)
        )
          throw new Error(
            "Unexpected message received from: " +
              v +
              " for " +
              w.iframe.id +
              ". Message was: " +
              o.data +
              ". This error can be disabled by adding the checkOrigin: false option."
          )
        return !0
      }
      function S() {
        return U === ("" + H).substr(0, T)
      }
      function G() {
        var u =
          w.type in
          {
            true: 1,
            false: 1,
          }
        return u && n(" Ignoring init message from meta parent page"), u
      }
      function I(u) {
        return H.substr(H.indexOf(":") + ie + u)
      }
      function C(u) {
        n(
          " MessageCallback passed: {iframe: " +
            w.iframe.id +
            ", message: " +
            u +
            "}"
        ),
          l.messageCallback({
            iframe: w.iframe,
            message: JSON.parse(u),
          }),
          n(" --")
      }
      function ue() {
        if (w.iframe === null)
          throw new Error("iFrame (" + w.id + ") does not exist on " + O)
        return !0
      }
      function se(u) {
        var v = u.getBoundingClientRect()
        return (
          a(),
          {
            x: parseInt(v.left, 10) + parseInt(h.x, 10),
            y: parseInt(v.top, 10) + parseInt(h.y, 10),
          }
        )
      }
      function le(u) {
        function v() {
          ;(h = $), ce(), n(" --")
        }
        function N() {
          return {
            x: Number(w.width) + z.x,
            y: Number(w.height) + z.y,
          }
        }
        var z = u
            ? se(w.iframe)
            : {
                x: 0,
                y: 0,
              },
          $ = N()
        n(
          " Reposition requested from iFrame (offset x:" +
            z.x +
            " y:" +
            z.y +
            ")"
        ),
          window.top !== window.self
            ? window.parentIFrame
              ? u
                ? parentIFrame.scrollToOffset($.x, $.y)
                : parentIFrame.scrollTo(w.width, w.height)
              : c(
                  " Unable to scroll to requested position, window.parentIFrame not found"
                )
            : v()
      }
      function ce() {
        l.scrollCallback(h) !== !1 && m()
      }
      function ge(u) {
        function v(ye) {
          var K = se(ye)
          n(" Moving to in page link (#" + N + ") at x: " + K.x + " y: " + K.y),
            (h = {
              x: K.x,
              y: K.y,
            }),
            ce(),
            n(" --")
        }
        var N = u.split("#")[1] || "",
          z = decodeURIComponent(N),
          $ = document.getElementById(z) || document.getElementsByName(z)[0]
        window.top !== window.self
          ? window.parentIFrame
            ? parentIFrame.moveToAnchor(N)
            : n(
                " In page link #" +
                  N +
                  " not found and window.parentIFrame not found"
              )
          : $
          ? v($)
          : n(" In page link #" + N + " not found")
      }
      function he() {
        switch (w.type) {
          case "close":
            g(w.iframe), l.resizedCallback(w)
            break
          case "message":
            C(I(6))
            break
          case "scrollTo":
            le(!1)
            break
          case "scrollToOffset":
            le(!0)
            break
          case "inPageLink":
            ge(I(9))
            break
          case "reset":
            d(w)
            break
          case "init":
            p(), l.initCallback(w.iframe)
            break
          default:
            p()
        }
      }
      var H = o.data,
        w = {}
      S() &&
        (n(" Received: " + H),
        (w = x()),
        !G() && ue() && B() && (he(), (D = !1)))
    }
    function a() {
      h === null &&
        ((h = {
          x:
            window.pageXOffset !== void 0
              ? window.pageXOffset
              : document.documentElement.scrollLeft,
          y:
            window.pageYOffset !== void 0
              ? window.pageYOffset
              : document.documentElement.scrollTop,
        }),
        n(" Get page position: " + h.x + "," + h.y))
    }
    function m() {
      h !== null &&
        (window.scrollTo(h.x, h.y),
        n(" Set page position: " + h.x + "," + h.y),
        (h = null))
    }
    function d(o) {
      function p() {
        s(o), A("reset", "reset", o.iframe)
      }
      n(
        " Size reset requested by " +
          (o.type === "init" ? "host page" : "iFrame")
      ),
        a(),
        k(p, o, "init")
    }
    function s(o) {
      function p(g) {
        ;(o.iframe.style[g] = o[g] + "px"),
          n(" IFrame (" + o.iframe.id + ") " + g + " set to " + o[g] + "px")
      }
      l.sizeHeight && p("height"), l.sizeWidth && p("width")
    }
    function k(o, p, g) {
      g !== p.type && E ? (n(" Requesting animation frame"), E(o)) : o()
    }
    function A(o, p, g) {
      n("[" + o + "] Sending msg to iframe (" + p + ")"),
        g.contentWindow.postMessage(U + p, "*")
    }
    function R() {
      function o() {
        function I(C) {
          1 / 0 !== l[C] &&
            l[C] !== 0 &&
            ((S.style[C] = l[C] + "px"), n(" Set " + C + " = " + l[C] + "px"))
        }
        I("maxHeight"), I("minHeight"), I("maxWidth"), I("minWidth")
      }
      function p(I) {
        return (
          I === "" &&
            ((S.id = I = "iFrameResizer" + ee++),
            n(" Added missing iframe ID: " + I + " (" + S.src + ")")),
          I
        )
      }
      function g() {
        n(
          " IFrame scrolling " +
            (l.scrolling ? "enabled" : "disabled") +
            " for " +
            G
        ),
          (S.style.overflow = l.scrolling === !1 ? "hidden" : "auto"),
          (S.scrolling = l.scrolling === !1 ? "no" : "yes")
      }
      function x() {
        ;(typeof l.bodyMargin == "number" || l.bodyMargin === "0") &&
          ((l.bodyMarginV1 = l.bodyMargin),
          (l.bodyMargin = "" + l.bodyMargin + "px"))
      }
      function F() {
        return (
          G +
          ":" +
          l.bodyMarginV1 +
          ":" +
          l.sizeWidth +
          ":" +
          l.log +
          ":" +
          l.interval +
          ":" +
          l.enablePublicMethods +
          ":" +
          l.autoResize +
          ":" +
          l.bodyMargin +
          ":" +
          l.heightCalculationMethod +
          ":" +
          l.bodyBackground +
          ":" +
          l.bodyPadding +
          ":" +
          l.tolerance
        )
      }
      function B(I) {
        e(S, "load", function () {
          var C = D
          A("iFrame.onload", I, S),
            !C &&
              l.heightCalculationMethod in Y &&
              d({
                iframe: S,
                height: 0,
                width: 0,
                type: "init",
              })
        }),
          A("init", I, S)
      }
      var S = this,
        G = p(S.id)
      g(), o(), x(), B(F())
    }
    function Z(o) {
      if (typeof o != "object") throw new TypeError("Options is not an object.")
    }
    function j(o) {
      ;(o = o || {}), Z(o)
      for (var p in y)
        y.hasOwnProperty(p) && (l[p] = o.hasOwnProperty(p) ? o[p] : y[p])
    }
    function q() {
      function o(p) {
        if (!p.tagName) throw new TypeError("Object is not a valid DOM element")
        if (p.tagName.toUpperCase() !== "IFRAME")
          throw new TypeError(
            "Expected <IFRAME> tag, found <" + p.tagName + ">."
          )
        R.call(p)
      }
      return function (p, g) {
        switch ((j(p), typeof g)) {
          case "undefined":
          case "string":
            Array.prototype.forEach.call(
              document.querySelectorAll(g || "iframe"),
              o
            )
            break
          case "object":
            o(g)
            break
          default:
            throw new TypeError("Unexpected data type (" + typeof g + ").")
        }
      }
    }
    function de(o) {
      o.fn.iFrameResize = function (p) {
        return j(p), this.filter("iframe").each(R).end()
      }
    }
    var ee = 0,
      D = !0,
      te = "message",
      ie = te.length,
      U = "[iFrameSizer]",
      T = U.length,
      O = "",
      h = null,
      E = window.requestAnimationFrame,
      Y = {
        max: 1,
        scroll: 1,
        bodyScroll: 1,
        documentElementScroll: 1,
      },
      l = {},
      y = {
        autoResize: !0,
        bodyBackground: null,
        bodyMargin: null,
        bodyMarginV1: 8,
        bodyPadding: null,
        checkOrigin: !0,
        enablePublicMethods: !1,
        heightCalculationMethod: "offset",
        interval: 32,
        log: !1,
        maxHeight: 1 / 0,
        maxWidth: 1 / 0,
        minHeight: 0,
        minWidth: 0,
        scrolling: !1,
        sizeHeight: !0,
        sizeWidth: !1,
        tolerance: 0,
        closedCallback: function () {},
        initCallback: function () {},
        messageCallback: function () {},
        resizedCallback: function () {},
        scrollCallback: function () {
          return !0
        },
      }
    i(),
      e(window, "message", f),
      window.jQuery && de(jQuery),
      typeof define == "function" && define.amd
        ? define([], q)
        : typeof exports == "object"
        ? (module.exports = q())
        : (window.iFrameResize = q())
  }
  pe()
  function ne() {
    "use strict"
    var e = {
      createWidget: function () {
        iFrameResize({
          log: !1,
          checkOrigin: !1,
          enablePublicMethods: !0,
          resizedCallback: function (i) {
            for (
              var t = document.getElementsByClassName("containerModal"), r = 0;
              r < t.length;
              r++
            )
              t[r].getElementsByTagName("iframe").length > 0 &&
                (t[r].style.position = "absolute")
          },
        })
      },
    }
    ;(window.onload = function () {
      e.createWidget()
    }),
      e.createWidget()
  }
  ne()
  var we = (e) => {
    let { shadow: i } = e
    return `${i?.horizontal}px ${i?.vertical}px ${i?.blur}px ${i?.spread}px #${i?.color}`
  }
  function J(e) {
    try {
      return decodeURIComponent(e)
    } catch {}
  }
  function be(e) {
    for (var i = e.split("&"), t = {}, r = 0; r < i.length; r++) {
      var n = i[r].split("="),
        c = J(n[0]),
        f = J(n[1])
      if (typeof t[c] > "u") t[c] = J(f)
      else if (typeof t[c] == "string") {
        var a = [t[c], J(f)]
        t[c] = a
      } else t[c].push(J(f))
    }
    return t
  }
  var X = document.getElementsByTagName("iframe"),
    ae = []
  for (let e = 0; e < X.length; e++)
    X[e].id && !ae.includes(X[e].id) && ae.push(X[e].id)
  function xe(e) {
    try {
      let i = window[e],
        t = "__storage_test__"
      return i.setItem(t, t), i.removeItem(t), !0
    } catch {
      return !1
    }
  }
  function ve(e) {
    if (!xe("localStorage")) return
    let i = localStorage.getItem(e)
    if (!i) return null
    let t = JSON.parse(i)
    return new Date().getTime() > t.expiry
      ? (localStorage.removeItem(e), null)
      : t.value
  }
  if (!document.getElementById("embeddedIframes")) {
    let e = (i) => {
      let t = document.createElement("style")
      return (
        (t.type = "text/css"),
        (t.innerText = i),
        (t.id = "embeddedIframes"),
        document.head.appendChild(t),
        t
      )
    }
    ;(me =
      ".ep-header,.ep-iFrameContainer,.ep-overlay{display:none}.ep-iFrame{border:none}.ep-iFrameLarge{height:500px;overflow:auto}.ep-overflow{overflow:unset}.ep-overlay{z-index:10000;position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);transition:opacity .2s;width:100%;justify-content:center;align-items:center}.ep-wrapper{width:100%}.ep-header{justify-content:flex-end;position:fixed;border-radius:5px;z-index:1}.ep-close-icon,.ep-minimize-icon{background:#e8e8e8;width:23px;height:23px;margin:3px 6px 0 0;z-index:999;color:#4a4a4a;transition:background .25s;text-align:center;cursor:pointer}.ep-minimize-icon{border-radius:50%;line-height:.3ch;font-size:22px;border:1px solid #ccc;font-family:sans-serif}.ep-close-icon{border-radius:50%;line-height:1.5ch;font-size:20px;border:1px solid #ccc;font-family:Montserrat}.ep-minimize-text-container{height:100%;text-align:center}.ep-minimize-tc-sticky{writing-mode:vertical-lr;justify-content:center}.ep-minimize-tc-sticky-left{transform:rotate(360deg)}.ep-minimize-tc-sticky-right{transform:rotate(180deg)}.ep-minimize-tc-polite{align-items:end;width:100%}.ep-minimize-tc-polite-left{justify-content:start}.ep-minimize-tc-polite-right{justify-content:end}.ep-minimize-text{background-color:#000;cursor:pointer;color:#fff;white-space:nowrap;overflow:hidden;max-width:380px;text-overflow:ellipsis}.ep-minimize-text-polite{margin-bottom:8px}.ep-minimize-text-polite-left{margin-left:25px;margin-right:8px}.ep-minimize-text-polite-right{margin-left:8px;margin-right:25px}.ep-sticky-sidebar{top:50%;z-index:9999;position:fixed}.ep-height,.ep-sticky-sidebar .ep-wrapper{height:100%}.ep-polite-slide-in{z-index:9999;position:fixed}.ep-inline,.ep-popup{position:relative;margin:auto}.ep-polite-slide-in .ep-wrapper{position:absolute}.ep-popup{z-index:9999}.ep-inline{overflow:unset;boxshadow:none}.ep-right{right:15px}.ep-left{left:15px}.ep-bottom{bottom:15px}@media only screen and (max-width:550px){.ep-iFrame,.ep-iFrameContainer{width:100%}.ep-popup{width:100%!important}.ep-right{right:0}.ep-left{left:0}.ep-bottom{bottom:0}}"),
      e(me)
  }
  var me,
    V = {},
    L = {},
    Q = !1,
    oe = {},
    P = "STICKY_SIDEBAR",
    W = "POLITE_SLIDE_IN",
    M = "POPUP",
    _ = "INLINE",
    b = {}
  function Ie({ id: e, borderRadius: i, boxShadow: t, height: r, layout: n }) {
    let c = document.createElement("div")
    return (
      c.setAttribute("id", `${e}-div`),
      (c.className = "ep-iFrameContainer"),
      (c.style.cssText = `border-radius: ${i}px; box-shadow: ${t};`),
      c
    )
  }
  function Ne({ id: e, iFrame: i, iFrameContainer: t }) {
    let r = document.getElementById(`${e}-overlay`)
    ;(r = document.createElement("div")),
      r.setAttribute("id", `${e}-overlay`),
      (r.className = "ep-overlay")
    let n = i.parentNode
    return (
      n ? n.appendChild(r) : document.body.appendChild(r), r.appendChild(t), r
    )
  }
  function ze({ id: e }) {
    let i = document.createElement("div")
    return i.setAttribute("id", `${e}-header`), (i.className = "ep-header"), i
  }
  function ke({
    id: e,
    layout: i,
    width: t,
    triggerType: r,
    triggerValue: n,
    height: c,
    background: f,
  }) {
    let a,
      m = document.getElementById(`${e}-header`)
    if (oe[e]) {
      m &&
        ((m.style.display = i.id === _ ? "none" : "flex"),
        (m.style.width = window.matchMedia(`(max-width: ${t}px)`).matches
          ? "100%"
          : `${t}px`))
      let d = document.getElementById(`${e}-div`),
        s = document.getElementById(`${e}-overlay`),
        k = document.getElementById(`${e}`)
      i.id !== _ &&
        ((d.style.background = `#${f}`),
        Number(c) >= 500
          ? d.classList.add("ep-iFrameLarge")
          : (i.id !== M && (d.style.height = `${Number(c)}px`),
            d.classList.add("ep-overflow"))),
        r === "showAfter" &&
          Number(n) &&
          (!Object.keys(L).length || !L[e]) &&
          (a = setTimeout(() => {
            clearTimeout(a),
              i.id === M && s && (s.style.display = "flex"),
              (d.style.display = "block"),
              (k.style.display = "block"),
              i.id !== _ &&
                (Number(c) >= 500
                  ? d.classList.add("ep-iFrameLarge")
                  : ((d.style.height = `${Number(c)}px`),
                    d.classList.add("ep-overflow")))
          }, Number(n * 1e3)))
    }
  }
  function Ee({ id: e, layout: i }) {
    let t = document.getElementById(`${e}-minimize-icon`)
    return (
      i.id !== M &&
        ((t = document.createElement("div")),
        t.setAttribute("id", `${e}-minimize-icon`),
        (t.innerText = "_"),
        (t.className = "ep-minimize-icon")),
      t
    )
  }
  function Se({ id: e, layout: i }) {
    let t = document.getElementById(`${e}-close-icon`)
    return (
      (i.id === M || (i.id !== M && !i.allowMinimize)) &&
        ((t = document.createElement("div")),
        t.setAttribute("id", `${e}-close-icon`),
        (t.innerText = "x"),
        (t.className = "ep-close-icon")),
      t
    )
  }
  function $e({ id: e, layout: i }) {
    let t = document.createElement("div")
    return (
      t.setAttribute("id", `${e}-minimize-text`),
      (t.className = "ep-minimize-text-container"),
      (t.style.display = "none"),
      i.id === P
        ? (t.classList.add("ep-minimize-tc-sticky"),
          i.isLeftAligned
            ? t.classList.add("ep-minimize-tc-sticky-left")
            : t.classList.add("ep-minimize-tc-sticky-right"))
        : i.id === W &&
          (t.classList.add("ep-minimize-tc-polite"),
          i.isLeftAligned
            ? t.classList.add("ep-minimize-tc-polite-left")
            : t.classList.add("ep-minimize-tc-polite-right")),
      t
    )
  }
  function Le({ id: e, formName: i, layout: t }) {
    let r = document.createElement("span")
    return (
      r.setAttribute("id", `${e}-minimize-text-span-`),
      (r.innerText = t.minimizedTitle || i),
      (r.className = "ep-minimize-text"),
      (r.title = t.minimizedTitle || i),
      (r.style.padding = t.id === P ? "20px 10px" : "10px 30px"),
      t.id === W &&
        (r.classList.add("ep-minimize-text-polite"),
        t.isLeftAligned
          ? r.classList.add("ep-minimize-text-polite-left")
          : r.classList.add("ep-minimize-text-polite-right")),
      r
    )
  }
  function Me({
    iFrameContainer: e,
    wrapperDiv: i,
    height: t,
    layout: r,
    width: n,
  }) {
    e.classList.add("ep-sticky-sidebar"),
      r.isRightAligned
        ? e.classList.add("ep-right")
        : e.classList.add("ep-left"),
      Number(t) >= 500
        ? (e.style.marginTop = "-250px")
        : (e.style.marginTop = `-${t / 2}px`)
  }
  function Te({ iFrameContainer: e, wrapperDiv: i, width: t, layout: r }) {
    r.isRightAligned
      ? e.classList.add("ep-right", "ep-polite-slide-in", "ep-bottom")
      : e.classList.add("ep-left", "ep-polite-slide-in", "ep-bottom")
  }
  function Ce({ iFrameContainer: e, iFrame: i, width: t }) {
    ;(e.style.width = window.matchMedia(`(max-width: ${t}px)`).matches
      ? "100%"
      : `${t}px`),
      e.classList.add("ep-popup")
  }
  function Ae({
    activationType: e,
    getIframeDetails: i,
    activationValue: t,
    deactivationType: r,
    deactivationValue: n,
    id: c,
  }) {
    e === "activateOnVisit" && Number(t)
      ? ((Q = i.visit >= Number(t)),
        (r === "leadCollected" && i.leadCollected) ||
        (Q && r === "deactivateAfter" && i.visit - Number(t) >= Number(n))
          ? (L[c] = !0)
          : Q || (L[c] = !0))
      : r === "leadCollected" && i.leadCollected
      ? (L[c] = !0)
      : r === "deactivateAfter" && (L[c] = i.visit > Number(n))
  }
  function _e({
    triggerValue: e,
    activationType: i,
    iframeActivated: t,
    layout: r,
    overlay: n,
    header: c,
    iFrameContainer: f,
    iFrame: a,
    height: m,
    id: d,
  }) {
    window.addEventListener("scroll", () => {
      ;(r.id === _ ||
        document.getElementById(`${d}-minimize-text`)?.style.display ===
          "none") &&
        !L[d] &&
        Number(e) &&
        (i === "alwaysActivated" || t) &&
        (document.body.offsetHeight - window.innerHeight) * (Number(e) / 100) <=
          Math.round(window.scrollY) &&
        (r.id === M && (n.style.display = "flex"),
        (f.style.display = "block"),
        r.id !== _ &&
          ((c.style.display = "flex"),
          Number(m) >= 500
            ? f.classList.add("ep-iFrameLarge")
            : ((f.style.height = `${Number(m)}px`),
              f.classList.add("ep-overflow"))),
        (a.style.display = "block"))
    })
  }
  function Oe({
    iFrameContainer: e,
    iFrame: i,
    header: t,
    width: r,
    border: n,
    layout: c,
    id: f,
    height: a,
  }) {
    window.matchMedia(`(max-width: ${r}px)`).addListener((d) => {
      d.matches
        ? (document.getElementById(`${f}-minimize-text`)?.style.display ===
          "none"
            ? ((e.style.width = "100%"), (i.style.width = "100%"))
            : c.id === W && (e.style.width = "50%"),
          (t.style.width = "100%"))
        : (document.getElementById(`${f}-minimize-text`)?.style.display ===
          "none"
            ? (e.style.width = `${r}px`)
            : ((e.style.marginTop =
                Number(a) >= 500 ? "-250px" : `-${a / 2}px`),
              c.id === P && (e.style.width = "50px")),
          (t.style.width = `${r}px`))
    })
  }
  function Fe({
    closeIconEle: e,
    iFrameContainer: i,
    overlay: t,
    layout: r,
    id: n,
  }) {
    e.addEventListener("click", () => {
      ;(i.style.display = "none"),
        r.id === M && (t.style.display = "none"),
        (L = {
          ...L,
          [n]: !0,
        })
    })
  }
  function Be({
    minimizeIconEle: e,
    iFrame: i,
    header: t,
    height: r,
    wrapperDiv: n,
    iFrameContainer: c,
    minimizeTextEle: f,
    layout: a,
    width: m,
  }) {
    e.addEventListener("click", () => {
      ;(i.style.display = "none"),
        (t.style.display = "none"),
        (c.style.boxShadow = "none"),
        (c.style.background = "transparent"),
        a.id === W && ((c.style.height = "50px"), (c.style.width = "50%")),
        a.id === P &&
          (Number(r) <= 500 && (n.style.height = "100%"),
          (c.style.width = "50px")),
        (f.style.display = "flex"),
        (f.firstChild.style.borderRadius =
          a.id === P ? "0px 8px 8px 0px" : "8px 8px 0px 0px"),
        (c.style.border = "none")
    })
  }
  function Re({
    minimizeTextEle: e,
    iFrame: i,
    iFrameContainer: t,
    header: r,
    styles: n,
    height: c,
    width: f,
    formId: a,
    shadow: m,
  }) {
    e.firstChild.addEventListener("click", () => {
      ;(i.style.display = "block"),
        (t.style.boxShadow = m),
        (e.style.display = "none"),
        window.matchMedia(`(max-width: ${f}px)`).matches
          ? ((t.style.width = "100%"), (i.style.width = "100%"))
          : (t.style.width = `${f}px`),
        window.matchMedia(`(max-width: ${f}px)`).matches &&
          (t.style.marginTop = `-${c / 2}px`),
        (t.style.height = Number(c) >= 500 ? "500px" : `${Number(c)}px`),
        (t.style.background = `#${n[a]}`),
        (r.style.display = "flex")
    })
  }
  function fe(e) {
    return (
      e?.src.includes("/form") ||
      e?.src.includes("/survey") ||
      e?.src.includes("/booking") ||
      e?.src.includes("/group")
    )
  }
  function Pe(e) {
    return (
      e?.src.includes("/survey") ||
      e?.src.includes("/booking") ||
      e?.src.includes("/group")
    )
  }
  function re(e) {
    if (!!e)
      return (
        e.includes("'") && !e.includes('"')
          ? (e = JSON.parse(e.replace(/'/g, '"')))
          : (e = JSON.parse(e)),
        e
      )
  }
  window.onmessage = function (e) {
    if (
      (e.data[0] === "iframeLoaded" && ne(), e.data[0] == "fetch-query-params")
    ) {
      let n
      e.data[4] &&
        ((n = JSON.parse(e.data[4])),
        (b = {
          ...b,
          [e.data[3]]: {
            background: n.background,
            width: n.width,
            height: n.ac_branding
              ? n.height + (n.headerImageSrc ? 430 : 155)
              : n.height + (n.headerImageSrc ? 310 : 35),
            border: n.border,
            boxShadow: we(n),
          },
        }))
      var i = location.search.substring(1),
        t = ve(`v3_first_session_event_${e.data[2]}`)
      V = be(i)
      var r = new URL(document.location.href)
      t &&
        t.url_params &&
        Object.keys(t.url_params).forEach(function (f) {
          f && t.url_params[f] && r.searchParams.append(f, t.url_params[f])
        })
      let c = document.querySelectorAll("iframe[id]")
      for (let f of c) {
        let a = f,
          m = a.id,
          d = a?.dataset?.formId,
          s = a?.dataset?.layout
        if (!fe(a)) continue
        let k = a?.dataset?.triggerType,
          A = a?.dataset?.triggerValue,
          R = a?.dataset?.activationType,
          Z = a?.dataset?.activationValue,
          j = a?.dataset?.deactivationType,
          q = a?.dataset?.deactivationValue,
          de = a?.dataset?.isSurvey,
          ee = b[d]?.border.border,
          D = b[d]?.border?.radius,
          te = b[d]?.boxShadow,
          ie = a?.dataset?.formName
        if (!s) {
          Pe(f) &&
            a.contentWindow.postMessage(
              [
                "query-params",
                V,
                r.toString(),
                t?.referrer ? t?.referrer : document.referrer,
                m,
              ],
              "*"
            )
          continue
        }
        if ((s && (s = re(s)), a.parentNode?.id === `${m}-wrapper`))
          return a.contentWindow.postMessage(
            [
              "query-params",
              V,
              r.toString(),
              t?.referrer ? t?.referrer : document.referrer,
              `${a?.dataset?.layoutIframeId}`,
            ],
            "*"
          )
        let T = localStorage.getItem(`embedded_iframe_${m}`)
        T
          ? ((T = JSON.parse(T)),
            (T.visit = T.visit + 1),
            localStorage.setItem(`embedded_iframe_${m}`, JSON.stringify(T)))
          : (localStorage.setItem(
              `embedded_iframe_${m}`,
              JSON.stringify({
                id: m,
                visit: 1,
                layout: s,
              })
            ),
            (T = {
              id: m,
              visit: 1,
            }))
        let O,
          h,
          E,
          Y,
          l = b[d]?.height || a?.dataset?.height,
          y = Ie({
            id: m,
            borderRadius: D,
            boxShadow: te,
            height: l,
            layout: s,
          }),
          o = Se({
            id: m,
            layout: s,
          }),
          p = Ee({
            id: m,
            layout: s,
          }),
          g = document.createElement("div")
        if (
          (g.setAttribute("id", `${m}-wrapper`),
          (g.className = "ep-wrapper"),
          (g.style.cssText = `border-radius: ${D}px`),
          s.id !== _)
        ) {
          if (
            ((a.style.border = "none"),
            s.id === M
              ? (a.style.position = null)
              : ((a.style.height = `${l}px`),
                (a.style.position = s.id === W ? "relative" : "absolute")),
            s.id === M)
          )
            O = Ne({
              id: m,
              iFrame: a,
              iFrameContainer: y,
            })
          else {
            let x = a.parentNode
            x ? x.appendChild(y) : document.body.appendChild(y)
          }
          g?.appendChild(a),
            y.appendChild(g),
            s.id === P &&
              Me({
                iFrameContainer: y,
                wrapperDiv: g,
                height: l,
                width: b[d]?.width,
                layout: s,
              }),
            s.id === W &&
              Te({
                iFrameContainer: y,
                wrapperDiv: g,
                width: b[d]?.width,
                layout: s,
              }),
            s.id === M &&
              Ce({
                iFrameContainer: y,
                iFrame: a,
                width: b[d]?.width,
              }),
            (h = ze({
              id: m,
            })),
            g.insertBefore(h, a),
            (y.style.width = window.matchMedia(`(max-width: ${b[d]?.width}px)`)
              .matches
              ? "100%"
              : `${b[d]?.width}px`),
            (a.style.width = window.matchMedia(`(max-width: ${b[d]?.width}px)`)
              .matches
              ? "100%"
              : `${b[d]?.width}px`),
            (h.style.width = window.matchMedia(`(max-width: ${b[d]?.width}px)`)
              .matches
              ? "100%"
              : `${b[d]?.width}px`),
            Oe({
              iFrameContainer: y,
              iFrame: a,
              header: h,
              width: b[d]?.width,
              border: ee,
              layout: s,
              id: m,
              height: l,
            }),
            p &&
              (s.allowMinimize || (p.style.display = "none"), h.appendChild(p)),
            o && h.appendChild(o),
            (E = $e({
              id: m,
              layout: s,
            })),
            (Y = Le({
              id: m,
              formName: ie,
              layout: s,
            })),
            E.appendChild(Y),
            g.insertBefore(E, a)
        } else {
          let x = a.parentNode
          x ? x.appendChild(y) : document.body.appendChild(y),
            g?.appendChild(a),
            y.appendChild(g)
        }
        /************************************************ */
        // NOTE: main postMessage
        // postMessage fires twice for query-params.
        // Once here, and then on line 1155'ish.
        // The second one uses dataset.layoutIframeId instead of id for the 5th parameter
        // even though they are likely the same in all cases. Maybe backwards compatibility?
        /************************************************ */
        // fe(f) tests if iframe.src includes "form" || "survey" || etc.
        fe(f) &&
          a.contentWindow.postMessage(
            [
              // Command
              "query-params",
              // V = query params object
              V,
              // r = new URL(document.location.href) [line 883]
              r.toString(),
              // t = ve(`v3_first_session_event_${e.data[2]}`) [line 881]
              t?.referrer ? t?.referrer : document.referrer,
              // m = [id of iframe] 'inline-PsgoZg5Z6dLVVKrDn9oX' [line 892]
              m,
            ],
            "*"
          ),
          Ae({
            activationType: R,
            getIframeDetails: T,
            activationValue: Z,
            deactivationType: j,
            deactivationValue: q,
            id: m,
          }),
          L[m] && j !== "neverDeactivate"
            ? ((a.style.display = "none"),
              (y.style.display = "none"),
              O && (O.style.display = "none"))
            : k === "showOnScrolling" && Number(A)
            ? _e({
                triggerValue: A,
                activationType: R,
                iframeActivated: Q,
                layout: s,
                overlay: O,
                header: h,
                iFrameContainer: y,
                iFrame: a,
                height: l,
                id: m,
              })
            : !Number(A) &&
              (R === "alwaysActivated" || Q) &&
              (s.id !== _ &&
                (Number(l) >= 500
                  ? y.classList.add("ep-iFrameLarge")
                  : (s.id !== M && (y.style.height = `${Number(l)}px`),
                    y.classList.add("ep-overflow"))),
              s.id === M && (O.style.display = "flex"),
              (y.style.display = "block"),
              (a.style.display = "block")),
          s.id !== _ &&
            (o &&
              Fe({
                closeIconEle: o,
                iFrameContainer: y,
                overlay: O,
                layout: s,
                id: m,
              }),
            p &&
              Be({
                minimizeIconEle: p,
                iFrame: a,
                header: h,
                height: l,
                wrapperDiv: g,
                iFrameContainer: y,
                minimizeTextEle: E,
                layout: s,
                width: b[d]?.width,
              }),
            E &&
              Re({
                minimizeTextEle: E,
                iFrame: a,
                iFrameContainer: y,
                header: h,
                styles: b,
                height: l,
                width: b[d]?.width,
                formId: d,
                shadow: b[d]?.boxShadow,
              })),
          a.contentWindow.postMessage(
            [
              "query-params",
              V,
              r.toString(),
              t?.referrer ? t?.referrer : document.referrer,
              `${a?.dataset?.layoutIframeId}`,
            ],
            "*"
          ),
          c.forEach((x) => {
            if (x.src.includes("/form")) {
              let F = x.dataset.formId
              x.onload = function () {
                let B
                ;(B = re(x?.dataset?.layout)),
                  B &&
                    ((oe = {
                      ...oe,
                      [x.dataset.layoutIframeId]: !0,
                    }),
                    ke({
                      id: x.dataset.layoutIframeId,
                      layout: B,
                      width: b[F]?.width,
                      height: b[F]?.height || x.dataset.height,
                      triggerValue: x.dataset.triggerValue,
                      triggerType: x.dataset.triggerType,
                      background: b[F]?.background,
                    }))
              }
            }
          })
      }
    } else if (e.data[0] == "fetch-sticky-contacts") {
      let n = (d) => {
          let s
          if (typeof localStorage < "u")
            try {
              s = localStorage.getItem(d)
            } catch {}
          return s
        },
        c = (d) => {
          try {
            let s
            return (
              typeof localStorage !== void 0 &&
                (s = localStorage.getItem("_ud")),
              s
            )
          } catch {
            return null
          }
        },
        f = (d) => {
          let s = d
          return d && typeof s == "string" && (s = JSON.parse(s)), s
        },
        a = (d) => {
          let s = c(d),
            k = f(s)
          if (k && "location_id" in k) {
            let { location_id: A } = k
            return A === d ? k : null
          }
          return null
        }
      document.querySelectorAll("iframe[id]").forEach((d) => {
        d?.contentWindow.postMessage(
          ["sticky-contacts", a(e.data[1]), n(e.data[1])],
          "*"
        )
      })
    } else if (e.data[0] == "set-sticky-contacts" && typeof localStorage < "u")
      try {
        if (e.data[1] && e.data[2])
          if (e.data[1] === `embedded_iframe_${e.data[2]}`) {
            let n = localStorage.getItem(`embedded_iframe_${e.data[2]}`),
              c = 5e3,
              f,
              a = re(document.getElementById(ae[0]).dataset.layout)
            if (n) {
              ;(n = JSON.parse(n)),
                localStorage.setItem(
                  `embedded_iframe_${e.data[2]}`,
                  JSON.stringify({
                    ...n,
                    leadCollected: !0,
                  })
                )
              let m = document.getElementById(`${e.data[2]}-overlay`),
                d = document.getElementById(`${e.data[2]}-div`)
              a.id !== _ &&
                (f = setTimeout(() => {
                  clearTimeout(f),
                    m && (m.style.display = "none"),
                    d && ((d.style.display = "none"), (L[e.data[2]] = !0))
                }, c))
            }
          } else localStorage.setItem(e.data[1], e.data[2])
        e.data[3] && e.data[4] && localStorage.setItem(e.data[3], e.data[4])
      } catch (n) {
        console.error(n)
      }
  }
})()
