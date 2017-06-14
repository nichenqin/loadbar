# loadbar

Light weight load bar, vanilla javascript, no css file, no dependency.

## Installation

```bash
npm install loadbar --save
yarn add loadbar
```

## Demo

[Live Demo](http://nichenqin.com/loadbar/)

## Usage

### Basic

```javascript
...

var loadbar = new Loadbar();

loadbar.start();
loadbar.done();

...
```

### Basic Example

```javascript
...

var Loadbar = require('loadbar'); // commonjs
var loadbar = new Loadbar();

window.onload = loadbar.start();
setTimeout(function() { loadbar.done(); }, 1000);

...
```

If no argument provided, loadbar will create an element which fixed at the top of screen.

### Advanced Ajax Example

```javascript

var axios = require('axios');
var Loadbar = require('loadbar');

var loadbar = new Loadbar();

...
axios.get(url)
  .then(() => { loadbar.start() })
  .then(() => { loadbar.growTo(80) }) // Value should between 0 and 100.
  .then(() => { loadbar.done(); })
...
```

### Other API

```javascript
loadbar.pause(); // Bar will stop animating.
loadbar.stop(); // Bar will fade out and the bar element will be removed from parent(call loadbar.destroy())
loadbar.loading(); // start to load a little bit
```

## Custom Configuration

```javascript
var loadbar = new Loadbar(options, element);
```

Both two arguments are **not** required.

### options

#### options.height

  type: `<String>`

  Height of the bar, limited within 4px.

  Default: `2px`

#### options.backgroundColor

  type: `<String>`

  Color of bar.

  Default: `#000`

#### options.easeFunction

  type: `<Function>`

  Function of bar easing, you can use your custom function.

  Default: `const easing = (t, b, c, d) => c * t / d + b`

  **NOTE:** Every easing function should contains four arguments.
  > [check here](http://gizma.com/easing/) for more information of easing function

#### options.zIndex

  type: `<Number>`

  Config z-index of element if the bar is covered by your header or navbar.

  Default: `999`

#### options.startPoint

  type: `<Number>`

  Where bar will go when involke start() function.

  Default: `30`

#### options.pausePoint

  type: `<Number>`

  Where bar will stop waiting next event (ex: loadbar.done()),you can simply set value 100 to avoid pause behavior.

  Default: `90`

  **NOTE:** You can only call done() or start() function if the bar touches the pause poinst you have set

#### options Example

  ```javascript
  ...
  var easeInQuart = function (t, b, c, d) {
    t /= d;
    return c * t* t * t * t + b;
  };

  var loadbar = new Loadbar({
    height: '10px', // which will be set to 4px automatically
    backgroundColor: '#e4393c',
    easeFunction: easeInQuart,
    zIndex: 1000,
    startPoint:50,
    pausePoint: 60 // bar will stop at 60%
  })
  ...
  ```

### element

You can use your own HTML element which is not fixed at the top of screen.

type: `<String>` or `HTMLElement`

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

---

MIT License

Copyright (c) [2017] [nichenqin]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
