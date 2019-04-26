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
	return world.toString();
}
