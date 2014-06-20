var Player = require('../entity/player'),
		Attack = require('../entity/attack');

//self invoking to load
module.exports = (function() {

	var player = new Player(),
			basicAttack = new Attack();

	//set up player
	player.pos.y = 100;
	player.pos.x = 100;

	player.addFrame('right', "./src/resources/player/donkey-idle-right.png", 1000);
	player.addFrame('left', "./src/resources/player/donkey-idle-left.png", 1000);

	player.addFrame('attack-right', "./src/resources/player/attack/donkey-attack-end-right.png", 400);
	player.addFrame('attack-left', "./src/resources/player/attack/donkey-attack-end-left.png", 400);

	//walk animations
	player.addFrame('walk-right', "./src/resources/player/donkey-walk-1.png", 250);
	player.addFrame('walk-right', "./src/resources/player/donkey-walk-2.png", 250);
	player.addFrame('walk-right', "./src/resources/player/donkey-walk-3.png", 250);
	player.addFrame('walk-right', "./src/resources/player/donkey-walk-2.png", 250);

	//setup basic attack
	basicAttack.addFrame('attack-right', "./src/resources/player/attack/sound-waves-right.png", 400);
	basicAttack.addFrame('attack-left', "./src/resources/player/attack/sound-waves-left.png", 400);

	//configure basic attack
	basicAttack.realX = player.pos.x;
	basicAttack.realY = player.pos.y;
	basicAttack.objX = 150;
	basicAttack.objY = 20;
	basicAttack.addAABB(0,0,63,51);

	//add basic attack to player
	player.addAttack('basic', basicAttack);

	player.addAnimationCompletedCallback('attack-right', function() {
		console.log('attack-right completed');
		player.setDirection('right');
		player.state = 'idle';
		player.removeAttack('basic');
	});

	//not used anymore -- direction lock on right
	player.addAnimationCompletedCallback('attack-left', function() {
		console.log('attack-left completed');
		//player.dirLock = false;
		//player.direction = 'left';
		player.setDirection('right');
		player.state = 'idle';
		player.removeAttack('basic');
	});

	player.setAnimationLoop('attack-left', false);
	player.setAnimationLoop('attack-right', false);

	player.direction = "right";


	player.addAABB(
		0,   //x coord of bounding box in object space
		0,   //y coord of bounding box in object space
		126.5, //width of bounding box
		125 //height of bounding box
	);

	return player;
})();
