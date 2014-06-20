var Enemy = require('../../entity/enemy'),
		enemies = [];

//load a predefined jaguar, 'count' number of times
exports.create = function(count) {
	count   = count || 1;

	for (var i = 0; i < count; i++) {
			var jagwar = new Enemy();

			jagwar.addFrame('left', './src/resources/enemies/jagwar-left.png', 300);
			jagwar.addFrame('left', './src/resources/enemies/jagwar-left-2.png', 300);

			jagwar.pos.x = (i % 2 === 0) ? 1000 - 50 : 1000 + 50;
			jagwar.pos.y = Math.random() * 350;
			jagwar.accel.x = -0.00002 + (Math.random() * -0.00001);
			jagwar.addAABB(0,0, 150, 63);

			enemies.push(jagwar);

	}

	return enemies;
}
