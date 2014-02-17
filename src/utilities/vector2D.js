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