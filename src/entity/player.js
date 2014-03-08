var Entity = require('./entity');

var Player = function Player() {
	
	//Player inherits from Entity
	Entity.call(this);
}

//inheritance
Player.prototype = Object.create(Entity.prototype);


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

module.exports = Player;

