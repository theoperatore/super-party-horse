var vect = require('../utilities/vector2D');

/******************************************************************************

One collide-able boudning box.

******************************************************************************/
var AABB = function(realX, realY, x, y, width, height) {

  //keep track of width and height of box
  this.width = width;
  this.height = height;

  //bouding coords
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
