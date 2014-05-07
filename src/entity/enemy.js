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
