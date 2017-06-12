(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LoadingBar = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

var cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

var isHTMLElement = function isHTMLElement(el) {
  return el instanceof HTMLElement;
};

var mapStyleToElement = function mapStyleToElement(el, style) {
  for (var prop in style) {
    if (prop in el.style) {
      el.style[prop] = style[prop];
    }
  }
};

var removeChild = function removeChild(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

var easing = function easing(t, b, c, d) {
  return c * t / d + b;
};

var LoadingBar = function () {
  function LoadingBar(el, options) {
    classCallCheck(this, LoadingBar);

    // set a new options if now options provided
    options = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};
    // define default options
    var defaultOptions = {
      height: '2px',
      backgroundColor: 'blue'
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // main options used in the library, merge default option & use options
    this.options = _extends({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;
    this.speed = 800;
    this.requestId = null;

    var barWidth = void 0;
    Object.defineProperties(this, {
      // constant max width
      'maxWidth': { value: 100 },
      // limit bar width
      'barWidth': {
        get: function get$$1() {
          return barWidth;
        },
        set: function set$$1(value) {
          if (value < 0) value = 0;
          // set to 0 if width touch 100%
          if (value > 100) value = 100;
          barWidth = value;
        }
      }
    });

    // set barWidth property
    this.barWidth = 0;

    // define height property of the option
    var barHeight = void 0;
    Object.defineProperty(this.options, 'height', {
      get: function get$$1() {
        return barHeight;
      },
      set: function set$$1(value) {
        var numValue = parseInt(value);
        // limit max height & min height
        if (numValue > 5) value = 5 + 'px';
        if (numValue <= 0) value = 1 + 'px';
        barHeight = value;
      }
    });

    // set height property
    this.options.height = options.height || defaultOptions.height;

    this._init();
  }

  createClass(LoadingBar, [{
    key: '_init',
    value: function _init() {
      // if wrapper supplied, use it, or create a new wrapper which fixed at the top of screen
      !isHTMLElement(this.el) && this._createElement();
      this._createChildElement();
    }
  }, {
    key: '_createElement',
    value: function _createElement() {
      this.el = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(this.el);

      this.el.style.position = 'fixed';
      this.el.style.top = 0;
      this.el.style.left = 0;
      this.el.style.right = 0;
      this.el.style.height = this.options.height;
      this.el.style.backgroundColor = 'red';
    }
  }, {
    key: '_createChildElement',
    value: function _createChildElement() {
      removeChild(this.el);
      this.childEl = document.createElement('div');
      this.el.appendChild(this.childEl);

      mapStyleToElement(this.childEl, this.options);
      // overwrite the style 
      // first render width to 0
      this._renderBar();
      this.childEl.style.height = '100%';
    }

    /**
     * render the child element width to new width
     * 
     * 
     * @memberof LoadingBar
     */

  }, {
    key: '_renderBar',
    value: function _renderBar() {
      this.childEl.style.width = this.barWidth + '%';
    }

    /**
     * grow child element width
     * 
     * @param {any} dt control speed of different cpu speed
     * 
     * @memberof LoadingBar
     */

  }, {
    key: '_update',
    value: function _update(dt, num) {
      this.barWidth = easing(dt, this.barWidth, num - this.barWidth, 0.3);
    }

    /**
     * main animate function of the library
     * control all behavior
     * 
     * @param {number} num where the bar goes to
     * 
     * @memberof LoadingBar
     */

  }, {
    key: '_grow',
    value: function _grow(num) {
      var now = Date.now();
      var dt = (now - this.lastTime) / 1000;

      this._update(dt, num);
      this._renderBar();

      this.lastTime = now;

      if (this.barWidth > num) this.pause();

      // bind context, run animate again
      if (this.isAnimating) this.requestId = rAF(this._grow.bind(this, num));
    }
  }, {
    key: 'growTo',
    value: function growTo(num) {
      cAF(this.requestId);
      this.isAnimating = true;
      this.lastTime = Date.now();
      this._grow(num);
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.barWidth = 0;
        this.lastTime = Date.now();
        this._grow(30);
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      cAF(this.requestId);
      this.isAnimating = false;
    }
  }, {
    key: 'loading',
    value: function loading() {}
  }, {
    key: 'done',
    value: function done() {}
  }]);
  return LoadingBar;
}();

return LoadingBar;

})));
