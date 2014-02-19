(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

Structure to hold Input objects. 

******************************************************************************/
var inputs = [];


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

exports.addInput = function(name, keyCode, keydownCallback, keyupCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() { };
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback, keyupCallback);

	inputs[keyCode] = newInput;
}
},{}],2:[function(require,module,exports){
/******************************************************************************

Private inner class that represents one frame in a sprite animation

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

Animation.prototype.addFrame = function(path, ms, callback) {
	var frame = new _Frame(path, ms, callback);

	this._frames.push(frame);
	this.numFrames++;
	this.totalTime += ms;
};

Animation.prototype.update = function(dt) {
	this.currTime += dt;

	if (this.numFrames > 1) {
		if (this.currTime >= this.totalTime) {
			this.currTime = this.currTime % this.totalTime;
			this.currIndex = 0;
		}

		if (this.currTime >= this._frames[this.currIndex].frameTime) {
			this.currTime %= this._frames[this.currIndex].frameTime;
			this.currIndex++;
		}
	}
};

Animation.prototype.getCurrImg = function() {
	this.currIndex = (this.currIndex >= this.numFrames) ? 0 : this.currIndex;
	return this._frames[this.currIndex].img;
};

Animation.prototype.start = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

module.exports = Animation;


},{}],3:[function(require,module,exports){
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

Entity.prototype.draw = function(ctx) {
	ctx.drawImage(this.animations[this.direction].getCurrImg(), 
	              this.pos.x, 
	              this.pos.y, 
	              this.animations[this.direction].getCurrImg().width * this.drawOptions.scaledWidth, 
	              this.animations[this.direction].getCurrImg().height * this.drawOptions.scaledHeight
	             );	
};

module.exports = Entity;
},{"../utilities/vector2D":5,"./animation":2}],4:[function(require,module,exports){
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
//player1.accel.x = 0.001;

player1.addFrame('right', "./src/resources/donkey-idle-right.png", 1000, function(ev) {
	playerLeftLoaded = true;
	console.log(ev);
});

player1.addFrame('right', "./src/resources/donkey-fly-right.png", 500, function(ev) {
	playerRightLoaded = true;
	console.log(ev);
});

player1.addFrame('left', "./src/resources/donkey-idle-left.png", 1000, function(ev) {
	console.log(ev);
});

player1.addFrame('left', "./src/resources/donkey-fly-left.png", 500, function(ev) {
	console.log(ev);
});

player1.direction = "right";

Input.init();

Input.addInput('left', 65, function() {
	player1.accel.x = -0.0001;
	player1.direction = 'left';
});
Input.addInput('right', 68, function() {
	player1.accel.x = 0.0001;
	player1.direction = 'right';
});
Input.addInput('up', 87, function() {
	player1.accel.y = -0.0001;
});
Input.addInput('down', 83, function() {
	player1.accel.y = 0.0001;
});


var count = 0;
var loop = function() {
	ctx.clearRect(0,0,1000,500);

	now = +new Date;
	dt = now - prev;
	prev = now;

	if (playerLeftLoaded && playerRightLoaded) {
		//player1.updateVerlet(dt);
		player1.updateRungeKutta(dt);



		player1.draw(ctx);
	}

	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);


},{"./core/input-manager":1,"./entity/animation":2,"./entity/entity":3}],5:[function(require,module,exports){
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
},{}]},{},[4])