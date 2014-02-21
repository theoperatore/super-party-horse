/******************************************************************************

This file brings together all of the different engines to make a game run.
This is the game core; holds the main game loop

******************************************************************************/


/******************************************************************************

	Core Vars

******************************************************************************/
var canvas = document.getElementById('playground'),
	ctx = canvas.getContext("2d"),
	now = +new Date,
	prev = +new Date,
	dt = 0,

/******************************************************************************
	
	Constructors

******************************************************************************/
Entity = require("./entity/entity"),
GameState = require("./core/state"),

/******************************************************************************

	Managers

******************************************************************************/
Input = require('./core/input-manager'),
Renderer = require("./core/renderer"),

/******************************************************************************

	Main Instance Vars

******************************************************************************/
player = new Entity(),
state = new GameState('title'),
game = new GameState('game');


function init() {
	//setup player
	player.pos.y = 100;

	player.addFrame('right', "./src/resources/donkey-idle-right.png", 1000, function(ev) {
		console.log(ev);
	});

	player.addFrame('right', "./src/resources/donkey-fly-right.png", 500, function(ev) {
		console.log(ev);
	});

	player.addFrame('left', "./src/resources/donkey-idle-left.png", 1000, function(ev) {
		console.log(ev);
	});

	player.addFrame('left', "./src/resources/donkey-fly-left.png", 500, function(ev) {
		console.log(ev);
	});

	player.direction = "right";


	var count = 0;
	//setup inputs

	//init with initial game state inputs?
	Input.init();
	Input.addInput('left', 65, function() {
		player.accel.x = -0.0001;
		player.direction = 'left';
	});
	Input.addInput('right', 68, function() {
		player.accel.x = 0.0001;
		player.direction = 'right';
	});
	Input.addInput('up', 87, function() {
		player.accel.y = -0.0001;
	});
	Input.addInput('down', 83, function() {
		player.accel.y = 0.0001;
	});
	Input.addInput('switchGameStates', 74, function() {
		(count % 2 === 0) ? Renderer.useState(game) : Renderer.useState(state);

		count++;
	})

	//set up initial game state
	state.addPlayerToState(player);
	state.setBackground("./src/resources/grass-background.png");
	state.setForeground("./src/resources/grass-foreground.png");

	//initialize renderer
	Renderer.init(ctx, canvas.width, canvas.height, state);
}

function update() {
	ctx.clearRect(0,0,1000,500);

	now = +new Date;
	dt = now - prev;
	prev = now;

	player.updateRungeKutta(dt);
	Renderer.draw();

	requestAnimationFrame(update);
}

//initialize game!
init();

//start main game!
requestAnimationFrame(update);