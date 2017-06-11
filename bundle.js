(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LoadingBar = factory());
}(this, (function () { 'use strict';

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

var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

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

var LoadingBar = function () {
  function LoadingBar(el, options) {
    classCallCheck(this, LoadingBar);

    // define default options
    var defaultOptions = {
      height: '4px',
      backgroundColor: 'orange',
      speed: 10
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);

    // define barWidth property, limit between 0 and 100;
    var barWidth = void 0;
    Object.defineProperty(this, 'barWidth', {
      get: function get$$1() {
        return barWidth;
      },
      set: function set$$1(value) {
        if (value < 0) value = 0;
        if (value > 100) value = 0;
        barWidth = value;
      }
    });
    this.barWidth = 0;

    // define height property of the option
    var barHeight = void 0;
    Object.defineProperty(this.options, 'height', {
      get: function get$$1() {
        return barHeight;
      },
      set: function set$$1(value) {
        var numValue = parseInt(value);
        if (numValue > 10) value = 10 + 'px';
        if (numValue <= 0) value = 1 + 'px';
        barHeight = value;
      }
    });

    this.options.height = options.height || defaultOptions.height;

    this._init();
  }

  createClass(LoadingBar, [{
    key: '_init',
    value: function _init() {
      // if wrapper supplied, use it, or create a new wrapper which fixed at the top of screen
      !isHTMLElement(this.el) && this._createElement();
      this._createChildElement();
      this.lastTime = Date.now();

      this._animate();
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

      return this;
    }
  }, {
    key: '_createChildElement',
    value: function _createChildElement() {
      removeChild(this.el);
      this.childEl = document.createElement('div');
      this.el.appendChild(this.childEl);

      mapStyleToElement(this.childEl, this.options);
      // overwrite the style 
      this._renderBar();
      this.childEl.style.height = '100%';
    }
  }, {
    key: '_renderBar',
    value: function _renderBar() {
      this.childEl.style.width = this.barWidth + '%';
    }
  }, {
    key: '_animate',
    value: function _animate() {
      var now = Date.now();
      var dt = (now - this.lastTime) / 1000;

      this.grow(dt);
      this._renderBar();

      this.lastTime = now;

      rAF(this._animate.bind(this));
    }
  }, {
    key: 'grow',
    value: function grow(dt) {
      this.barWidth += this.options.speed * dt;
    }
  }, {
    key: 'start',
    value: function start() {}
  }, {
    key: 'done',
    value: function done() {}
  }]);
  return LoadingBar;
}();

return LoadingBar;

})));
