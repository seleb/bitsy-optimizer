import parser from '@bitsy/parser';

export function optimize(gamedata, {
	rooms = true,
	palettes = true,
	tiles = true,
	sprites = true,
	items = true,
	dialogue = true,
	exits = true,
	endings = true,
} = {}) {
	const world = parser.BitsyParser.parse(gamedata.split('\n'));

	// have to start with rooms
	// because a bunch of the following checks are "is in a room"
	if (rooms) {
		// start with the room the player starts in
		const start = world.sprites.A.position.room;
		// trace exits out until we've hit all cycles/dead-ends
		const usedRooms = new Set();

		function findRoom(r) {
			usedRooms.add(r);
			const {
				[r]: {
					exits: roomExits = [],
				} = {},
			} = world.rooms;
			roomExits.forEach(({
				to: {
					room,
				},
			}) => {
				if (!usedRooms.has(room)) {
					findRoom(room);
				}
			});
		}
		findRoom(start);
		// delete remainder (except room 0)
		usedRooms.add(0);
		for (let id in world.rooms) {
			const used = usedRooms.has(id);
			if (!used) {
				delete world.rooms[id];
			}
		}
	}


	if (palettes) {
		for (let id in world.palettes) {
			const used = Object.values(world.rooms).some(({
				palette
			}) => palette === id);
			if (!used) {
				delete world.palettes[id];
			}
		}
	}
	if (tiles) {
		for (let id in world.tiles) {
			const used = Object.values(world.rooms).some(({
				tiles,
			}) => tiles.some(row => row.includes(id)));
			if (!used) {
				delete world.tiles[id];
			}
		}
	}
	if (sprites) {
		for (let id in world.sprites) {
			const {
				position: {
					room,
				} = {},
			} = world.sprites[id];
			const used = room && world.rooms[room];
			if (!used) {
				delete world.sprites[id];
			}
		}
	}
	if (items) {
		for (let id in world.items) {
			const used = Object.values(world.rooms).some(({
				items
			}) => items.some(({
				id: itemId,
			}) => itemId === id));
			if (!used) {
				delete world.items[id];
			}
		}
	}
	if (dialogue) {
		for (let id in world.dialogue) {
			const used = Object.values(world.sprites).concat(Object.values(world.items)).some(({
				dialogueID,
			}) => dialogueID === id);
			if (!used) {
				delete world.dialogue[id];
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
	if (endings) {
		for (let id in world.endings) {
			const used = Object.values(world.rooms).some(({
				endings,
			}) => endings.some(({
				id: endingId,
			}) => endingId === id));
			if (!used) {
				delete world.endings[id];
			}
		}
	}
	return world.toString();
}

export default optimize;
