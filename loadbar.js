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

const mapStyleToElement = (el, style) => {
  for (let prop in style) {
    if (prop in el.style) {
      el.style[prop] = style[prop];
    }
  }
};

// remove child node function
const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// easing animation function
const easing = (t, b, c, d) => c * t / d + b;

const body = document.getElementsByTagName('body')[0];

class Loadbar {
  constructor(options, el) {
    // set a new options if now options provided
    options = typeof options === 'object' ? options : {};
    // define default options
    const defaultOptions = {
      height: '2px',
      backgroundColor: 'blue',
      easeFunction: easing,
      zIndex: 999
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.parentEl = !!this.el ? this.el.parentElement : body;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;
    // animation speed
    this.duration = 1.5;
    // animation id
    this.rAFId = null;
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
    // if wrapper supplied, use it, or create a new wrapper which fixed at the top of screen
    if (this.elementDestroyed) this.parentEl.appendChild(this.el);
    isHTMLElement(this.el) ? this._cssElement() : this._createElement();
    this._createChildElement();
  }

  _cssElement() {
    this.el.style.height = this.options.height;
    this.el.style.backgroundColor = 'transparent';
  }

  _createElement() {
    this.el = document.createElement('div');
    body.appendChild(this.el);

    this._cssElement();

    this.el.style.position = 'fixed';
    this.el.style.top = 0;
    this.el.style.left = 0;
    this.el.style.right = 0;
  }

  _createChildElement() {
    // remove all child element
    removeChild(this.el);
    this.childEl = document.createElement('div');
    this.el.appendChild(this.childEl);

    mapStyleToElement(this.childEl, this.options);
    // overwrite the style 
    // first render width to 0
    this._renderBar();
    this.childEl.style.height = '100%';
    this.childEl.style.opacity = '1';
  }

  /**
   * render the child element width to new width
   * 
   * 
   * @memberof Loadbar
   */
  _renderBar() {
    this.childEl.style.width = this.barWidth + '%';
  }

  /**
   * grow child element width
   * 
   * @param {number} dt control speed of different cpu speed
   * @param {number} num where bar goes
   * 
   * @memberof Loadbar
   */
  _update(dt, num) {
    this.barWidth = this.options.easeFunction(dt, this.barWidth, num - this.barWidth, this.duration);
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

    this._update(dt, num);
    this._renderBar();

    const dif = num - this.barWidth;
    // if grow to target, turn into loading status
    if (dif <= 0.1 && dif > -0.1) return this.loading();
    // clear frame if touch max width
    if (this.barWidth === this.maxWidth && this.isAnimating) return this.stop();
    // bind context, run animate again
    if (this.isAnimating) return this.rAFId = rAF(this._grow.bind(this, num));
  }

  /**
   * turn on animation status
   * 
   * @returns this
   * 
   * @memberof Loadbar
   */
  _begin() {
    if (this.elementDestroyed) this._init();
    cAF(this.rAFId);
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.duration = 1.5;
      this.lastTime = Date.now();
      return this;
    }
    return this;
  }

  /**
   * means finish the main work ex: ajax done
   * basicly used by done() function
   * @returns this
   * 
   * @memberof Loadbar
   */
  _finish() {
    cAF(this.rAFId);
    this.isAnimating = true;
    this.duration = 0.3;
    this.lastTime = Date.now();
    return this;
  }

  /**
   * fade out animation when done() function called
   * 
   * @param {any} el html element
   * 
   * @memberof Loadbar
   */
  _fadeOut(el) {
    if (!el.style.opacity) el.style.opacity = 1;
    el.style.opacity -= 0.1;
    if (el.style.opacity > 0) rAF(this._fadeOut.bind(this, el));
    return Promise.resolve();
  }

  growTo(num) {
    this._begin()._grow(num);
  }

  start() {
    this.barWidth = 0;
    this.growTo(10);
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
    cAF(this.rAFId);
    this.isAnimating = false;
    this._fadeOut(this.childEl)
      .then(() => setTimeout(() => this.destroy(), 300));
  }

  destroy() {
    this.barWidth = 0;
    this.parentEl.removeChild(this.el);
    this.elementDestroyed = true;
  }

  done() {
    this._finish()._grow(100);
  }

}

export default Loadbar;
