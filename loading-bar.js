const isHTMLElement = el => el instanceof HTMLElement;

const mapStyleToElement = (el, style) => {
  for (let prop in style) {
    el.style[prop] = style[prop];
  }
};

class LoadingBar {
  constructor(el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    const defaultOptions = {
      style: {
        height: '4px',
        backgroundColor: 'orange'
      }
    };

    this.options = Object.assign({}, defaultOptions, options);

    this._init();
  }

  _init() {
    !isHTMLElement(this.el) && this._createElement();
    this._initStyle();
  }

  _initStyle() {
    mapStyleToElement(this.el, this.options.style);
  }

  _createElement() {
    this.el = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(this.el);
    this.el.style.position = 'fixed';
    this.el.style.top = 0;
    this.el.style.left = 0;
    this.el.style.right = 0;
    mapStyleToElement(this.el, this.options);

  }

  start() {

  }

  done() {

  }

}

export default LoadingBar;