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

class LoadingBar {
  constructor(el, options) {
    // define default options
    const defaultOptions = {
      height: '4px',
      backgroundColor: 'orange',
      speed: 10
    };
    // set wrapper element if el arg is provided, support css selector
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // main options used in the library, merge default option & use options
    this.options = Object.assign({}, defaultOptions, options);
    // init animation status;
    this.isAnimating = false;

    // define barWidth property, limit between 0 and 100;
    let barWidth;
    Object.defineProperty(this, 'barWidth', {
      get() { return barWidth; },
      set(value) {
        if (value < 0) value = 0;
        // set to 0 if width touch 100%
        if (value > 100) value = 0;
        barWidth = value;
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
        if (numValue > 10) value = 10 + 'px';
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
    this.lastTime = Date.now();
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

  grow() {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;

    this.update(dt);
    this._renderBar();

    this.lastTime = now;

    // bind context, run animate again
    if (this.isAnimating) return rAF(this.grow.bind(this));
  }

  /**
   * grow child element width
   * 
   * @param {any} dt control speed of different cpu speed
   * 
   * @memberof LoadingBar
   */
  update(dt) {
    this.barWidth += this.options.speed * dt;
  }

  start() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.grow();
    }
  }

  pause() {
    this.isAnimating = false;
  }

  done() {

  }

}

export default LoadingBar;