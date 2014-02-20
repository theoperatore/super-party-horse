(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/******************************************************************************

Handles loading stationary images such as backgrounds, backdrops,
and foreground elements.

******************************************************************************/
/******************************************************************************

Loads in one image from the filepath

******************************************************************************/
exports.loadImg = function(path, callback) {
	var img = new Image();

	img.addEventListener('load', function(ev) {
		console.log("image loaded", path, ev);


		if (typeof callback === 'function') {
			callback(img);
		}

	});

	img.src = path;
}

/******************************************************************************

Loads all images and calls the callback once all have been loaded.
The callback will have the loaded images...

NEED TO FIND A WAY TO HAVE THESE INDEXED BY NAME. CAN'T GUARANTEE IMGs
WILL BE IN THE SAME ORDER THAT THEY ARE SPECIFED IN THE PATHS

Right now paths must be an array. Object batchLoad will come later.

******************************************************************************/
exports.batchLoad = function(paths, callback) {

	//holds all loaded images
	var out = [];

	for (var i = 0; i < paths.length; i++) {
		var tmpImg = new Image();

		tmpImg.addEventListner('load', function(ev) {
			out.push(tmpImg);

			if (out.length === paths.length) {

				if (typeof callback === 'function') {
					callback(out);
				}
				else {
					console.log('images loaded but callback not specified!');
				}
			}

		});

		tmpImg.src = paths[i];
	}
}
},{}],2:[function(require,module,exports){
/******************************************************************************

Handles setting up game inputs and eventListeners for any game input.

******************************************************************************/
var Input = function Input(name, keyCode, callback, keyup) {
	this.name = name;
	this.keyCode = keyCode;
	this.keydownCallback = callback || function() {};
	this.keyupCallback = keyup || function() {};
}


/******************************************************************************

Structure to hold Input objects. Index is the keycode associated with the
keyboard event being processed, resulting data is the Input object holding the
function to call for either keydown or keyup 

******************************************************************************/
var inputs = [];


/******************************************************************************

Initialized the DOM with keydown and keyup events and proccesses them
accordingly.

******************************************************************************/
exports.init = function() {

	document.addEventListener('keydown', function(ev) {
		
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		(tmpInput !== 'undefined') ? tmpInput.keydownCallback() : console.log('undefined keydown');

	});

	document.addEventListener('keyup', function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		(tmpInput !== 'undefined') ? tmpInput.keyupCallback() : console.log('undefined keyup');
	});
}

/******************************************************************************

Handles adding a new game input. 

WARNING: This function overrides whatever the previously associated
keyCode - Callback pairing...

Params:

name    -- String name of input. ex. 'moveLeft', 'jump', 'attack', etc...
keyCode -- Integer associated with this ASCII key event
keydownCallback -- function to be called when this key is depressed
keyupCallback   -- function to be called when this key is released

******************************************************************************/
exports.addInput = function(name, keyCode, keydownCallback, keyupCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback, keyupCallback);

	inputs[keyCode] = newInput;
}

/******************************************************************************

Creates and Returns a new instance of Input; mainly used in game states

******************************************************************************/
exports.createInput = function(name, keyCode, keydownCallback, keyupCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	return new Input(name, keyCode, keydownCallback, keyupCallback);
}
},{}],3:[function(require,module,exports){
/******************************************************************************

Functions to render everything to the screen.

******************************************************************************/
var rend = {
	ctx : null,
	height : 0,
	width : 0,
	state : null
};

/******************************************************************************

Must be called first to setup drawing context, canvas dimensions and game state

******************************************************************************/
exports.init = function(context, width, height, state) {
	rend.ctx = context;
	rend.width = width;
	rend.height = height;
	rend.state = state || new State('title');
}

/******************************************************************************

Handles switching from gamestate to gamestate, but only for rendering purposes.
Changing inputs for new gamestates is handled elsewhere. 

This function always assumes that the current underlying gamestate is the 
most recent, so the player will always be passed from the current gamestate
to the new gamestate

DUNNO IF THIS IS ACDTUALLY WORTH DOING...

******************************************************************************/
exports.useState = function(newState) {
	if (typeof newState != 'undefined') {
		var tmpPlayer = rend.state.player;

		rend.state = newState;
		rend.state.player = tmpPlayer;
	}
}

/******************************************************************************

Draw all setup objects to the screen

******************************************************************************/
exports.draw = function(gameState) {

	//a passed in gameState trumps the stored gamestat
	renderState = gameState || rend.state;

	if (rend.ctx != null) {

		if (renderState != null) {

			//clear the canvas
			rend.ctx.clearRect(0, 0, rend.width, rend.height);

			//draw backdrop ... parallax?
			if (renderState.scenery.backdrop != null) {

			}

			//draw background
			if (renderState.scenery.background != null) {
				rend.ctx.drawImage(renderState.scenery.background, 0, 0);
			}

			//draw npcs
			if (renderState.npcs.length > 0) {

			}

			//draw interactables ... powerups?
			if (renderState.interactables.length > 0) {

			}

			//draw enemies
			if (renderState.enemies.length > 0) {

			}

			//draw player including upgrades
			if (renderState.player != null) {

				//draw the base of the character
				renderState.player.draw(rend.ctx);
			}

			//draw foreground
			if (renderState.scenery.foreground != null) {
				rend.ctx.drawImage(renderState.scenery.foreground, 0, 300);
			}

			//draw hud
			if (renderState.hud != null) {

			}
		}
		else {
			console.log('Game state is not set!');
		}
	}
	else {
		console.log('drawing context is not set!');
	}

}
},{}],4:[function(require,module,exports){
var inputManager = require('./input-manager'),
    imageManager = require('./image');


/******************************************************************************

Defines a game state.

******************************************************************************/
var State = function State(name) {
	this.name = name;
	this.player = null;
	this.enemies = [];
	this.npcs = [];
	this.interactables = [];
	this.scenery = {
		backdrop : null,
		background : null,
		foreground : null
	};
	this.inputs = [];
	this.hud = null;
};

/******************************************************************************

Setup the player with this state

******************************************************************************/
State.prototype.addPlayerToState = function(player) {
	this.player = player;
}

/******************************************************************************

Setup enemies to the state; can pass in either a single enemy, or an array

******************************************************************************/
State.prototype.addEnemyToState = function(enemy) {
	if (typeof enemy === 'entity') {
		this.enemies.push(enemy);
	}

	else if (enemy.length) {
		for (var i = 0; i < enemy.length; i++) {
			this.enemies.push(enemy[i]);
		}
	}
}

/******************************************************************************

Add NPCs to this State; can add single npcs or an array

******************************************************************************/
State.prototype.addNPCToState = function(npc) {
	if (typeof npc === 'entity') {
		this.npcs.push(npc);
	}

	else if (npc.length) {
		for (var i = 0; i < npc.length; i++) {
			this.npcs.push(npc[i]);
		}
	}
}

/******************************************************************************

Add interactables to this State; single or an array

******************************************************************************/
State.prototype.addInteractableToState = function(interactable) {
	if (typeof interactable === 'entity') {
		this.interactables.push(interactable);
	}

	else if (interactable.length) {
		for (var i = 0; i < interactable.length; i++) {
			this.interactables.push(interactable[i]);
		}
	}
}

/******************************************************************************

Adds an input to this state, but not to the input manager

******************************************************************************/
State.prototype.addInput = function(name, keyCode, keydownCallback, keyupCallback) {
	//inputManager.addInput(name, keyCode, keydownCallback, keyupCallback);

	this.inputs.push(inputManager.createInput(name, keyCode, keydownCallback, keyupCallback));
};

/******************************************************************************

Load img for the backdrop for this state

******************************************************************************/
State.prototype.setBackdrop = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.backdrop = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

/******************************************************************************

Load img for background for this state

******************************************************************************/
State.prototype.setBackground = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.background = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

/******************************************************************************

Load img for the foreground for this state

******************************************************************************/
State.prototype.setForeground = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.foreground = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

//export the State constructor
module.exports = State;


},{"./image":1,"./input-manager":2}],5:[function(require,module,exports){
/******************************************************************************

Private inner 'class' that represents one frame in an animation

******************************************************************************/
var _Frame = function _Frame(path, ms, callback) {
	this.img = new Image();
	this.frameTime = ms;

	if (typeof callback === "function") {
		this.img.addEventListener('load', callback( {
			message : path + " -- loaded",
			frame   : this
		}));
	}

	this.img.src = path;
}

/******************************************************************************

Defines an animation as an ordered array of images to be shown based on 
certain conditions and after a certain period of time.

******************************************************************************/
var Animation = function Animation() {
	this._frames = [];
	this.numFrames = 0;
	this.totalTime = 0;
	this.currTime = 0;
	this.currIndex = 0;
}

/******************************************************************************

Add a frame to this animation. This function accepts only strings paths to 
images.

******************************************************************************/
Animation.prototype.addFrame = function(path, ms, callback) {
	var frame = new _Frame(path, ms, callback);

	this._frames.push(frame);
	this.numFrames++;
	this.totalTime += ms;
};

/******************************************************************************

Update this animation based on a 'dt' param interval.

******************************************************************************/
Animation.prototype.update = function(dt) {
	this.currTime += dt;

	//only update if there are 2 or more frames in this animation
	if (this.numFrames > 1) {

		//if the currentTime is greater than the current frame's running time...
		if (this.currTime >= this._frames[this.currIndex].frameTime) {

			//keep the overflow time...
			this.currTime %= this._frames[this.currIndex].frameTime;

			//and increase index to the next frame
			this.currIndex++;
		}
	}
};

/******************************************************************************

Returns the current frame's image for drawing. This function also handles
resetting the animation index if the animation is over; looping the animation

******************************************************************************/
Animation.prototype.getCurrImg = function() {
	this.currIndex = (this.currIndex >= this.numFrames) ? 0 : this.currIndex;
	return this._frames[this.currIndex].img || null;
};

/******************************************************************************

Synonymous with 'RESET', this function starts/restarts the current animation

******************************************************************************/
Animation.prototype.start = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

//export the Animation constructor
module.exports = Animation;


},{}],6:[function(require,module,exports){
/******************************************************************************

Describes any interactable object in the game. Can't decide yet if everything
should be derived from this class, or if this class is everything in the game
that isn't a player or enemy....

would make sense if this is the base class for every interactable with a
'type' field; player, enemy, interactable, cow...etc.

to hold basic drawing and physics information? any extending object should
override the drawing and physics update functions.

******************************************************************************/
var vect = require("../utilities/vector2D"),
	Animation = require('./animation');

var Entity = function Entity() {
	this.pos = vect.create(0,0);
	this.vel = vect.create(0,0);
	this.accel = vect.create(0,0);
	this.prev_pos = vect.create(0,0);
	this.mass = 5;
	this.maxhp = 100;
	this.currhp = 100;
	this.inventory = {};
	this.equipment = {};
	this.upgrades = {};
	this.type = "entity";
	this.direction = 'left';
	this.animations = {
		'left'  : new Animation()
	};
	this.drawOptions = {
		scaledWidth  : 0.5,
		scaledHeight : 0.5
	};
}

/******************************************************************************

Adds a frame to the specified animation given by name. If the animation name 
doesn't yet exist for this entity, one is automatically created.

******************************************************************************/
Entity.prototype.addFrame = function(animation, path, ms, callback) {
	var anim = this.animations[animation] || new Animation();
	anim.addFrame(path, ms, callback);
	this.animations[animation] = anim;

	//console.log(this.animations);
};

/******************************************************************************

Seems like acceleration is acting like veloctiy....

******************************************************************************/
Entity.prototype.updateVerlet = function(dt) {

	this.vel.x = (2 * this.pos.x) - this.prev_pos.x;

	console.log(this.vel.x);

	this.pos.x = (2 * this.pos.x) - this.prev_pos.x + this.accel.x * dt * dt;
	this.pos.y = (2 * this.pos.y) - this.prev_pos.y + this.accel.y * dt * dt;

	this.prev_pos.x = this.pos.x;
	this.prev_pos.y = this.pos.y;

	//update animations
	this.animations[this.direction].update(dt);
};


/******************************************************************************

Definitely works as intended, but I have no idea if this is truly utilizing
Runge-Kutta properly...

******************************************************************************/
Entity.prototype.updateRungeKutta = function(dt, stepsize) {
	//f  := 0.5*a*t^2 + v*t + x(n-1);
	//f` := a*t + v;
	var k1,
	    k2,
	    k3,
	    k4,
	    h = stepsize || 0.2;

	//calculate new x
	k1 =  this.vel.x + this.accel.x *  dt;
	k2 = (this.vel.x + k1/2) + (this.accel.x * (dt/2));
	k3 = (this.vel.x + k2/2) + (this.accel.x * (dt/2));
	k4 = (this.vel.x + k3)   + (this.accel.x * (dt));

	//update pos x and vel x
	this.pos.x += (dt/6) * (k1 + (2 * k2) + (2 * k3) + k4);
	this.vel.x += this.accel.x * dt;

	//calculate new y
	k1 =  this.vel.y + this.accel.y *  dt;
	k2 = (this.vel.y + k1/2) + (this.accel.y * (dt + dt/2));
	k3 = (this.vel.y + k2/2) + (this.accel.y * (dt + dt/2));
	k4 = (this.vel.y + k3)   + (this.accel.y * (dt));

	//update new y
	this.pos.y += (dt/6) * (k1 + (2 * k2) + (2 * k3) + k4);
	this.vel.y += this.accel.y * dt;

	//update animations
	this.animations[this.direction].update(dt);
};

/******************************************************************************

Draw this entity to the screen with the given context

******************************************************************************/
Entity.prototype.draw = function(ctx) {
	var img = this.animations[this.direction].getCurrImg();

	if (img != null) {
		ctx.drawImage(img, 
		              this.pos.x, 
		              this.pos.y, 
		              this.animations[this.direction].getCurrImg().width * this.drawOptions.scaledWidth, 
		              this.animations[this.direction].getCurrImg().height * this.drawOptions.scaledHeight
		             );	
	}
};


//export the Entity constructor
module.exports = Entity;
},{"../utilities/vector2D":8,"./animation":5}],7:[function(require,module,exports){
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
},{"./core/input-manager":2,"./core/renderer":3,"./core/state":4,"./entity/entity":6}],8:[function(require,module,exports){
/******************************************************************************

Defines a 2D vector and basic math operations performed on those vectors.

To use:

var vect = require("vector2D");

var pos1 = vect.create(0,0),     //creates a new Vector at point 0,0;
    pos2 = vect.create(100,100), //creates a new Vector at point 100,100;
    pos3;

pos3 = vect.add(pos1, pos2);     //add two vectors together;
                                 //store new vector in pos3;

pos1.add(pos2);                  //add pos2 to pos1 by modifying pos1;

pos1 = vect.add(pos1, pos2);     //same as statement above


To summarize: using vect will always return a value or a new vector
              while invoking methods on vectors themselves will change
              thie calling vector.

******************************************************************************/

var Vector2D = function(x,y) {
	this.x = x;
	this.y = y;
}

Vector2D.prototype.add = function(v2) {
	this.x += v2.x;
	this.y += v2.y;
};

Vector2D.prototype.diff = function(v2) {
	this.x = v2.x - this.x;
	this.y = v2.y - this.y;
};

Vector2D.prototype.scalar = function(s) {
	this.x *= s;
	this.y *= s;
};

Vector2D.prototype.normalize = function() {
	var dd = (this.x * this.x) + (this.y * this.y),
	    d  = Math.sqrt(dd);

	this.x = this.x / d;
	this.y = this.y / d;
};

Vector2D.prototype.magnitude = function() {
	var dd = (this.x * this.x) + (this.y * this.y),
	    d  = Math.sqrt(dd);

	return d;
};

Vector2D.prototype.dotProduct = function(v2) {
	return ((this.x * v2.x) + (this.y * v2.y));
};

exports.create = function(x,y) {
	return new Vector2D(x,y);
}

exports.add = function(v1,v2) {
	return new Vector2D((v1.x + v2.x), (v1.y + v2.y));
}

exports.diff = function(v1,v2) {
	return new Vector2D((v2.x - v1.x), (v2.y - v1.y));
}

exports.scalar = function(v1, s) {
	return new Vector2D((v1.x * s), (v1.y * s));
}

exports.normalize = function(v1) {
	var dd = (v1.x * v1.x) + (v1.y * v1.y);
	    d  = Math.sqrt(dd);

	return new Vector2D((v1.x / d), (v1.y / d));
}

exports.magnitude = function(v1) {
	var dd = (v1.x * v1.x) + (v1.y * v1.y),
	    d  = Math.sqrt(dd);

	return d;
}

exports.dotProduct = function(v1,v2) {
	return ((v1.x * v2.x) + (v1.y * v2.y));
}
},{}]},{},[7])