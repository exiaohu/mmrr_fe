!function (e) {
  let t;
  let n;
  let o;
  let i;
  let c;
  let d;
  let a = '<svg><symbol id="icon-ionic" viewBox="0 0 1024 1024"><path d="M847.184 265.608C854.012 255.428 858 243.18 858 230c0-35.35-28.66-64-64-64-13.18 0-25.428 3.988-35.61 10.818C689.418 126.03 604.22 96 512 96 282.25 96 96 282.25 96 512c0 229.754 186.25 416 416 416 229.746 0 416-186.246 416-416C928 419.778 897.968 334.58 847.184 265.608zM783.66 783.664c-35.292 35.292-76.382 62.998-122.128 82.348-47.344 20.024-97.652 30.178-149.532 30.178-51.88 0-102.19-10.154-149.534-30.178-45.746-19.35-86.834-47.054-122.128-82.348s-63-76.382-82.348-122.128C137.964 614.192 127.81 563.88 127.81 512c0-51.88 10.154-102.19 30.178-149.534 19.348-45.746 47.054-86.834 82.348-122.128s76.382-63 122.128-82.348C409.81 137.964 460.12 127.81 512 127.81c51.878 0 102.188 10.154 149.532 30.178 26.892 11.374 52.16 25.66 75.604 42.654C732.586 209.438 730 219.414 730 230c0 35.35 28.654 64 64 64 10.586 0 20.56-2.586 29.356-7.136 16.996 23.442 31.282 48.71 42.654 75.602 20.026 47.344 30.18 97.654 30.18 149.534 0 51.878-10.154 102.192-30.18 149.536C846.66 707.282 818.956 748.372 783.66 783.664z"  ></path><path d="M512.006 512m-192 0a96 96 0 1 0 384 0 96 96 0 1 0-384 0Z"  ></path></symbol></svg>';
  var s = (s = document.getElementsByTagName("script"))[s.length - 1].getAttribute("data-injectcss");
  if (s && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0;
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
    } catch (e) {
      console && console.log(e)
    }
  }

  function l() {
    c || (c = !0, o())
  }

  t = function () {
    let e;
    let t;
    let n;
    let o;
    (o = document.createElement("div")).innerHTML = a, a = null, (n = o.getElementsByTagName("svg")[0]) && (n.setAttribute("aria-hidden", "true"), n.style.position = "absolute", n.style.width = 0, n.style.height = 0, n.style.overflow = "hidden", e = n, (t = document.body).firstChild ? (o = e, (n = t.firstChild).parentNode.insertBefore(o, n)) : t.appendChild(e))
  }, document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(t, 0) : (n = function () {
    document.removeEventListener("DOMContentLoaded", n, !1), t()
  }, document.addEventListener("DOMContentLoaded", n, !1)) : document.attachEvent && (o = t, i = e.document, c = !1, (d = function () {
    try {
      i.documentElement.doScroll("left")
    } catch (e) {
      return void setTimeout(d, 50)
    }
    l()
  })(), i.onreadystatechange = function () {
    i.readyState == "complete" && (i.onreadystatechange = null, l())
  })
}(window);
