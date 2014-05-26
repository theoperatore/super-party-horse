(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var vect = require('../utilities/vector2D');

/******************************************************************************

One collide-able boudning box.

******************************************************************************/
var AABB = function(realX, realY, x, y, width, height) {

  //keep track of width and height of box
  this.width = width;
  this.height = height;

  //bounding coords
  this.minBoundX = realX + x;
  this.minBoundY = realY + y;
  this.maxBoundX = this.minBoundX + width;
  this.maxBoundY = this.minBoundY + height;

  //displacement from object space
  this.offsetX = x;
  this.offsetY = y;

  //vector for center
  this.center = vect.create( ((x + width) / 2), ((y + height) / 2) );
}

/******************************************************************************

Returns true iff collision via overlap with other bounding box 'b';

******************************************************************************/
AABB.prototype.collidesWith = function(b) {
  if (this.minBoundX > b.maxBoundX ||
      this.minBoundY > b.maxBoundY ||
      this.maxBoundX < b.minBoundX ||
      this.maxBoundY < b.minBoundY)
  {
        return false;
  }

  return true;
}

/******************************************************************************

Set the new uposition of this AABB; also updates center coords

******************************************************************************/
AABB.prototype.updatePos = function(realX, realY) {

  //update bounding coords
  this.minBoundX = realX + this.offsetX;
  this.minBoundY = realY + this.offsetY;
  this.maxBoundX = this.minBoundX + this.width;
  this.maxBoundY = this.minBoundY + this.height;

  //update center
  this.center.x = (this.minBoundX + this.width) / 2;
  this.center.y = (this.minBoundY + this.height) / 2;
}


//export the constructor
module.exports = AABB;

},{"../utilities/vector2D":13}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/******************************************************************************

Handles setting up game inputs and eventListeners for any game input.

******************************************************************************/
var Input = function Input(name, keyCode, callback, keyup) {
	this.name = name;
	this.keyCode = keyCode;
	this.keydownCallback = callback || function() {};
	this.keyupCallback = keyup || function() {};
	this.isPressed = false;
	this.isSystemInput = false;
}


/******************************************************************************

Structure to hold Input objects. Index is the keycode associated with the
keyboard event being processed, resulting data is the Input object holding the
function to call for either keydown or keyup 

******************************************************************************/
var inputs = [],
	inputMap = {};


/******************************************************************************

Initialized the DOM with keydown and keyup events and processes them
accordingly.

******************************************************************************/
exports.init = function() {

	document.addEventListener('keydown', function(ev) {
		
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		tmpInput.isPressed = true;

		if (tmpInput !== 'undefined' && tmpInput.isSystemInput) {
			tmpInput.keydownCallback();
		} 

	});

	document.addEventListener('keyup', function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		tmpInput.isPressed = false;

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
exports.addInput = function(name, keyCode, keydownCallback, keyupCallback, systemInput) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback, keyupCallback);

	inputs[keyCode] = newInput;
	inputMap[name] = keyCode;
}

/******************************************************************************

Add a system input

******************************************************************************/
exports.addSystemInput = function(name, keyCode, keydownCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback);

	newInput.isSystemInput = true;

	inputs[keyCode] = newInput;
	inputMap[name] = keyCode;
}

/******************************************************************************

Removes the given input from the input collection.

******************************************************************************/
exports.removeInput = function(name) {
	if (inputMap[name]) {
		var out = inputs[inputMap[name]] = undefined;
		inputMap[name] = undefined;

		//console.log(out);
		//console.log(inputs);
	}
}

/******************************************************************************

Returns the underlying array holding all of the inputs and associated callbacks

******************************************************************************/
exports.getInputCollection = function() {
	return inputs;
}

/******************************************************************************

Updates the inputs and inputMap array with the input functions in the new state

WARNING: this function overrides previous input functions

******************************************************************************/
exports.useState = function(newState) {

	for (var i = 0; i < newState.inputs.length; i++) {
		var tmpInput = newState.inputs[i];

		inputs[tmpInput.keyCode] = tmpInput;
		inputMap[tmpInput.name] = tmpInput.keyCode;
	}
}

/******************************************************************************

Creates and Returns a new instance of Input; mainly used in game states

******************************************************************************/
exports.createInput = function(name, keyCode, keydownCallback, keyupCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	return new Input(name, keyCode, keydownCallback, keyupCallback);
}
},{}],4:[function(require,module,exports){
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
	rend.state = state || null;
}

/******************************************************************************

Handles switching from gamestate to gamestate, but only for rendering purposes.
Changing inputs for new gamestates is handled elsewhere.

This function always assumes that the current underlying gamestate is the
most recent, so the player will always be passed from the current gamestate
to the new gamestate

DUNNO IF THIS IS ACTUALLY WORTH DOING...

******************************************************************************/
exports.useState = function(newState) {
	if (typeof newState != 'undefined') {
		rend.state = newState;
		rend.state.player = newState.player;
	}
}

/******************************************************************************

Draw all set up objects to the screen

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

				for (var i = 0; i < renderState.enemies.length; i++) {
					var e = renderState.enemies[i];

					if (e != null) {
							e.draw(rend.ctx);

							//draw aabb
							//rend.ctx.strokeRect(e.aabbs[0].minBoundX,
							//					e.aabbs[0].minBoundY,
							//					e.aabbs[0].width,
							//					e.aabbs[0].height);
					}
				}

			}

			//draw player including upgrades
			if (renderState.player != null) {

				//draw the base of the character
				renderState.player.draw(rend.ctx);

				//draw aabb
				//rend.ctx.strokeRect(renderState.player.aabbs[0].minBoundX,
				//					renderState.player.aabbs[0].minBoundY,
				//					renderState.player.aabbs[0].width,
				//					renderState.player.aabbs[0].height);
			}

			//draw foreground
			if (renderState.scenery.foreground != null) {
				rend.ctx.drawImage(renderState.scenery.foreground, 0, rend.height - 250);
			}

			//draw hud
			if (renderState.hud != null) {

			}

			//draw basic text to the screen
			if (renderState.plainText != null) {
				rend.ctx.beginPath();
				rend.ctx.font = "25pt sans-serif";
				rend.ctx.fillText(renderState.plainText, 0 ,rend.height / 2);
			}

			//draw any optional rendering specified by the designer
			if (renderState.optionalRenderingFucntion != null) {
				renderState.ooptionalRenderingFunction();
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

},{}],5:[function(require,module,exports){
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
	this.plainText = null;
	this.optionalRenderingFunction = null;
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
	if (enemy.length) {
		for (var i = 0; i < enemy.length; i++) {
			this.enemies.push(enemy[i]);
		}
	}
	else {
		this.enemies.push(enemy);
	}
}

/******************************************************************************

Add NPCs to this State; can add single npcs or an array

******************************************************************************/
State.prototype.addNPCToState = function(npc) {
	if (npc.length) {
		for (var i = 0; i < npc.length; i++) {
			this.npcs.push(npc[i]);
		}
	}
	else {
		this.npcs.push(npc);
	}
}

/******************************************************************************

Add interactables to this State; single or an array

******************************************************************************/
State.prototype.addInteractableToState = function(interactable) {
	if (interactable.length) {
		for (var i = 0; i < interactable.length; i++) {
			this.interactables.push(interactable[i]);
		}	
	}
	else {
		this.interactables.push(interactable);
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

Adds a system input to this state, but not to the input manager

******************************************************************************/
State.prototype.addSystemInput = function(name, keyCode, keydownCallback) {
	var input = inputManager.createInput(name, keyCode, keydownCallback);

	input.isSystemInput = true;

	this.inputs.push(input);
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

/******************************************************************************

Set any optional rendering function. set to 'null' if anything but a function
is passed as a parameter.

******************************************************************************/
State.prototype.addOptionalRendering = function(callback) {
	this.optionalRenderingFunction = (typeof callback === 'function') ? callback : null;
};

//export the State constructor
module.exports = State;


},{"./image":2,"./input-manager":3}],6:[function(require,module,exports){
/******************************************************************************

Private inner 'class' that represents one frame in an animation

******************************************************************************/
var _Frame = function _Frame(path, ms, completeCallback) {
	this.img = new Image();
	this.frameTime = ms;

	//loadCallback = (typeof loadCallback === 'function') ? loadCallback : function() {};

	/*this.img.addEventListener('load', loadCallback( {
		message : path + " -- loaded",
		frame   : this
	}));
	*/

	this.img.addEventListener('load', function(ev) {
		console.log('loaded:', path, ' -- frame: ', this);
	});

	this.img.src = path;

	this.completedCallback = (typeof completeCallback === 'function') ? completeCallback : null;
}

/******************************************************************************

Defines an animation as an ordered array of images to be shown based on
certain conditions and after a certain period of time.

******************************************************************************/
var Animation = function Animation() {
	this._frames = [];
	this.numFrames = 0;
	this.currTime = 0;
	this.currIndex = 0;
	this.loop = true;
	this.completedCallback;
}

/******************************************************************************

Add a frame to this animation. This function accepts only strings paths to
images.

******************************************************************************/
Animation.prototype.addFrame = function(path, ms, completedCallback, loadCallback) {
	var frame = new _Frame(path, ms, completedCallback, loadCallback);

	this._frames.push(frame);
	this.numFrames++;
};

/******************************************************************************

Add a callback function to be called when this animation is completed.

******************************************************************************/
Animation.prototype.addAnimationCompletedCallback = function(callback) {
	this.completedCallback = (typeof callback === 'function') ? callback : function() { console.log ('callback not a function'); };
};

/******************************************************************************

Update this animation based on a 'dt' param interval.

******************************************************************************/
Animation.prototype.update = function(dt) {
	this.currTime += dt;

	//only update if this frame is defined
	if (this._frames[this.currIndex]) {

		//update index if we're done with this frame
		if (this.currTime >= this._frames[this.currIndex].frameTime) {
			this.currTime %= this._frames[this.currIndex].frameTime;

			//this frame is over, if this frame has a callback, call it.
			if (this._frames[this.currIndex].completedCallback != null) {
				//console.log('calling frame completed callback');
				this._frames[this.currIndex].completedCallback();
			}

			this.currIndex++;

		}

		//if the animation is done...
		if (this.currIndex >= this.numFrames) {

			//if we aren't looping...
			if (!this.loop) {

				//call the callback
				this.completedCallback();
			}

			//regardless, reset vars
			this.reset();
		}
	}
};

/******************************************************************************

Returns the current frame's image for drawing. The update functon ensures that
only a valid frame is returned; this.currIndex never results in 'undefined'

******************************************************************************/
Animation.prototype.getCurrImg = function() {
	return this._frames[this.currIndex].img;
};

/******************************************************************************

This function starts/restarts the current animation

******************************************************************************/
Animation.prototype.reset = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

//export the Animation constructor
module.exports = Animation;

},{}],7:[function(require,module,exports){
var Entity = require('./entity'),
    AABB = require('../core/boundingbox');

//
//
// A special type of Entity that gets drawn in object space
//
//
var Attack = function() {

  //inherit from Entity
  Entity.call(this);

  //the realX and Y of the entity associated with this attack
  //the pos.x and y are calculated from realX/Y
  this.realX = 0;
  this.realY = 0;
  this.objX = 0;
  this.objY = 0;
}

//inheritance
Attack.prototype = Object.create(Entity.prototype);

//
// Add a new bounding box to the attack
//
Attack.prototype.addAABB = function(x, y, width, height) {
  var box = new AABB(this.pos.x, this.pos.y, x, y, width, height);

  this.aabbs.push(box);
}

//
// Update this attack taking into account the associated entity's realX/Y pos.
//
Attack.prototype.update = function(dt, nrX, nrY) {

  //update the real x and y
  this.realX = nrX;
  this.realY = nrY;

  this.pos.x = this.realX + this.objX;
  this.pos.y = this.realY + this.objY;

  //update internal positions
  this.updateRungeKutta(dt);
}

//export the constructor
module.exports = Attack;

},{"../core/boundingbox":1,"./entity":9}],8:[function(require,module,exports){
var Entity = require('./entity'),
    AABB = require('../core/boundingbox');


var Enemy = function() {

  //inheritance
  Entity.call(this);

}

//inheritance
Enemy.prototype = Object.create(Entity.prototype);

/******************************************************************************

Add a new aabb to the enemy

******************************************************************************/
Enemy.prototype.addAABB = function(x, y, width, height) {
  var box = new AABB(this.pos.x, this.pos.y, x, y, width, height);

  this.aabbs.push(box);
}

/******************************************************************************

Update this enemy's position and bounding boxes

******************************************************************************/
Enemy.prototype.update = function(dt) {

  this.updateRungeKutta(dt);
}

module.exports = Enemy;

},{"../core/boundingbox":1,"./entity":9}],9:[function(require,module,exports){
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
	  Animation = require('./animation'),
		AABB = require('../core/boundingbox');

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
	this.direction = 'left';
	this.dirLock = false;
	this.animations = {
		'left'  : new Animation()
	};
	this.drawOptions = {
		scaledWidth  : 0.5,
		scaledHeight : 0.5
	};
	this.aabbs = [];
}

/******************************************************************************

Adds a frame to the specified animation given by name. If the animation name
doesn't yet exist for this entity, one is automatically created.

******************************************************************************/
Entity.prototype.addFrame = function(animation, path, ms, completedCallback) {
	var anim = this.animations[animation] || new Animation();
	anim.addFrame(path, ms, completedCallback);
	this.animations[animation] = anim;

	//console.log(this.animations);
};

/******************************************************************************

Control if the given animation is to loop or complete once.

******************************************************************************/
Entity.prototype.setAnimationLoop = function(anim, loop) {
	if (this.animations[anim]) {
		this.animations[anim].loop = loop;
	}
	else {
		console.log('not a defined animation', anim);
	}
};

/******************************************************************************

Sets up a callback to be called when an animation is completed

******************************************************************************/
Entity.prototype.addAnimationCompletedCallback = function(anim, callback) {
	if (this.animations[anim]) {
		if (typeof callback === 'function') {
			this.animations[anim].addAnimationCompletedCallback(callback);
		}
	}
	else {
		console.log(anim,'not a defined animation', anim);
	}
};

/******************************************************************************

Sets the new direction and resets the preveious direction's animation

******************************************************************************/
Entity.prototype.setDirection = function(dir) {
	if (this.animations[this.direction]) {
		this.animations[this.direction].reset();

		this.direction = dir || this.direction;
	}
}

/******************************************************************************

Stops this entity from moving by setting accel and vel to 0

******************************************************************************/
Entity.prototype.stop = function() {
	this.accel.x = 0;
	this.accel.y = 0;
	this.vel.x = 0;
	this.vel.y = 0;
}

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
	if (this.animations[this.direction]) {
		this.animations[this.direction].update(dt)
	}

	//updating bounding boxes?
	for (var i = 0; i < this.aabbs.length; i++) {
		this.aabbs[i].updatePos(this.pos.x, this.pos.y);
	}
};

/******************************************************************************

Draw this entity to the screen with the given context

******************************************************************************/
Entity.prototype.draw = function(ctx) {
	var anim = this.animations[this.direction],
		img = (anim) ? anim.getCurrImg() : null;

	if (img != null) {
		ctx.drawImage(
			img,
		  this.pos.x,
		  this.pos.y,
		  this.animations[this.direction].getCurrImg().width * this.drawOptions.scaledWidth,
		  this.animations[this.direction].getCurrImg().height * this.drawOptions.scaledHeight
		);
	}
};

//export the Entity constructor
module.exports = Entity;

},{"../core/boundingbox":1,"../utilities/vector2D":13,"./animation":6}],10:[function(require,module,exports){
var Entity = require('./entity'),
		AABB = require('../core/boundingbox.js');

var Player = function Player() {

	//Player inherits from Entity
	Entity.call(this);

	//state for player; idle or attacking
	this.state = 'idle';

	//attack list for this player
	this.attacks = {};

	//curr attacks to update and detect collisions
	this.currAttacks = [];
}

//inheritance
Player.prototype = Object.create(Entity.prototype);

/******************************************************************************

Add a boundng box in the player object space; (0,0) is top left of player

******************************************************************************/
Player.prototype.addAABB = function(x, y, width, height) {
	var box = new AABB(this.pos.x, this.pos.y, x, y, width, height);

	//from the entity prototype chain
	this.aabbs.push(box);
}

/******************************************************************************

Associates an attack with this player and sets starting location in player
space

******************************************************************************/
Player.prototype.addAttack = function(attackName, attack) {
	this.attacks[attackName] = attack;
}

/******************************************************************************

Update the player

******************************************************************************/
Player.prototype.update = function(dt) {

	//update player pos based on vel and forces
	this.updateRungeKutta(dt);

	//update currAttack pos based on player pos
	for (var i = 0; i < this.currAttacks.length; i++) {
		this.currAttacks[i].update(dt, this.pos.x, this.pos.y);
		//this.currAttacks[i].updateRungeKutta(dt);
	}

}

/******************************************************************************

Check for input for the player

******************************************************************************/
Player.prototype.pollInput = function(inputMap, inputCollection) {
	var playerInput;

	for (var name in inputMap) {

		playerInput = inputCollection[inputMap[name]] || null;

		//running into problems where the animation is still playing while input
		//is continuing to add things to arrays during animation play.
		//need to find a way to 'taint' to denote that it should only be tracked
		//once.
		if (playerInput != null && playerInput.isPressed) {

			inputCollection[inputMap[name]].keydownCallback();
		}
	}
};

/******************************************************************************

Add the given pre-defined attack to the list of current attacks to render and
update.

******************************************************************************/
Player.prototype.attack = function(attackString) {

	var curr = this.attacks[attackString],
			found = false;

	if (curr) {

		//
		// only add if it doesn't already exist? Might work for now...
		//
		for (var i = 0; i < this.currAttacks.length; i++) {
			found = (curr === this.currAttacks[i]) ? true : false;
		}

		if (!found) { this.currAttacks.push(curr) };
	}
	else {
		console.log('undefined attackString: ', attackString);
	}

};

/******************************************************************************

Remove the given attack from the current list of attacks to render and update

******************************************************************************/
Player.prototype.removeAttack = function(attackString) {
	var curr = this.attacks[attackString];

	if (curr) {
		for (var i = 0; i < this.currAttacks.length; i++) {
			if (this.currAttacks[i] === curr) {
				this.currAttacks.splice(i,1);
				break;
			}
		}
	}
	else {
		console.log('undefined attackString: ', attackString);
	}
}

/******************************************************************************

Override the Entity draw function to account for player attacks.

******************************************************************************/
Player.prototype.draw = function(ctx) {

	var img = this.animations[this.direction].getCurrImg();

	if (img != null) {
		ctx.drawImage(
			img,
			this.pos.x,
			this.pos.y,
			this.animations[this.direction].getCurrImg().width * this.drawOptions.scaledWidth,
			this.animations[this.direction].getCurrImg().height * this.drawOptions.scaledHeight
		);
	}

	//draw the current attacks.
	for (var i = 0; i < this.currAttacks.length; i++) {
		if (this.currAttacks[i]) {
			this.currAttacks[i].direction = this.direction;
			this.currAttacks[i].draw(ctx);
		}
	}
}

//export player constructor
module.exports = Player;

},{"../core/boundingbox.js":1,"./entity":9}],11:[function(require,module,exports){
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
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

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
	title.plainText = '<! Super Party Horse !> Press Enter to Party!';

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

},{"./core/input-manager":3,"./core/renderer":4,"./core/state":5,"./entity/enemy":8,"./entity/entity":9,"./utilities/resource":12}],12:[function(require,module,exports){
var Player = require('../entity/player'),
    AABB = require('../core/boundingbox'),
    Entity = require('../entity/entity'),
    Attack = require('../entity/attack');

/******************************************************************************

Manages the importing / creation of Entities from JSON files

******************************************************************************/
exports.loadResourceFile = function(path) {



}

/******************************************************************************

Exports the given object as a resource file

******************************************************************************/
exports.exportObject = function(obj) {



}

/******************************************************************************

Loads and returns a player object based on the included definitions

******************************************************************************/
exports.loadPlayerDefinition = function() {

  var player = new Player(),
      basicAttack = new Attack();

  //set up player
  player.pos.y = 100;
  player.pos.x = 100;

  player.addFrame('right', "./src/resources/donkey-idle-right.png", 1000);
  player.addFrame('left', "./src/resources/donkey-idle-left.png", 1000);

  player.addFrame('attack-right', "./src/resources/attack/donkey-attack-end-right.png", 400);
  player.addFrame('attack-left', "./src/resources/attack/donkey-attack-end-left.png", 400);

  //walk animations
  player.addFrame('walk-right', "./src/resources/donkey-walk-1.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-2.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-3.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-2.png", 250);

  //setup basic attack
  basicAttack.addFrame('attack-right', "./src/resources/attack/sound-waves-right.png", 400);
  basicAttack.addFrame('attack-left', "./src/resources/attack/sound-waves-left.png", 400);

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

}

/******************************************************************************

Loads and returns an array of enemies

******************************************************************************/
exports.loadEnemyDefinition = function(numEnemies) {


}

},{"../core/boundingbox":1,"../entity/attack":7,"../entity/entity":9,"../entity/player":10}],13:[function(require,module,exports){
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
              the calling vector.

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

},{}]},{},[11])