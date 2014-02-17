/******************************************************************************

Main require for game engine. This file brings together all of the different
engines to make a game run. This is the game core; holds the main game loop.

file paths are relative to app.js

thoughts: 

    - specify options through: 
    var engine = require('./ph-engine').set({
	    useDiscreteUpdating : true,
	    ...
    });

    - hold arrays of entities and other game objects?

******************************************************************************/

var canvas = document.getElementById('playground'),
    ctx = canvas.getContext("2d"),
    Entity = require("./entity/entity"),
    Animation = require("./entity/animation"),
    Input = require('./core/input-manager'),
    player1 = new Entity(),
    now = +new Date,
    prev = +new Date,
    dt = 0,
    playerLeftLoaded = false,
    playerRightLoaded = false;

player1.pos.y = 100;
//player1.pos.x = canvas.width;
//player1.accel.x = -0.01;

player1.addFrame('right', "./src/resources/donkey-idle-right.png", 1000, function(ev) {
	playerLeftLoaded = true;
	console.log(ev);
});

player1.addFrame('right', "./src/resources/donkey-fly-right.png", 500, function(ev) {
	playerRightLoaded = true;
	console.log(ev);
});

player1.direction = "right";

Input.init(canvas);


var count = 0;
var loop = function() {
	ctx.clearRect(0,0,1000,500);

	now = +new Date;
	dt = now - prev;
	prev = now;

	if (playerLeftLoaded && playerRightLoaded) {
		player1.updateRungeKutta(dt, 0.2);

		player1.draw(ctx);
	}

	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

