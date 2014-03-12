var Entity = require('./entity'),
    AABB = require('../core/boundingbox');


var Enemy = function() {

  //inheritance
  Entity.call(this);

  //boundig boxes
  this.aabbs = [];
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

  for (var i = 0; i < this.aabbs.length; i++) {

    this.aabbs[i].updatePos(this.pos.x, this.pos.y);

  }
}

module.exports = Enemy;