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
title = new GameState('title'),
game = new GameState('game');

function init() {
	//setup player
	player.pos.y = 100;
	player.pos.x = 100;

	player.addFrame('right', "./src/resources/donkey-idle-right.png", 1000, function(ev) {
		console.log(ev);
	});
	player.addFrame('left', "./src/resources/donkey-idle-left.png", 1000, function(ev) {
		console.log(ev);
	});

	player.addFrame('attack-right', "./src/resources/attack/donkey-attack-start-right.png", 250, function(ev) {
		console.log(ev);
	});
	player.addFrame('attack-right', "./src/resources/attack/donkey-attack-middle-right.png", 250, function(ev) {
		console.log(ev);
	});
	player.addFrame('attack-right', "./src/resources/attack/donkey-attack-end-right.png", 400, function(ev) {
		console.log(ev);
	});

	player.addFrame('attack-left', "./src/resources/attack/donkey-attack-start-left.png", 250, function(ev) {
		console.log(ev);
	});
	player.addFrame('attack-left', "./src/resources/attack/donkey-attack-middle-left.png", 250, function(ev) {
		console.log(ev);
	});
	player.addFrame('attack-left', "./src/resources/attack/donkey-attack-end-left.png", 400, function(ev) {
		console.log(ev);
	});

	player.addAnimationCompletedCallback('attack-right', function() {
		console.log('attack-right completed');
		player.dirLock = false;
		player.direction = 'right';
	});

	player.addAnimationCompletedCallback('attack-left', function() {
		console.log('attack-left completed');
		player.dirLock = false;
		player.direction = 'left';
	});

	player.setAnimationLoop('attack-left', false);
	player.setAnimationLoop('attack-right', false);

	player.direction = "right";

	//init with initial game state inputs?
	Input.init();


	Input.addInput('left', 65, function() {
		player.vel.x = -0.2;
		if (!player.dirLock) { player.direction = 'left'; }
	}, function() { player.vel.x = 0; } );


	Input.addInput('right', 68, function() {
		player.vel.x = 0.2;
		if (!player.dirLock) { player.direction = 'right'; }
	}, function() { player.vel.x = 0; } );


	Input.addInput('up', 87, function() {
		player.vel.y = -0.2;
	}, function() { player.vel.y = 0; } );


	Input.addInput('down', 83, function() {
		player.vel.y = 0.2;
	}, function() { player.vel.y = 0; } );

	Input.addInput('attack', 32, function() {
		if (player.direction === 'left') {
			player.direction = 'attack-left';
		}
		else if (player.direction === 'right') {
			player.direction = 'attack-right';
		}

		player.dirLock = true;
	});

	//set up initial game state
	title.addPlayerToState(player);
	title.setBackground("./src/resources/grass-background.png");
	title.setForeground("./src/resources/grass-foreground.png");

	//initialize renderer
	Renderer.init(ctx, canvas.width, canvas.height, title);
}

function update() {

	now = +new Date;
	dt = now - prev;
	prev = now;

	player.updateRungeKutta(dt);
	Renderer.draw();

	requestAnimationFrame(update);
}

//initialize game
init();

//start main game!
requestAnimationFrame(update);