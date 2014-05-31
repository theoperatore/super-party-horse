/******************************************************************************

	Core Vars

******************************************************************************/
var canvas = document.getElementById('playground'),
	ctx = canvas.getContext("2d"),
	now = (typeof performance !== 'undefined') ? performance.now() : +new Date,
	prev = (typeof performance !== 'undefined') ? performance.now() : +new Date,
	dt = 0,
	currState,

/******************************************************************************

	Constructors

******************************************************************************/
Entity = require("./entity/entity"),
GameState = require("./core/state"),
Enemy = require('./entity/enemy'),

/******************************************************************************

	Managers

******************************************************************************/
Input = require('./core/input-manager'),
Renderer = require("./core/renderer"),
Resource = require('./utilities/resource'),

/******************************************************************************

	Main Instance Vars

******************************************************************************/
player,
title = new GameState('title'),
game = new GameState('game'),
loading = new GameState('loading'),
gameover = new GameState('gameover'),
enemies = [],

/******************************************************************************

	Constants

******************************************************************************/
PLAYER_INPUT_MAP  = {
	'attack': 32, //spacebar
	'left'  : 65, //a
	'right' : 68, //d
	'up'    : 87, //w
	'down'  : 83  //s
};

/******************************************************************************

	Core Functions

******************************************************************************/
function init() {

	//FULL SCREEN PARTY HORSE
	//canvas.width = document.body.clientWidth;
	//canvas.height = document.body.clientHeight;

	// canvas dimensions
	//var width = 500;
	//var height = 250;
	var width  = document.body.clientWidth;
	var height = document.body.clientHeight;

	//
	// HiDef Canvas
	//
	var dpr = window.devicePixelRatio || 1,
			bsr = ctx.webkitBackingStorePixelRatio ||
						ctx.mozBackingStorePixelRatio ||
						ctx.msBackingStorePixelRatio ||
						ctx.oBackingStorePixelRatio ||
						ctx.backingStorePixelRatio || 1,
			ratio = dpr / bsr;

	if (dpr !== bsr) {
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			canvas.style.width  = width + 'px';
			canvas.style.height = height + 'px';
			canvas.getContext("2d").scale(ratio,ratio);
	}

	//initialize input manager
	Input.init();

	//load player
	player = Resource.loadPlayerDefinition();
	player.direction = 'right';
	player.dirLock = true;

	//set up 'loading' game state

	//set up 'gameover' game state

	//load enemies for state game?
	for (var i = 0; i < 5; i++) {


		var jagwar = new Enemy();
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 300);
		jagwar.addFrame('left', './src/resources/jagwar-left-2.png', 300);
		jagwar.pos.x = canvas.width - 50;
		jagwar.pos.y = 45 + (100 * i);
		jagwar.accel.x = -0.00002 + (Math.random() * -0.00001);
		jagwar.addAABB(0,0, 150, 63);

		enemies.push(jagwar);
	}

	for (var j = 0; j < 5; j++) {
		var jagwar = new Enemy();
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 300);
		jagwar.addFrame('left', './src/resources/jagwar-left-2.png', 300);
		jagwar.pos.x = canvas.width + 150;
		jagwar.pos.y = 20 + (100 * j);
		jagwar.accel.x = -0.00002 + (Math.random() * -0.00001);
		jagwar.addAABB(0,0, 150, 63);

		enemies.push(jagwar);

	}

	game.addEnemyToState(enemies);

	//input 'right' -- state 'game'
	game.addInput('right', 68,

		function() {
			player.vel.x = 0.4;

			if (player.state != 'attacking') {
					player.direction = 'walk-right';
			}
		},

		function() {
			player.vel.x = 0;
			if (player.state != 'attacking') {
					player.setDirection('right');
			}
		}
	);

	//input 'left' -- state 'game'
	game.addInput('left', 65,

		function() {
			player.vel.x = -0.4;
			if (player.state != 'attacking') {
					player.direction = 'walk-right';
			}
		},

		function() {
			player.vel.x = 0;
			if (player.state != 'attacking') {
					player.setDirection('right');
			}
		}
	);

	//input 'up' -- state 'game'
	game.addInput('up', 87,

		function() {
			if (player.state != 'attacking') {
					player.direction = 'walk-right';
			}
			player.vel.y = -0.4;
		},

		function() {
			if (player.state != 'attacking') {
					player.setDirection('right');
			}
			player.vel.y = 0;
		}
	);

	//input 'down' -- state 'game'
	game.addInput('down', 83,

		//keydownCallback
		function() {
			if (player.state != 'attacking') {
					player.direction = 'walk-right';
			}

			player.vel.y = 0.4;
		},

		//keyupCallback
		function() {
			if (player.state != 'attacking') {
					player.setDirection('right');
			}
			player.vel.y = 0;
		}
	);

	//input 'attack' -- state 'game'
	game.addInput('attack', 32,

		//keydownCallback
		function() {

			if (player.state != 'attacking') {
				player.direction = 'attack-right';
				player.dirLock = true;
				player.state = 'attacking';
				player.attack('basic');
			}



		}
	);

/******************************************************************************
Testing Menu and controls for Start Menu
******************************************************************************/
	var Menu = require('./core/menu'),
			testMenu = new Menu('testMenu');

	//input 'start' -- state 'title'
	testMenu.addSystemInput('engage', 13,

		//keydownCallback
		function() {
			/*console.log('start pressed');

			//add the input for state game
			Input.useState(game);

			//set up the renderer to use state game
			Renderer.useState(game);

			//set currState
			currState = game;

			//remove initial start input
			Input.removeInput('start');*/

			testMenu.engage();

		}
	);

	testMenu.addSystemInput('up', 87, function(){
		testMenu.changeSelected('up');
	});
	testMenu.addSystemInput('down', 83, function() {
		testMenu.changeSelected('down');
	});

	testMenu.addControl('start', 'Start Game', function() {
		//test.pos.x = (width / 2) - (test.width / 2);
		//test.pos.y = height / 2;
		//test.showBorder = false;
		//test.draw(ctx);

		currState = Input.useState(game);
		Renderer.useState(game);

	});

	testMenu.addControl('options', 'Options', function() {
		console.log('Options Selected!');
	});

	testMenu.addControl('quit', 'Exit Game', function() {
		console.log('Exit Game Selected!');
	});
/******************************************************************************
******************************************************************************/

	//set up main game state
	game.addPlayerToState(player);
	game.setBackground("./src/resources/grass-background.png");
	game.setForeground("./src/resources/grass-foreground.png");

	//initialize renderer
	Renderer.init(ctx, width, height, testMenu);

	//set title state TODO is it non-standard to have the method return the
	//newly set state?
	currState = Input.useState(testMenu);
}

//update the game. system inputs are always active, player inputs need to be
//manually listened
function update(timestamp) {

	//set up next update loop
	requestAnimationFrame(update);

	now = timestamp;
	dt = now - prev;
	prev = now;

	//timer updates

	//check player if player exists in current game state
	if (currState.player) {

			//check for player input and update player pos
			currState.player.pollInput(PLAYER_INPUT_MAP, Input.getInputCollection());
			currState.player.update(dt);
	}

	//if there are enemies to update...
	if (currState.enemies.length != 0) {

		//loop through and update them
		for (var i = 0; i < currState.enemies.length; i++) {

			if (currState.enemies[i]) {

				//updates pos and AI
				currState.enemies[i].update(dt);

				//if the player collides with enemy
				//only check if the enemy is near the player?
				if (currState.player.aabbs[0].collidesWith(currState.enemies[i].aabbs[0])) {

					//player hurt!

				}

				//if player attacks collide with enemy
				for (var a = 0; a < currState.player.currAttacks.length; a++) {

						if (currState.player.currAttacks[a].aabbs[0].collidesWith(currState.enemies[i].aabbs[0])) {

							//remove enemy from array
							currState.enemies.splice(i,1);
							//currState.enemies[i].stop();

							break;

						}

				}//end for player attacks

			}//end if enemy exists
		}//end enemy update/collision loop

	}//end if enemies.length != 0

	//draw the game
	Renderer.draw();
}

//initialize game
init();

//start main game!
requestAnimationFrame(update);
