var Entity = require('./entity'),
		AABB = require('../core/boundingbox.js');

var Player = function Player() {

	//Player inherits from Entity
	Entity.call(this);

	//AABBs for the player
	this.aabbs = [];
}

//inheritance
Player.prototype = Object.create(Entity.prototype);

/******************************************************************************

Add a boundng box in the player object space; (0,0) is top left of player

******************************************************************************/
Player.prototype.addAABB = function(x, y, width, height) {
	var box = new AABB(this.pos.x, this.pos.y, x, y, width, height);

	this.aabbs.push(box);
}

/******************************************************************************

Update the player

******************************************************************************/
Player.prototype.update = function(dt) {

	this.updateRungeKutta(dt);

	for (var i = 0; i < this.aabbs.length; i++) {
		this.aabbs[i].updatePos(this.pos.x, this.pos.y);
	}

}

/******************************************************************************

Check for input for the player

******************************************************************************/
Player.prototype.pollInput = function(inputMap, inputCollection) {
	var playerInput;

	for (var name in inputMap) {

		playerInput = inputCollection[inputMap[name]] || null;

		if (playerInput != null && playerInput.isPressed) {

			//console.log(name, inputCollection[inputMap[name]].isPressed);

			inputCollection[inputMap[name]].keydownCallback();
		}
	}
};


//export player constructor
module.exports = Player;
