/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import Vue from "vue";
const isServer = Vue.prototype.$isServer;

const isFunction = function isFunction(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};
const isPlainObject = function isPlainObject(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
    return false;
  }
  return true;
};

export const $extend = function () {
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name];

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (name === "__proto__" || target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          src = target[name];

          // Ensure proper type for the source value
          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // Never move original objects, clone them
          target[name] = $extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/* istanbul ignore next */
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

export const webBrowserType = function () {
  var explorer = navigator.userAgent;
  var type = "Chrome";
  //ie
  if (explorer.indexOf("MSIE") >= 0) {
    type = "ie";
  }
  //firefox
  else if (explorer.indexOf("Firefox") >= 0) {
    type = "Firefox";
  }
  //Chrome
  else if (explorer.indexOf("Chrome") >= 0) {
    type = "Chrome";
  }
  //Opera
  else if (explorer.indexOf("Opera") >= 0) {
    type = "Opera";
  }
  //Safari
  else if (explorer.indexOf("Safari") >= 0) {
    type = "Safari";
  }
  //Netscape
  else if (explorer.indexOf("Netscape") >= 0) {
    type = "Netscape";
  }

  return type;
};

export const getPopperPosition = function (el, popper) {
  if (!el) return {};
  let elWidth = el.offsetWidth,
    elHeight = el.offsetHeight;
  let rTop, rLeft, rBottom;
  let Bounding = el.getBoundingClientRect();
  let { left, top, bottom, right } = Bounding;
  let screenWidth = document.body.clientWidth,
    screenHeight = document.body.clientHeight;

  /**
   * 1. 默认在下
   * 2. 下不够 在 左右
   * 3. 上下都不够在中
   */
  var centerHeight = (popper.height - elHeight) / 2;
  if (screenHeight < popper.height) {
    rTop = 0;
  }
  // 在指点元素的下面
  else if (screenHeight - bottom > popper.height) {
    rTop = bottom;
  }
  // 在指定元素的上面
  else if (top > popper.height) {
    rBottom = screenHeight - bottom + elHeight;
    // rTop = top - popper.height;
  }
  // 在指定元素的中间
  else {
    rTop = top - centerHeight;
  }

  /**
   * 1. left = - width / 2
   * 2. left = 0 
   * 3. left = width
   */
  // 确定元素的Left
  // left 居中
  let centerLeft = (popper.width - elWidth) / 2
  if (screenWidth < popper.width) {
    rLeft = 0;
  }
  // 两边都够在中
  else if (left > centerLeft && screenWidth - right > centerLeft) {
    rLeft = left - centerLeft;
  }
  // 左边不足 靠左
  else if (left < centerLeft) {
    rLeft = left
  }
  // 右边不足 靠右
  else if (screenWidth - right < centerLeft) {
    rLeft = right - popper.width;
  }

  return {
    top: rTop == null ? '' : Math.ceil(rTop),
    left: rLeft == null ? '' : Math.ceil(rLeft),
    bottom: rBottom == null ? '' : Math.ceil(rBottom)
  };
};

export const DefaultColor = [
  {
    colorStops: [
      { color: "rgb(0, 0, 0)", offset: 0 },
      { color: "rgb(255, 255, 255)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(0, 0, 0) , rgb(255, 255, 255) 100%)",
      "-moz-linear-gradient(315deg , rgb(0, 0, 0) , rgb(255, 255, 255) 100%)",
      "-ms-linear-gradient(315deg , rgb(0, 0, 0) , rgb(255, 255, 255) 100%)",
      "-o-linear-gradient(315deg , rgb(0, 0, 0) , rgb(255, 255, 255) 100%)",
      "linear-gradient(-225deg , rgb(0, 0, 0) , rgb(255, 255, 255) 100%)",
    ],
  },
  // {
  //   colorStops: [
  //     { color: "rgb(253, 235, 113)", offset: 0 },
  //     { color: "rgb(248, 216, 0)", offset: 1 }
  //   ],
  //   type: "linear",
  //   x: 0,
  //   y: 0,
  //   x2: 1,
  //   y2: 1,
  //   angle: 315,
  //   background: [
  //     "-webkit-linear-gradient(315deg , rgb(253, 235, 113) , rgb(248, 216, 0) 100%)",
  //     "-moz-linear-gradient(315deg , rgb(253, 235, 113) , rgb(248, 216, 0) 100%)",
  //     "-ms-linear-gradient(315deg , rgb(253, 235, 113) , rgb(248, 216, 0) 100%)",
  //     "-o-linear-gradient(315deg , rgb(253, 235, 113) , rgb(248, 216, 0) 100%)",
  //     "linear-gradient(-225deg , rgb(253, 235, 113) , rgb(248, 216, 0) 100%)"
  //   ]
  // },
  // {
  //   colorStops: [
  //     { color: "rgb(171, 220, 255)", offset: 0 },
  //     { color: "rgb(3, 150, 255)", offset: 1 }
  //   ],
  //   type: "linear",
  //   x: 0,
  //   y: 0,
  //   x2: 1,
  //   y2: 1,
  //   angle: 315,
  //   background: [
  //     "-webkit-linear-gradient(315deg , rgb(171, 220, 255) , rgb(3, 150, 255) 100%)",
  //     "-moz-linear-gradient(315deg , rgb(171, 220, 255) , rgb(3, 150, 255) 100%)",
  //     "-ms-linear-gradient(315deg , rgb(171, 220, 255) , rgb(3, 150, 255) 100%)",
  //     "-o-linear-gradient(315deg , rgb(171, 220, 255) , rgb(3, 150, 255) 100%)",
  //     "linear-gradient(-225deg , rgb(171, 220, 255) , rgb(3, 150, 255) 100%)"
  //   ]
  // },
  {
    colorStops: [
      { color: "rgb(254, 182, 146)", offset: 0 },
      { color: "rgb(234, 84, 85)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(254, 182, 146) , rgb(234, 84, 85) 100%)",
      "-moz-linear-gradient(315deg , rgb(254, 182, 146) , rgb(234, 84, 85) 100%)",
      "-ms-linear-gradient(315deg , rgb(254, 182, 146) , rgb(234, 84, 85) 100%)",
      "-o-linear-gradient(315deg , rgb(254, 182, 146) , rgb(234, 84, 85) 100%)",
      "linear-gradient(-225deg , rgb(254, 182, 146) , rgb(234, 84, 85) 100%)",
    ],
  },
  // {
  //   colorStops: [
  //     { color: "rgb(206, 159, 252)", offset: 0 },
  //     { color: "rgb(115, 103, 240)", offset: 1 }
  //   ],
  //   type: "linear",
  //   x: 0,
  //   y: 0,
  //   x2: 1,
  //   y2: 1,
  //   angle: 315,
  //   background: [
  //     "-webkit-linear-gradient(315deg , rgb(206, 159, 252) , rgb(115, 103, 240) 100%)",
  //     "-moz-linear-gradient(315deg , rgb(206, 159, 252) , rgb(115, 103, 240) 100%)",
  //     "-ms-linear-gradient(315deg , rgb(206, 159, 252) , rgb(115, 103, 240) 100%)",
  //     "-o-linear-gradient(315deg , rgb(206, 159, 252) , rgb(115, 103, 240) 100%)",
  //     "linear-gradient(-225deg , rgb(206, 159, 252) , rgb(115, 103, 240) 100%)"
  //   ]
  // },
  {
    colorStops: [
      { color: "rgb(144, 247, 236)", offset: 0 },
      { color: "rgb(50, 204, 188)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(144, 247, 236) , rgb(50, 204, 188) 100%)",
      "-moz-linear-gradient(315deg , rgb(144, 247, 236) , rgb(50, 204, 188) 100%)",
      "-ms-linear-gradient(315deg , rgb(144, 247, 236) , rgb(50, 204, 188) 100%)",
      "-o-linear-gradient(315deg , rgb(144, 247, 236) , rgb(50, 204, 188) 100%)",
      "linear-gradient(-225deg , rgb(144, 247, 236) , rgb(50, 204, 188) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(255, 246, 183)", offset: 0 },
      { color: "rgb(246, 65, 108)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(255, 246, 183) , rgb(246, 65, 108) 100%)",
      "-moz-linear-gradient(315deg , rgb(255, 246, 183) , rgb(246, 65, 108) 100%)",
      "-ms-linear-gradient(315deg , rgb(255, 246, 183) , rgb(246, 65, 108) 100%)",
      "-o-linear-gradient(315deg , rgb(255, 246, 183) , rgb(246, 65, 108) 100%)",
      "linear-gradient(-225deg , rgb(255, 246, 183) , rgb(246, 65, 108) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(247, 97, 161)", offset: 0 },
      { color: "rgb(140, 27, 171)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(247, 97, 161) , rgb(140, 27, 171) 100%)",
      "-moz-linear-gradient(315deg , rgb(247, 97, 161) , rgb(140, 27, 171) 100%)",
      "-ms-linear-gradient(315deg , rgb(247, 97, 161) , rgb(140, 27, 171) 100%)",
      "-o-linear-gradient(315deg , rgb(247, 97, 161) , rgb(140, 27, 171) 100%)",
      "linear-gradient(-225deg , rgb(247, 97, 161) , rgb(140, 27, 171) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(240, 95, 87)", offset: 0 },
      { color: "rgb(54, 9, 64)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(240, 95, 87) , rgb(54, 9, 64) 100%)",
      "-moz-linear-gradient(315deg , rgb(240, 95, 87) , rgb(54, 9, 64) 100%)",
      "-ms-linear-gradient(315deg , rgb(240, 95, 87) , rgb(54, 9, 64) 100%)",
      "-o-linear-gradient(315deg , rgb(240, 95, 87) , rgb(54, 9, 64) 100%)",
      "linear-gradient(-225deg , rgb(240, 95, 87) , rgb(54, 9, 64) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(255, 111, 216)", offset: 0 },
      { color: "rgb(56, 19, 194)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(255, 111, 216) , rgb(56, 19, 194) 100%)",
      "-moz-linear-gradient(315deg , rgb(255, 111, 216) , rgb(56, 19, 194) 100%)",
      "-ms-linear-gradient(315deg , rgb(255, 111, 216) , rgb(56, 19, 194) 100%)",
      "-o-linear-gradient(315deg , rgb(255, 111, 216) , rgb(56, 19, 194) 100%)",
      "linear-gradient(-225deg , rgb(255, 111, 216) , rgb(56, 19, 194) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(129, 255, 239)", offset: 0 },
      { color: "rgb(240, 103, 180)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(129, 255, 239) , rgb(240, 103, 180) 100%)",
      "-moz-linear-gradient(315deg , rgb(129, 255, 239) , rgb(240, 103, 180) 100%)",
      "-ms-linear-gradient(315deg , rgb(129, 255, 239) , rgb(240, 103, 180) 100%)",
      "-o-linear-gradient(315deg , rgb(129, 255, 239) , rgb(240, 103, 180) 100%)",
      "linear-gradient(-225deg , rgb(129, 255, 239) , rgb(240, 103, 180) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(255, 168, 168)", offset: 0 },
      { color: "rgb(252, 255, 0)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(255, 168, 168) , rgb(252, 255, 0) 100%)",
      "-moz-linear-gradient(315deg , rgb(255, 168, 168) , rgb(252, 255, 0) 100%)",
      "-ms-linear-gradient(315deg , rgb(255, 168, 168) , rgb(252, 255, 0) 100%)",
      "-o-linear-gradient(315deg , rgb(255, 168, 168) , rgb(252, 255, 0) 100%)",
      "linear-gradient(-225deg , rgb(255, 168, 168) , rgb(252, 255, 0) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(255, 207, 113)", offset: 0 },
      { color: "rgb(35, 118, 221)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(255, 207, 113) , rgb(35, 118, 221) 100%)",
      "-moz-linear-gradient(315deg , rgb(255, 207, 113) , rgb(35, 118, 221) 100%)",
      "-ms-linear-gradient(315deg , rgb(255, 207, 113) , rgb(35, 118, 221) 100%)",
      "-o-linear-gradient(315deg , rgb(255, 207, 113) , rgb(35, 118, 221) 100%)",
      "linear-gradient(-225deg , rgb(255, 207, 113) , rgb(35, 118, 221) 100%)",
    ],
  },
  {
    colorStops: [
      { color: "rgb(238, 154, 229)", offset: 0 },
      { color: "rgb(89, 97, 249)", offset: 1 },
    ],
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    angle: 315,
    background: [
      "-webkit-linear-gradient(315deg , rgb(238, 154, 229) , rgb(89, 97, 249) 100%)",
      "-moz-linear-gradient(315deg , rgb(238, 154, 229) , rgb(89, 97, 249) 100%)",
      "-ms-linear-gradient(315deg , rgb(238, 154, 229) , rgb(89, 97, 249) 100%)",
      "-o-linear-gradient(315deg , rgb(238, 154, 229) , rgb(89, 97, 249) 100%)",
      "linear-gradient(-225deg , rgb(238, 154, 229) , rgb(89, 97, 249) 100%)",
    ],
  },
];
