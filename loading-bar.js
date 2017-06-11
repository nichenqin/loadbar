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
    this.el = typeof el === 'string' ? document.querySelector(el) : el;

    const defaultOptions = {
      height: '4px',
      backgroundColor: 'orange'
    };

    this.options = Object.assign({}, defaultOptions, options);

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

    this.options.height = options.height || defaultOptions.height;

    this._init();
  }

  _init() {
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

    console.log('created element!', this.el);

    return this;
  }

  _createChildElement() {
    removeChild(this.el);
  }

  start() {

  }

  done() {

  }

}

export default LoadingBar;