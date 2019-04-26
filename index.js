const parser = require('@bitsy/parser');

function optimize(gamedata, {
	rooms = true,
	palettes = true,
	tiles = true,
	sprites = true,
	items = true,
	exits = true,
	endings = true,
} = {}) {
	const world = parser.BitsyParser.parse(gamedata.split('\n'));
	if (palettes) {
		for(let id in world.palettes) {
			const used = Object.values(world.rooms).some(({ palette }) => palette === id);
			if (!used) {
				delete world.palettes[id];
			}
		}
	}
	if (tiles) {
		for(let id in world.tiles) {
			const used = Object.values(world.rooms).some(({ tiles }) => tiles.some(row => row.includes(id)));
			if (!used) {
				delete world.tiles[id];
			}
		}
	}
	if (sprites) {
		for (let id in world.sprites) {
			const room = world.sprites[id].room;
			const used = room && world.rooms[room];
			if (!used) {
				delete world.sprites[id];
			}
		}
	}
	if (items) {
		for(let id in world.items) {
			const used = Object.values(world.rooms).some(({ items }) => items.some(({ id: itemId }) => itemId === id));
			if (!used) {
				delete world.items[id];
			}
		}
	}
	if (exits) {
		Object.values(world.rooms).forEach(room => {
			room.exits = room.exits.filter(({
				to: {
					room,
				},
			}) => world.rooms[room]);
		});
	}
	return world.toString();
}
