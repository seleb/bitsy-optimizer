# @bitsy/optimizer

optimizer for bitsy gamedata

Note that optimizations are written in terms of vanilla bitsy; many hacks may use gamedata which would otherwise be seen as "unused" in a vanilla bitsy game (e.g. a room may have no exits pointing to it, but still be used via `exit-from-dialog` tags), so be wary of this when choosing what to optimize.

## How To

### Browser

1. include `./dist/index.iife.js` in HTML

```html
<script src="vendor/@bitsy/optimizer/dist/index.iife.js"></script>
```

2. reference global

```js
const optimize = window.bitsyOptimizer;
```

### Node

1. install

```sh
npm install @bitsy/optimizer --save
```

2. import

```js
const optimize = require("@bitsy/optimizer");
```

```js
import optimize from '@bitsy/optimizer';
```

### Use

```js
const gamedata = `Write your game's title here

# BITSY VERSION 6.0...`;

const optimizedGamedata = optimize(gamedata);

// options can be provided as a second parameter
const partiallyOptimizedGamedata = optimize(gamedata, {
	rooms: true || false,    // removes unreachable rooms (except room 0)
	palettes: true || false, // removes unused palettes that aren't assigned to any rooms
	tiles: true || false,    // removes tiles that aren't placed in any rooms
	sprites: true || false,  // removes sprites that aren't placed in any rooms
	items: true || false,    // removes items that aren't placed in any rooms
	dialogue: true || false, // removes dialogue that isn't assigned to any sprites or items
	exits: true || false,    // removes exits that don't go to valid rooms
	endings: true || false,  // removes endings that aren't placed in any rooms
});
```
