const isHTMLElement = el => el instanceof HTMLElement;

class LoadingBar {
  constructor(el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.options = options || {};

    this._init();
  }

  _init() {

  }

  _createElement() {
    if (!isHTMLElement(this.el)) {
      this.el = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(this.el);
    }
  }

  start() {

  }

  done() {

  }

}

export default LoadingBar;