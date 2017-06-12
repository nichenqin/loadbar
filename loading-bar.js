const rAF = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60); };

const isHTMLElement = el => el instanceof HTMLElement;

const mapStyleToElement = (el, style) => {
  for (let prop in style) {
    if (prop in el.style) {
      el.style[prop] = style[prop];
    }
  }
};

const removeChild = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

var easing = function (t, b, c, d) {
  return c * t / d + b;
};

class LoadingBar {
  constructor(el, options) {
    // set a new options if now options provided
    options = typeof options === 'object' ? options : {};
    // define default options
    const defaultOptions = {
      height: '2px',
      backgroundColor: 'blue'
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;
    this.speed = 800;

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
          if (value > 100) value = 0;
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
    !isHTMLElement(this.el) && this._createElement();
    this._createChildElement();
  }

  _createElement() {
    this.el = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(this.el);

    this.el.style.position = 'fixed';
    this.el.style.top = 0;
    this.el.style.left = 0;
    this.el.style.right = 0;
    this.el.style.height = this.options.height;
    this.el.style.backgroundColor = 'red';
  }

  _createChildElement() {
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
  _renderBar() {
    this.childEl.style.width = this.barWidth + '%';
  }

  /**
   * grow child element width
   * 
   * @param {any} dt control speed of different cpu speed
   * 
   * @memberof LoadingBar
   */
  _update(dt, num) {
    this.barWidth = easing(dt, this.barWidth, (num - this.barWidth), 2);
  }

  /**
   * main animate function of the library
   * control all behavior
   * 
   * @param {number} num where the bar goes to
   * 
   * @memberof LoadingBar
   */
  growTo(num) {
    this.isAnimating = true;
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;

    this._update(dt, num);
    this._renderBar();

    this.lastTime = now;

    if (this.barWidth > num) this.pause();

    // bind context, run animate again
    if (this.isAnimating) rAF(this.growTo.bind(this, num));
  }

  start() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.barWidth = 0;
      this.lastTime = Date.now();
      this.growTo(30);
    }
  }

  pause() {
    this.isAnimating = false;
  }

  loading() {

  }

  done() {

  }

}

export default LoadingBar;
