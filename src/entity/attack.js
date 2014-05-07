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
