var Entity = require('./entity');

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
//
// Update this attack taking into account the associated entity's realX/Y pos.
//
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
