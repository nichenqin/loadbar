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

### option

- `height``<String>`: height of the bar, limited within 5px, default:`2px`
- `backgroundColor``<String>`: color of the bar, default: `blue`

### element

both `<String>` or `HTMLElment` supported;
