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
	this.prev_vel = vect.create(0,0);
	this.prev_accel = vect.create(0,0);
	this.prev_dt = 1;
	this.mass = 5;
	this.maxhp = 100;
	this.currhp = 100;
	this.inventory = {};
	this.equipment = {};
	this.upgrades = {};
	this.type = "entity";
	this.animations = {
		'up'    : new Animation(),
		'right' : new Animation(),
		'down'  : new Animation(),
		'left'  : new Animation()
	};
	this.direction = 'down';
	this.drawOptions = {
		scaledWidth  : 0.5,
		scaledHeight : 0.5
	};
}

Entity.prototype.addFrame = function(animation, path, ms, callback) {
	var anim = this.animations[animation] || new Animation();
	anim.addFrame(path, ms, callback);
	this.animations[animation] = anim;

	console.log(this.animations);
};

/***********************************************

Doesn't properly handle acceleration

************************************************/
Entity.prototype.updateVerlet = function(dt) {

	dt = (dt === 0) ? 1 : dt;

	//time corrected verlet integration technique -- assumes constant acceleration
	this.pos.x = this.pos.x + ((this.pos.x - this.prev_pos.x) * (dt / this.prev_dt)) + 0.5 * (this.accel.x * (dt * dt));
	this.pos.y = this.pos.y + ((this.pos.y - this.prev_pos.y) * (dt / this.prev_dt)) + 0.5 * (this.accel.y * (dt * dt));
	console.log(this.pos.y);

	this.prev_pos.x = this.pos.x;
	this.prev_pos.y = this.pos.y;
	this.prev_dt = dt;
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
	k2 = (this.vel.x + h*k1/2) + (this.accel.x * (dt + h/2));
	k3 = (this.vel.x + h*k2/2) + (this.accel.x * (dt + h/2));
	k4 = (this.vel.x + h*k3)   + (this.accel.x * (dt + h));

	//update pos x and vel x
	this.pos.x += (h/6) * (k1 + (2 * k2) + (2 * k3) + k4);
	this.vel.x += this.accel.x * dt;

	//calculate new y
	k1 =  this.vel.y + this.accel.y *  dt;
	k2 = (this.vel.y + h*k1/2) + (this.accel.y * (dt + h/2));
	k3 = (this.vel.y + h*k2/2) + (this.accel.y * (dt + h/2));
	k4 = (this.vel.y + h*k3)   + (this.accel.y * (dt + h));

	//update new y
	this.pos.y += (h/6) * (k1 + (2 * k2) + (2 * k3) + k4);
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