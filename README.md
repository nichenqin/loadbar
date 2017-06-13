# loading-bar
light weight progress bar using pure javascript, do not need to import css file;

## Installation

## Usage

### Basic

```javascript
var loadbar = new Loadbar();

loadbar.start();
loadbar.done();
```

if no argument provided, loadbar will create an element which fixed at the top of screen

### Advanced

```javascript
loadbar.growTo(80); // The value should be set between 0 and 100, if you set a value out of range it will be set to a valid value
```

---

## Custom Configuration

```javascript
var loadbar = new Loadbar(options, element);
```

### options

#### options.height

  type: `<String>`

  Height of the bar, limited within 5px.

  Default: `2px`

#### options.backgroundColor

  type: `<String>`

  Height of the bar, limited within 5px.

  Default: `blue`

#### options.easeFunction

  type: `<Function>`

  the function of bar easing, you can use your custom function

  Default: `const easing = (t, b, c, d) => c * t / d + b`

  > [check here](http://gizma.com/easing/) for more information of easing function

#### options.zIndex

  type: `<Number>`

  config z-index of element if the bar is covered by your header or navbar

  Default: `999`

#### options Example

  ```javascript
  var easeInQuart = function (t, b, c, d) {
    t /= d;
    return c*t*t*t*t + b;
  };

  var loadbar = new Loadbar({
    height: '10px', // which will be set to 5px automatically
    backgroundColor: '#e4393c',
    easeFunction: easeInQuart,
    zIndex: 1000
  })
  ```

---

### element

you can use your own HTML element which is not fixed at the top of screen.

type: `<String>` or `HTMLElment`

#### element Example

  ```javascript
  var options = {<!-- your custom options -->}
  var loadbar = new Loadbar(options, '.bar');
  ```
  or
  ```javascript
  var options = {<!-- your custom options -->}
  var bar = document.getElementById('bar')
  var loadbar = new Loadbar(options, bar);
  ```
