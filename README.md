# loading-bar

Light weight progress bar using *vanilla javascript*, **do not** need to import css file.

---

## Installation

## Usage

### Basic

```html
...
<body>
  <button>Done</button>
</body>
...
```

```javascript
...
var loadbar = new Loadbar();

window.onload = loadbar.start();

var btn = document.querySelector('button');
btn.addEventListener('click', function () { loadbar.done() });
...
```

If no argument provided, loadbar will create an element which fixed at the top of screen.

### Advanced

```javascript
// The value should be set between 0 and 100.
// If you set a value out of range it will be set to a valid value.
var axios = require('axios');

...
axios.get(url)
  .then(() => { loadbar.growTo(80) })
  .then(() => { loadbar.done(); })
...
```

### Other API

```javascript
loadbar.pause(); // Bar will stop animating.
loadbar.stop(); // Bar will fade out and the bar element will be removed from parent(call loadbar.destroy())
loadbar.loading(); // start to load a little bit
```

---

## Custom Configuration

```javascript
var loadbar = new Loadbar(options, element);
```

Both two arguments are **not** required.

### options

#### options.height

  type: `<String>`

  Height of the bar, limited within 5px.

  Default: `2px`

#### options.backgroundColor

  type: `<String>`

  Color of bar.

  Default: `blue`

#### options.easeFunction

  type: `<Function>`

  Function of bar easing, you can use your custom function.

  Default: `const easing = (t, b, c, d) => c * t / d + b`

  *Important:* Every easing function should contains four arguments.
  > [check here](http://gizma.com/easing/) for more information of easing function

#### options.zIndex

  type: `<Number>`

  Config z-index of element if the bar is covered by your header or navbar.

  Default: `999`

#### options.pausePoint

  type: `<Number>`

  Where bar will stop waiting next event (ex: loadbar.done()),you can simply set value 100 to avoid pause behavior.

  Default: `90`

#### options Example

  ```javascript
  ...
  var easeInQuart = function (t, b, c, d) {
    t /= d;
    return c * t* t * t * t + b;
  };

  var loadbar = new Loadbar({
    height: '10px', // which will be set to 5px automatically
    backgroundColor: '#e4393c',
    easeFunction: easeInQuart,
    zIndex: 1000,
    pausePoint: 60 // bar will stop at 60%
  })
  ...
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
