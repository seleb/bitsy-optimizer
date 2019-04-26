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
	return world.toString();
}
