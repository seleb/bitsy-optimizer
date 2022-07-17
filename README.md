# @bitsy/optimizer

optimizer for bitsy gamedata

A few things to note:

- Optimizations are written in terms of vanilla bitsy; many hacks may use gamedata which would otherwise be seen as "unused" in a vanilla bitsy game (e.g. a room may have no exits pointing to it, but still be used via `exit-from-dialog` tags), so be wary of this when choosing what to optimize.
- Dialog scripts are not taken into account, which means data only referenced in dialog (e.g. an audio blip in 8.0 that is called from dialog but not directly assigned to any sprite/item) will be removed and may break your game.
- Make sure to save a backup in case you remove something unintentionally as part of optimizing!

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
	sprites: true || false,  // removes sprites that aren't placed in any rooms or used as an avatar
	items: true || false,    // removes items that aren't placed in any rooms
	dialogue: true || false, // removes dialogue that isn't assigned to any sprites or items
	exits: true || false,    // removes exits that don't go to valid rooms
	endings: true || false,  // removes endings that aren't placed in any rooms
	tunes: true || false,    // removes tunes that aren't placed in any rooms
	blips: true || false,    // removes blips that aren't assigned to any sprites or items
});
```
