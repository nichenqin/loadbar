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
    el.style[prop] = style[prop];
  }
};

var LoadingBar = function () {
  function LoadingBar(el, options) {
    classCallCheck(this, LoadingBar);

    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    var defaultOptions = {
      style: {
        height: '4px',
        backgroundColor: 'orange'
      }
    };

    this.options = Object.assign({}, defaultOptions, options);

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
      mapStyleToElement(this.el, this.options.style);
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
      mapStyleToElement(this.el, this.options);
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
