function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BitsyParser = exports.BitsyVariable = exports.BitsyEnding = exports.BitsyDialogue = exports.BitsyRoom = exports.BitsyPalette = exports.BitsyItem = exports.BitsySprite = exports.BitsyTile = exports.BitsyObjectBase = exports.BitsyResourceBase = exports.BitsyWorld = void 0;

  function parsePosition(str) {
    const [x, y] = str.split(",").map(n => parseInt(n, 10));
    return {
      x,
      y
    };
  }

  class BitsyWorld {
    constructor() {
      this.title = "";
      this.bitsyVersion = "";
      this.roomFormat = 1;
      this.rooms = {};
      this.palettes = {};
      this.tiles = {};
      this.sprites = {};
      this.items = {};
      this.dialogue = {};
      this.endings = {};
      this.variables = {};
    }

    toString() {
      return `${this.title}

# BITSY VERSION ${this.bitsyVersion}

! ROOM_FORMAT ${this.roomFormat}

${[this.palettes, this.rooms, this.tiles, this.sprites, this.items, this.dialogue, this.endings, this.variables].map(map => Object.values(map).map(i => i.toString()).join('\n\n')).filter(i => i).join('\n\n')}`;
    }

  }

  exports.BitsyWorld = BitsyWorld;

  class BitsyResourceBase {
    constructor() {
      this.id = "";
      this.name = "";
    }

    get type() {
      const brb = this.constructor;
      return brb;
    }

    toString() {
      return `${this.type.typeName} ${this.id}`;
    }

  }

  exports.BitsyResourceBase = BitsyResourceBase;
  BitsyResourceBase.typeName = "";

  class BitsyObjectBase extends BitsyResourceBase {
    constructor() {
      super();
      this.graphic = [];
      this.dialogueID = "";
      this.wall = false;
      this.palette = this.type.paletteDefault;
    }

    get type() {
      const bob = this.constructor;
      return bob;
    }

    toString() {
      const props = [];
      props.push(super.toString());
      props.push(this.graphic.map(g => g.map(b => b ? 1 : 0).join('').replace(/(.{8})/g, '$1\n').trim()).join('\n>\n'));

      if (this.name) {
        props.push(`NAME ${this.name}`);
      }

      if (this.dialogueID) {
        props.push(`DLG ${this.dialogueID}`);
      }

      if (this.position) {
        props.push(`POS ${this.position.room} ${this.position.x},${this.position.y}`);
      }

      if (this.wall) {
        props.push(`WAL true`);
      }

      if (this.palette !== this.type.paletteDefault) {
        props.push(`COL ${this.palette}`);
      }

      return props.join('\n');
    }

  }

  exports.BitsyObjectBase = BitsyObjectBase;
  BitsyObjectBase.paletteDefault = 1;

  class BitsyTile extends BitsyObjectBase {}

  exports.BitsyTile = BitsyTile;
  BitsyTile.paletteDefault = 1;
  BitsyTile.typeName = "TIL";

  class BitsySprite extends BitsyObjectBase {}

  exports.BitsySprite = BitsySprite;
  BitsySprite.paletteDefault = 2;
  BitsySprite.typeName = "SPR";

  class BitsyItem extends BitsyObjectBase {}

  exports.BitsyItem = BitsyItem;
  BitsyItem.paletteDefault = 2;
  BitsyItem.typeName = "ITM";

  class BitsyPalette extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.colors = [];
    }

    get background() {
      return this.colors[0];
    }

    get tile() {
      return this.colors[1];
    }

    get sprite() {
      return this.colors[2];
    }

    toString() {
      return `${[super.toString(), this.name && `NAME ${this.name}`, ...this.colors.map(({
        r,
        g,
        b
      }) => `${r},${g},${b}`)].filter(i => i).join('\n')}`;
    }

  }

  exports.BitsyPalette = BitsyPalette;
  BitsyPalette.typeName = "PAL";

  class BitsyRoom extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.tiles = [];
      this.legacyWalls = [];
      this.items = [];
      this.exits = [];
      this.endings = [];
      this.palette = "";
    }

    toString() {
      return [super.toString(), ...this.tiles.map(row => row.join(",")), this.name && `NAME ${this.name}`, this.legacyWalls.length && `WAL ${this.legacyWalls.join(',')}`, ...this.items.map(({
        id,
        x,
        y
      }) => `ITM ${id} ${x},${y}`), ...this.exits.map(({
        from,
        to,
        transition,
        dialog
      }) => ['EXT', `${from.x},${from.y}`, to.room, `${to.x},${to.y}`, transition && `FX ${transition}`, dialog && `DLG ${dialog}`].filter(i => i).join(' ')), ...this.endings.map(({
        id,
        x,
        y
      }) => `END ${id} ${x},${y}`), this.palette && `PAL ${this.palette}`].filter(i => i).join('\n');
    }

  }

  exports.BitsyRoom = BitsyRoom;
  BitsyRoom.typeName = "ROOM";

  class BitsyDialogue extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.script = "";
    }

    toString() {
      return `${[super.toString(), this.script, this.name && `NAME ${this.name}`].filter(i => i).join('\n')}`;
    }

  }

  exports.BitsyDialogue = BitsyDialogue;
  BitsyDialogue.typeName = "DLG";

  class BitsyEnding extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.script = "";
    }

    toString() {
      return `${super.toString()}
${this.script}`;
    }

  }

  exports.BitsyEnding = BitsyEnding;
  BitsyEnding.typeName = "END";

  class BitsyVariable extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.value = "";
    }

    toString() {
      return `${super.toString()}
${this.value}`;
    }

  }

  exports.BitsyVariable = BitsyVariable;
  BitsyVariable.typeName = "VAR";

  class BitsyParser {
    constructor() {
      this.world = new BitsyWorld();
      this.lineCounter = 0;
      this.lines = [];
    }

    static parse(lines) {
      const parser = new BitsyParser();
      parser.parseLines(lines);
      return parser.world;
    }

    reset() {
      this.lineCounter = 0;
      this.lines = [];
      this.world = new BitsyWorld();
    }

    parseLines(lines) {
      this.reset();
      this.lines = lines;
      this.world.title = this.takeLine();

      while (!this.done && !this.checkLine("# BITSY VERSION ")) {
        this.skipLine();
      }

      this.world.bitsyVersion = this.takeSplitOnce("# BITSY VERSION ")[1];

      while (!this.done && !this.checkLine("! ROOM_FORMAT ")) {
        this.skipLine();
      }

      this.world.roomFormat = parseInt(this.takeSplitOnce("! ROOM_FORMAT ")[1], 10);

      while (!this.done) {
        if (this.checkLine("PAL")) this.takePalette();else if (this.checkLine("ROOM")) this.takeRoom();else if (this.checkLine("TIL")) this.takeTile();else if (this.checkLine("SPR")) this.takeSprite();else if (this.checkLine("ITM")) this.takeItem();else if (this.checkLine("END")) this.takeEnding();else if (this.checkLine("DLG")) this.takeDialogue();else if (this.checkLine("VAR")) this.takeVariable();else {
          while (!this.checkBlank()) {
            this.skipLine();
          }

          this.skipLine();
        }
      }
    }

    get done() {
      return this.lineCounter >= this.lines.length;
    }

    get currentLine() {
      return this.lines[this.lineCounter];
    }

    checkLine(check) {
      return this.currentLine ? this.currentLine.startsWith(check) : false;
    }

    checkBlank() {
      return this.done || this.currentLine.trim().length == 0;
    }

    takeLine() {
      const line = this.currentLine;
      this.lines[this.lineCounter] = "";
      this.lineCounter += 1;
      return line;
    }

    skipLine() {
      this.takeLine();
    }

    takeSplit(delimiter) {
      return this.takeLine().split(delimiter);
    }

    takeSplitOnce(delimiter) {
      const line = this.takeLine();
      const i = line.indexOf(delimiter);
      return [line.slice(0, i), line.slice(i + delimiter.length)];
    }

    takeColor() {
      const [r, g, b] = this.takeLine().split(',').map(component => parseInt(component, 10));
      return {
        r,
        g,
        b
      };
    }

    takeResourceID(resource) {
      resource.id = this.takeSplitOnce(" ")[1];
    }

    tryTakeResourceName(resource) {
      resource.name = this.checkLine("NAME") ? this.takeSplitOnce(" ")[1] : "";
    }

    tryTakeObjectPalette(object) {
      if (this.checkLine("COL")) {
        object.palette = parseInt(this.takeSplitOnce(" ")[1]);
      }
    }

    tryTakeObjectDialogueID(object) {
      if (this.checkLine("DLG")) {
        object.dialogueID = this.takeSplitOnce(" ")[1];
      }
    }

    tryTakeSpritePosition(sprite) {
      if (this.checkLine("POS")) {
        const [room, pos] = this.takeSplitOnce(" ")[1].split(" ");
        sprite.position = Object.assign({
          room
        }, parsePosition(pos));
      }
    }

    tryTakeTileWall(tile) {
      if (this.checkLine("WAL")) {
        tile.wall = this.takeSplitOnce(" ")[1] === "true";
      }
    }

    takePalette() {
      const palette = new BitsyPalette();
      this.takeResourceID(palette);
      this.tryTakeResourceName(palette);

      while (!this.checkBlank()) {
        palette.colors.push(this.takeColor());
      }

      this.world.palettes[palette.id] = palette;
    }

    takeRoom() {
      const room = new BitsyRoom();
      this.takeResourceID(room);
      this.takeRoomTiles(room);
      this.tryTakeResourceName(room);

      while (this.checkLine("WAL")) {
        this.takeRoomLegacyWalls(room);
      }

      while (this.checkLine("ITM")) {
        this.takeRoomItem(room);
      }

      while (this.checkLine("EXT")) {
        this.takeRoomExit(room);
      }

      while (this.checkLine("END")) {
        this.takeRoomEnding(room);
      }

      this.takeRoomPalette(room);
      this.world.rooms[room.id] = room;
    }

    takeRoomTiles(room) {
      for (let i = 0; i < 16; ++i) {
        const row = this.takeSplit(",");
        room.tiles.push(row);
      }
    }

    takeRoomLegacyWalls(room) {
      const walls = this.takeSplitOnce(" ")[1];
      room.legacyWalls.push(...walls.split(","));
    }

    takeRoomItem(room) {
      const item = this.takeSplitOnce(" ")[1];
      const [id, pos] = item.split(" ");
      room.items.push(Object.assign({
        id
      }, parsePosition(pos)));
    }

    takeRoomExit(room) {
      const exit = this.takeSplitOnce(" ")[1];
      const [from, toRoom, toPos, ...rest] = exit.split(" ");
      const [, transition, dialog] = rest.join(' ').match(/(?:FX\s(.*))?\s?(?:DLG\s(.*))?/) || [];
      room.exits.push({
        from: parsePosition(from),
        to: Object.assign({
          room: toRoom
        }, parsePosition(toPos)),
        transition,
        dialog
      });
    }

    takeRoomEnding(room) {
      const ending = this.takeSplitOnce(" ")[1];
      const [id, pos] = ending.split(" ");
      room.endings.push(Object.assign({
        id
      }, parsePosition(pos)));
    }

    takeRoomPalette(room) {
      room.palette = this.takeSplitOnce(" ")[1];
    }

    takeDialogueScript(dialogue) {
      if (this.checkLine('"""')) {
        const lines = [this.takeLine()];

        while (!this.checkLine('"""')) {
          lines.push(this.takeLine());
        }

        lines.push(this.takeLine());
        dialogue.script = lines.join('\n');
      } else dialogue.script = this.takeLine();

      this.tryTakeResourceName(dialogue);
    }

    takeFrame() {
      const frame = new Array(64).fill(false);

      for (let i = 0; i < 8; ++i) {
        const line = this.takeLine();

        for (let j = 0; j < 8; ++j) {
          frame[i * 8 + j] = line.charAt(j) == "1";
        }
      }

      return frame;
    }

    takeObjectGraphic(object) {
      const graphic = [];
      let moreFrames;

      do {
        graphic.push(this.takeFrame());
        moreFrames = this.checkLine(">");

        if (moreFrames) {
          this.skipLine();
        }
      } while (moreFrames);

      object.graphic = graphic;
    }

    takeTile() {
      const tile = new BitsyTile();
      this.takeResourceID(tile);
      this.takeObjectGraphic(tile);
      this.tryTakeResourceName(tile);
      this.tryTakeTileWall(tile);
      this.tryTakeObjectPalette(tile);
      this.world.tiles[tile.id] = tile;
    }

    takeSprite() {
      const sprite = new BitsySprite();
      this.takeResourceID(sprite);
      this.takeObjectGraphic(sprite);
      this.tryTakeResourceName(sprite);
      this.tryTakeObjectDialogueID(sprite);
      this.tryTakeSpritePosition(sprite);
      this.tryTakeObjectPalette(sprite);
      this.world.sprites[sprite.id] = sprite;
    }

    takeItem() {
      const item = new BitsyItem();
      this.takeResourceID(item);
      this.takeObjectGraphic(item);
      this.tryTakeResourceName(item);
      this.tryTakeObjectDialogueID(item);
      this.tryTakeObjectPalette(item);
      this.world.items[item.id] = item;
    }

    takeEnding() {
      const ending = new BitsyEnding();
      this.takeResourceID(ending);
      this.takeDialogueScript(ending);
      this.world.endings[ending.id] = ending;
    }

    takeDialogue() {
      const dialogue = new BitsyDialogue();
      this.takeResourceID(dialogue);
      this.takeDialogueScript(dialogue);
      this.world.dialogue[dialogue.id] = dialogue;
    }

    takeVariable() {
      const variable = new BitsyVariable();
      this.takeResourceID(variable);
      variable.value = this.takeLine();
      this.world.variables[variable.id] = variable;
    }

  }

  exports.BitsyParser = BitsyParser;
});
var parser = unwrapExports(dist);
dist.BitsyParser;
dist.BitsyVariable;
dist.BitsyEnding;
dist.BitsyDialogue;
dist.BitsyRoom;
dist.BitsyPalette;
dist.BitsyItem;
dist.BitsySprite;
dist.BitsyTile;
dist.BitsyObjectBase;
dist.BitsyResourceBase;
dist.BitsyWorld;

function optimize(gamedata, {
  rooms = true,
  palettes = true,
  tiles = true,
  sprites = true,
  items = true,
  dialogue = true,
  exits = true,
  endings = true
} = {}) {
  const world = parser.BitsyParser.parse(gamedata.replace(/\r\n/g, '\n').split('\n')); // have to start with rooms
  // because a bunch of the following checks are "is in a room"

  if (rooms) {
    // start with the room the player starts in
    const start = world.sprites.A.position.room; // trace exits out until we've hit all cycles/dead-ends

    const usedRooms = new Set();

    function findRoom(r) {
      usedRooms.add(r);
      const {
        [r]: {
          exits: roomExits = []
        } = {}
      } = world.rooms;
      roomExits.forEach(({
        to: {
          room
        }
      }) => {
        if (!usedRooms.has(room)) {
          findRoom(room);
        }
      });
    }

    findRoom(start); // delete remainder (except room 0)

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
        tiles
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
          room
        } = {}
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
        id: itemId
      }) => itemId === id));

      if (!used) {
        delete world.items[id];
      }
    }
  }

  if (dialogue) {
    for (let id in world.dialogue) {
      const used = Object.values(world.sprites).concat(Object.values(world.items)).some(({
        dialogueID
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
          room
        }
      }) => world.rooms[room]);
    });
  }

  if (endings) {
    for (let id in world.endings) {
      const used = Object.values(world.rooms).some(({
        endings
      }) => endings.some(({
        id: endingId
      }) => endingId === id));

      if (!used) {
        delete world.endings[id];
      }
    }
  }

  return world.toString();
}

export { optimize as default };
