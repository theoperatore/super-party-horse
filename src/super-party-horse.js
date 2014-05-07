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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// canvas dimensions
	//var width = 1000;
	//var height = 500;

	// retina
	var dpr = window.devicePixelRatio || 1;
	//canvas.width = width*dpr;
	//canvas.height = height*dpr;
	//canvas.getContext("2d").scale(dpr, dpr);

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
			player.vel.x = 0.2;

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
			player.vel.x = -0.2;
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
			player.vel.y = -0.2;
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

			player.vel.y = 0.2;
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

			player.direction = 'attack-right';
			player.dirLock = true;
			player.state = 'attacking';
			player.attack('basic');


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

					//causes a slight frame skip -- think of way to remove without frameskip
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
