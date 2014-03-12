/******************************************************************************

	Core Vars

******************************************************************************/
var canvas = document.getElementById('playground'),
	ctx = canvas.getContext("2d"),
	now = performance.now(),
	prev = performance.now(),
	dt = 0,
	currState,

/******************************************************************************

	Constructors

******************************************************************************/
Entity = require("./entity/entity"),
//Player = require("./entity/player"),
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
//player = new Player(),
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
	'left'  : 65, //a
	'right' : 68, //d
	'up'    : 87, //w
	'down'  : 83, //s
	'attack': 32  //spacebar
};

/******************************************************************************

	Core Functions

******************************************************************************/
function init() {

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
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 1000, function(ev) { console.log(ev) });
		jagwar.pos.x = canvas.width - 10;
		jagwar.pos.y = 50 + (100 * i);
		jagwar.accel.x = -0.00001;
		jagwar.addAABB(0,0, 100, 100);

		enemies.push(jagwar);
	}

	for (var j = 0; j < 4; j++) {
		var jagwar = new Enemy();
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 1000, function(ev) { console.log(ev) });
		jagwar.pos.x = canvas.width + 150;
		jagwar.pos.y = 75 + (100 * j);
		jagwar.accel.x = -0.00001;
		jagwar.addAABB(0,0, 100, 100);

		enemies.push(jagwar);

	}

	game.addEnemyToState(enemies);

	//input 'right' -- state 'game'
	game.addInput('right', 68,

		function() {
			player.vel.x = 0.2;
			if (!player.dirLock) {
				player.direction = 'right';
			}
		},

		function() {
			player.vel.x = 0;
		}
	);

	//input 'left' -- state 'game'
	game.addInput('left', 65,

		function() {
			player.vel.x = -0.2;
			if (!player.dirLock) {
				player.direction = 'left';
			}
		},

		function() {
			player.vel.x = 0;
		}
	);

	//input 'up' -- state 'game'
	game.addInput('up', 87,

		function() {
			player.vel.y = -0.2;
		},

		function() {
			player.vel.y = 0;
		}
	);

	//input 'down' -- state 'game'
	game.addInput('down', 83,

		//keydownCallback
		function() {
			player.vel.y = 0.2;
		},

		//keyupCallback
		function() {
			player.vel.y = 0;
		}
	);

	//input 'attack' -- state 'game'
	game.addInput('attack', 32,

		//keydownCallback
		function() {
			if (player.direction === 'left') {
				player.direction = 'attack-left';
			}
			else if (player.direction === 'right') {
				player.direction = 'attack-right';
			}

			player.dirLock = true;
		}
	);

	//input 'start' -- state 'title'
	title.addSystemInput('start', 13,

		//keydownCallback
		function() {
			console.log('start pressed');

			//add the input for state game
			Input.useState(game);

			//set up the renderer to use state game
			Renderer.useState(game);

			//set currState
			currState = game;

			//remove initial start input
			Input.removeInput('start');
		}
	);

	//add basic text for temporary title
	title.plainText = '<! Super Party Horse !> Press Enter to play!';

	//set up main game state
	game.addPlayerToState(player);
	game.setBackground("./src/resources/grass-background.png");
	game.setForeground("./src/resources/grass-foreground.png");

	//initialize renderer
	Renderer.init(ctx, canvas.width, canvas.height, title);

	//set title state
	Input.useState(title);

	//set initial currState
	currState = title;
}

function update(timestamp) {
	//set up next update loop
	requestAnimationFrame(update);

	now = timestamp;
	dt = now - prev;
	prev = now;

	//check for player input and update player pos
	player.pollInput(PLAYER_INPUT_MAP, Input.getInputCollection());
	player.update(dt);

	//if there are enemies to update...
	if (currState.enemies.length != 0) {

		//loop through and update them
		for (var i = 0; i < currState.enemies.length; i++) {

			if (currState.enemies[i] != null) {

				currState.enemies[i].update(dt);

				if (player.aabbs[0].collidesWith(currState.enemies[i].aabbs[0])) {

					//causes a slight frame skip
					//currState.enemies.splice(i,1);

					currState.enemies[i] = null;

					continue;
				}
			}
		}

	}

	//draw the game
	Renderer.draw();
}

//initialize game
init();

//start main game!
requestAnimationFrame(update);
