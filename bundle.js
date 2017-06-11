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
      height: '2px',
      backgroundColor: 'orange',
      speed: 100
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;

    // define barWidth property, limit between 0 and 100;
    var barWidth = void 0;
    Object.defineProperty(this, 'barWidth', {
      get: function get$$1() {
        return barWidth;
      },
      set: function set$$1(value) {
        if (value < 0) value = 0;
        // set to 0 if width touch 100%
        if (value > 100) value = 0;
        barWidth = value;
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
      this.lastTime = Date.now();
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
  }, {
    key: 'growTo',
    value: function growTo(num) {
      console.log(num);
      this.isAnimating = true;
      var now = Date.now();
      var dt = (now - this.lastTime) / 1000;

      this.update(dt);
      this._renderBar();

      this.lastTime = now;

      if (this.barWidth > num) this.pause();

      // bind context, run animate again
      if (this.isAnimating) return rAF(this.growTo.bind(this, num));
    }

    /**
     * grow child element width
     * 
     * @param {any} dt control speed of different cpu speed
     * 
     * @memberof LoadingBar
     */

  }, {
    key: 'update',
    value: function update(dt) {
      this.barWidth += this.options.speed * dt;
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.barWidth = 0;
        this.grow();
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.isAnimating = false;
    }
  }, {
    key: 'done',
    value: function done() {}
  }]);
  return LoadingBar;
}();

return LoadingBar;

})));
