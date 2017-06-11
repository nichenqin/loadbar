const isHTMLElement = el => el instanceof HTMLElement;

const mapStyleToElement = (el, style) => {
  for (let prop in style) {
    if (prop in el.style) {
      el.style[prop] = style[prop];
    }
  }
};

class LoadingBar {
  constructor(el, options) {
    console.log(options);
    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    const defaultOptions = {
      height: '30px',
      backgroundColor: 'orange'
    };

    this.options = Object.assign({}, defaultOptions, options);


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

    this.options.height = options.height || defaultOptions.height;

    this._init();
  }

  _init() {
    !isHTMLElement(this.el) && this._createElement();
    this._initStyle();
  }

  _initStyle() {
    mapStyleToElement(this.el, this.options);
  }

  _createElement() {
    this.el = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(this.el);

    mapStyleToElement(this.el, this.options);

    this.el.style.position = 'fixed';
    this.el.style.top = 0;
    this.el.style.left = 0;
    this.el.style.right = 0;
    this.el.style.height = this.options.height;
  }

  start() {

  }

  done() {

  }

}

export default LoadingBar;