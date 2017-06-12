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

if now argument provided, loadbar will create an element which fixed at the top of screen

### Advanced

```javascript
loadbar.growTo(80); // The value should be set between 0 and 100
```

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

<!--Todo: custom ease function-->
  #### options.easeFunction
  type: `<Function>`
  the function of bar easing, you can use your custom function
  Default: `const easing = (t, b, c, d) => c * t / d + b`

  #### options.zIndex
  type: `<number>`
  config z-index of element if the bar is covered by your header or navbar
  Default: `999`
  
  #### Example

  ```javascript
  var easeFunction = function(){

  }
  
  var loadbar = new Loadbar({
    height: '10px' // which will be set to 5px automatically
    bacgroundColor: '#e4393c',
    easeFunction: easeFunction,
    zIndex: 1000
  })
  ```

### element

you can use your own HTML element which is not fixed at the top of screen
type: `<String>` or `HTMLElment`

  #### Example

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
