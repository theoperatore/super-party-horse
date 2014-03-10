var vect = require('../utilities/vector2D');

/******************************************************************************

One collide-able boudning box.

******************************************************************************/
var AABB = function(x, y, width, height) {

  //keep track of width and height of box
  this.width = width;
  this.height = height;

  //bouding coords
  this.minBoundX = x;
  this.minBoundY = y;
  this.maxBoundX = x + width;
  this.maxBoundY = y + height;

  //vector for center
  this.center = vect.create( ((x + width) / 2), ((y + height) / 2) );
}

/******************************************************************************

Returns true iff collision via overlap with other bounding box 'b';

******************************************************************************/
AABB.prototype.collidesWith = function(b) {
  if (this.minBoundX > b.maxBoundX) ||
      this.minBoundY > b.maxBoundY  ||
      this.maxBoundX < b.minBoundX  ||
      this.maxBoundY < b.minBoundY)
  {
        return false;
  }

  return true;
}

/******************************************************************************

Set the new uposition of this AABB; also updates center coords

******************************************************************************/
AABB.prototype.updatePos = function(x, y) {

  //update bounding coords
  this.minBoundX = x;
  this.minBoundY = y;
  this.maxBoundX = x + this.width;
  this.maxBoundY = y + this.height;

  //update center
  this.center.x = (x + width) / 2;
  this.center.y = (y + height) / 2;
}


//export the constructor
module.exports = AABB;
