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

var LoadingBar = function () {
  function LoadingBar(el, options) {
    classCallCheck(this, LoadingBar);

    console.log(options);
    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    var defaultOptions = {
      height: '30px',
      backgroundColor: 'orange'
    };

    this.options = Object.assign({}, defaultOptions, options);

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
      !isHTMLElement(this.el) && this._createElement();
      this._initStyle();
    }
  }, {
    key: '_initStyle',
    value: function _initStyle() {
      mapStyleToElement(this.el, this.options);
    }
  }, {
    key: '_createElement',
    value: function _createElement() {
      this.el = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(this.el);

      mapStyleToElement(this.el, this.options);

      this.el.style.position = 'fixed';
      this.el.style.top = 0;
      this.el.style.left = 0;
      this.el.style.right = 0;
      this.el.style.height = this.options.height;
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
