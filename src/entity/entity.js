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
	this.direction = 'left';
	this.dirLock = false;
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
Entity.prototype.addFrame = function(animation, path, ms, loadCallback) {
	var anim = this.animations[animation] || new Animation();
	anim.addFrame(path, ms, loadCallback);
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
	if (this.animations[this.direction] != 'undefined') {
		this.animations[this.direction].update(dt)
	}

	//updating bounding boxes?
	/**
		Need to have a way to allow for different boxes depending on entity.
		Entity specific?
		Implement in player / enemy class?
	**/
};

/******************************************************************************

Draw this entity to the screen with the given context

******************************************************************************/
Entity.prototype.draw = function(ctx) {
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
};

//export the Entity constructor
module.exports = Entity;
