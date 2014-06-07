/******************************************************************************

	Core Vars

******************************************************************************/
var canvas = document.getElementById('playground'),
	ctx = canvas.getContext("2d"),
	now = (typeof performance !== 'undefined') ? performance.now() : +new Date,
	prev = (typeof performance !== 'undefined') ? performance.now() : +new Date,
	dt = 0,
	currState,
	anim,
	width,
	height,

/******************************************************************************

	Constructors

******************************************************************************/
Entity = require("./entity/entity"),
GameState = require("./core/state"),
Enemy = require('./entity/enemy'),
Control = require('./core/controls/control'),
Menu = require('./core/menu'),

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
startMenu = new Menu('start'),
optionsMenu = new Menu('options'),
game = new GameState('game'),
levelDisplay = new GameState('level'),
currLevel = 1,
loading = new GameState('loading'),
gameover = new GameState('gameover'),
enemies = [],

/******************************************************************************

	Constants

******************************************************************************/
//must add input map to player
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
	//var width = 1200;
	//var height = 800;
	width  = document.body.clientWidth;
	height = document.body.clientHeight;

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
	player.setInputMap(PLAYER_INPUT_MAP);
	player.direction = 'right';
	player.dirLock = true;

	//set up 'loading' game state

	//set up 'gameover' game state

	//load enemies for state game?
	for (var i = 0; i < 5; i++) {

		var jagwar = new Enemy();
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 300);
		jagwar.addFrame('left', './src/resources/jagwar-left-2.png', 300);
		jagwar.pos.x = width - 50;
		jagwar.pos.y = 45 + (100 * i);
		jagwar.accel.x = -0.00002 + (Math.random() * -0.00001);
		jagwar.addAABB(0,0, 150, 63);

		enemies.push(jagwar);
	}

	for (var j = 0; j < 5; j++) {
		var jagwar = new Enemy();
		jagwar.addFrame('left', './src/resources/jagwar-left.png', 300);
		jagwar.addFrame('left', './src/resources/jagwar-left-2.png', 300);
		jagwar.pos.x = width + 50;
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
Start Menu
******************************************************************************/
	var startCtrl = new Control('start', 'New Game'),
			optionsCtrl = new Control('options', 'Options'),
			quitCtrl = new Control('quit', 'Quit Game');

	startCtrl.pos.x = (width / 2) - 100;
	startCtrl.pos.y = height - 150;

	optionsCtrl.pos.x = (width / 2) - 100;
	optionsCtrl.pos.y = height - 100;

	quitCtrl.pos.x = (width / 2) - 100;
	quitCtrl.pos.y = height - 50;

	startMenu.title = 'Super Party Horse';
	startMenu.titleFont = 'lighter 148px Helvetica Neue';
	ctx.beginPath();
	ctx.font = startMenu.titleFont;
	startMenu.titlePos.x = ((width / 2) - (ctx.measureText(startMenu.title).width / 2));
	ctx.closePath();
	startMenu.titlePos.y = 100;

	//input 'start' -- state 'title'
	startMenu.addSystemInput('engage', 13, function() {
			startMenu.engage();
	});

	startMenu.addSystemInput('up', 87, function(){
		startMenu.changeSelected('up');
	});
	startMenu.addSystemInput('down', 83, function() {
		startMenu.changeSelected('down');
	});


	startMenu.addControlObj(startCtrl, function() {
		//should initialize state game as if just starting for the first time
		levelDisplay.showAlert('Level 1', {
			complete: function() {

				//TODO Works, but need to re-initialize main game state
				currState = Input.useState(game);
				Renderer.useState(game);
			}
		});
		currState = Input.useState(levelDisplay);
		Renderer.useState(levelDisplay);
	});

	startMenu.addControlObj(optionsCtrl, function() {
		//console.log('Options Selected');
		optionsMenu.plainText = 'Options Menu';
		currState = Input.useState(optionsMenu);
		Renderer.useState(optionsMenu)
	});

	startMenu.addControlObj(quitCtrl, function() {
		//console.log('Quit Selected');
		window.close();
	});

	//set up main game state
	game.addPlayerToState(player);
	game.setBackground("./src/resources/grass-background.png");
	game.setForeground("./src/resources/grass-foreground.png");

	//add escape key input to stop animation frames? or go back to title screen
	Input.addSystemInput('stop', 27, function() {
		//cancelAnimationFrame(anim);

		currState = Input.useState(startMenu);
		Renderer.useState(startMenu);

	});

	//initialize renderer
	Renderer.init(ctx, width, height, startMenu);

	//set startMenu state TODO is it non-standard to have the method return the
	//newly set state?
	currState = Input.useState(startMenu);
}

//update the game. system inputs are always active, player inputs need to be
//manually listened
function update(timestamp) {

	//set up next update loop
	anim = requestAnimationFrame(update);

	now = timestamp;
	dt = now - prev;
	prev = now;

	//timer updates

	//update the current state
	currState.update(dt);

	//handle switching to next state if currState.enemies.length === 0;
	if (game.enemies.length <= 0) {
		//clear enemies container
		enemies.length = 0;
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
			jagwar.pos.x = width + 50;
			jagwar.pos.y = 20 + (100 * j);
			jagwar.accel.x = -0.00002 + (Math.random() * -0.00001);
			jagwar.addAABB(0,0, 150, 63);

			enemies.push(jagwar);

		}
		game.addEnemyToState(enemies);
		currLevel++;

		levelDisplay.showAlert(('Level ' + currLevel), {
			complete: function() {
				currState = Input.useState(game);
				Renderer.useState(game);
			}
		});
		currState = Input.useState(levelDisplay);
		Renderer.useState(levelDisplay);
	}

	//draw the game
	Renderer.draw();
}

//initialize game
init();

//start main game!
anim = requestAnimationFrame(update);