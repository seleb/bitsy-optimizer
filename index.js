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
	return world.toString();
}
