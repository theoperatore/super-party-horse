var Entity = require('../../entity/entity'),
		npcs = [];


exports.create = function(count) {

	count = count || 1;

	for (var i = 0; i < count; i++) {

		var npc = new Entity();

		npc.addFrame('right', './src/resources/npcs/cow-right-1.png', 300);
		npc.addFrame('right', './src/resources/npcs/cow-right-base.png', 300);
		npc.addFrame('right', './src/resources/npcs/cow-right-2.png', 300);
		npc.addFrame('right', './src/resources/npcs/cow-right-base.png', 300);

		npc.addFrame('left', './src/resources/npcs/cow-left-1.png', 300);
		npc.addFrame('left', './src/resources/npcs/cow-left-base.png', 300);
		npc.addFrame('left', './src/resources/npcs/cow-left-2.png', 300);
		npc.addFrame('left', './src/resources/npcs/cow-left-base.png', 300);

		npc.pos.x = 10 + Math.random() * 20;
		npc.pos.y = 10 + Math.random() * 650;

		npc.addAABB(0,0, 150, 150);

		npc.direction = 'right';

		npcs.push(npc);

	}


	return npcs;
}
