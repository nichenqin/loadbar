// define requestAnimationFrame function
const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

// define cancelAnimationFrame function
const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

// check if is html element
const isHTMLElement = el => el instanceof HTMLElement;

/**
 * map the object to element style
 * 
 * @param {HTMLElement} el 
 * @param {object} style 
 */
const mapStyleToElement = (el, style) => {
  for (let prop in style) {
    if (prop in el.style) {
      el.style[prop] = style[prop];
    }
  }
};

/**
 * remove all child node of element
 * 
 * @param {HTMLElement} el 
 */
const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// easing animation function
const easing = (t, b, c, d) => c * t / d + b;

const body = document.getElementsByTagName('body')[0];

class Loadbar {
  /**
   * Creates an instance of Loadbar.
   * @param {object} options custom config
   * @param {HTMLElement} el HTMLElement
   * 
   * @memberof Loadbar
   */
  constructor(options, el) {
    // set a new options if now options provided
    options = typeof options === 'object' ? options : {};
    // define default options
    const defaultOptions = {
      height: '2px',
      backgroundColor: 'blue',
      easeFunction: easing,
      zIndex: 999,
      pausePoint: 90
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // handle custom element
    this.parentEl = !!this.el ? this.el.parentElement : body;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;
    // animation speed
    this.duration = 1.5;
    // animation id
    this.rAFId = null;
    // mark if this.el is removed from document
    this.elementDestroyed = false;

    let barWidth;
    Object.defineProperties(this, {
      // constant max width
      'maxWidth': { value: 100 },
      // limit bar width
      'barWidth': {
        get() { return barWidth; },
        set(value) {
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
    let barHeight;
    Object.defineProperty(this.options, 'height', {
      get() { return barHeight; },
      set(value) {
        const numValue = parseInt(value);
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

  _init() {
    this._refresh(true);
    // if wrapper supplied, use it, or create a new wrapper which fixed at the top of screen & add style
    isHTMLElement(this.el) ? this._cssElement() : this._createElement()._cssElement()._cssCustomElement();
    this._createChildElement()._cssChildElement()._renderBar();
  }

  _refresh(force) {
    if (this.elementDestroyed) {
      this._cssChildElement();
      this.parentEl.appendChild(this.el);
      this.elementDestroyed = false;
    };
    if (force) this.barWidth = 0;
    cAF(this.rAFId);
    this.isAnimating = true;
    this.lastTime = Date.now();
    return this;
  }

  _cssElement() {
    this.el.style.height = this.options.height;
    this.el.style.backgroundColor = 'transparent';
    return this;
  }

  _cssCustomElement() {
    this.el.style.position = 'fixed';
    this.el.style.top = 0;
    this.el.style.left = 0;
    this.el.style.right = 0;
  }

  _createElement() {
    this.el = document.createElement('div');
    body.appendChild(this.el);
    return this;
  }

  _cssChildElement() {
    mapStyleToElement(this.childEl, this.options);

    // overwrite the style 
    // first render width to 0
    this.childEl.style.height = '100%';
    this.childEl.style.opacity = '1';
    return this;
  }

  _createChildElement() {
    // remove all child element
    removeChild(this.el);
    this.childEl = document.createElement('div');
    this.el.appendChild(this.childEl);
    return this;
  }

  /**
   * render the child element width to new width
   * 
   * 
   * @memberof Loadbar
   */
  _renderBar() {
    this.childEl.style.width = this.barWidth + '%';
    return this;
  }

  /**
   * grow child element width
   * 
   * @param {number} dt control speed
   * @param {number} num where bar goes
   * 
   * @memberof Loadbar
   */
  _update(dt, num) {
    this.barWidth = this.options.easeFunction(dt, this.barWidth, num - this.barWidth, this.duration);
    return this;
  }

  /**
   * main animate function of the library
   * used by almost every function
   * 
   * @param {number} num where the bar goes to
   * 
   * @memberof Loadbar
   */
  _grow(num) {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;

    this._update(dt, num)._renderBar();

    const dif = num - this.barWidth;
    const shouldPause = num !== this.maxWidth && this.barWidth - this.options.pausePoint <= 0.1 && this.barWidth - this.options.pausePoint > -0.1;
    // clear frame if touch max width
    if (dif === 0) return this.stop();
    if (shouldPause) return this.pause();
    // if grow to target, turn into loading status
    if (num !== this.maxWidth && dif <= 0.1 && dif > -0.1) return this.loading();
    // bind context, run animate again
    if (this.isAnimating) return this.rAFId = rAF(this._grow.bind(this, num));
  }

  /**
   * turn on animation status
   * 
   * @returns Loadbar
   * 
   * @memberof Loadbar
   */
  _begin() {
    this._refresh().duration = 1.5;
    return this;
  }

  /**
   * means finish the main work ex: ajax done
   * basicly used by done() function
   * @returns Loadber
   * 
   * @memberof Loadbar
   */
  _finish() {
    this._refresh().duration = 0.3;
    return this;
  }

  /**
   * fade out animation when done() function called
   * 
   * @param {HTMLElement} el html element
   * 
   * @memberof Loadbar
   */
  _fadeOut(el, callback) {
    el.style.opacity -= 0.1;
    if (el.style.opacity > 0) {
      rAF(this._fadeOut.bind(this, el, callback));
    } else {
      setTimeout(() => { callback(); }, 300);
    }
  }

  growTo(num) {
    this._begin()._grow(num);
  }

  start() {
    this._refresh(true).growTo(10);
  }

  loading() {
    this.pause().growTo(this.barWidth + 0.3 + Math.random() * 0.5);
  }

  pause() {
    cAF(this.rAFId);
    this.isAnimating = false;
    return this;
  }

  stop() {
    this.isAnimating && this.pause()._fadeOut(this.childEl, this.destroy.bind(this));
  }

  destroy() {
    if (!this.elementDestroyed) {
      cAF(this.rAFId);
      this.isAnimating = false;
      this.barWidth = 0;
      this.parentEl.removeChild(this.el);
      this.elementDestroyed = true;
    }
  }

  done() {
    this._finish()._grow(this.maxWidth);
  }

}

export default Loadbar;
