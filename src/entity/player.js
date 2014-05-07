var Entity = require('./entity'),
		AABB = require('../core/boundingbox.js');

var Player = function Player() {

	//Player inherits from Entity
	Entity.call(this);

	//state for player; idle or attacking
	this.state = 'idle';

	//attack list for this player
	this.attacks = {};

	//curr attacks to update and detect collisions
	this.currAttacks = [];
}

//inheritance
Player.prototype = Object.create(Entity.prototype);

/******************************************************************************

Add a boundng box in the player object space; (0,0) is top left of player

******************************************************************************/
Player.prototype.addAABB = function(x, y, width, height) {
	var box = new AABB(this.pos.x, this.pos.y, x, y, width, height);

	//from the entity prototype chain
	this.aabbs.push(box);
}

/******************************************************************************

Associates an attack with this player and sets starting location in player
space

******************************************************************************/
Player.prototype.addAttack = function(attackName, attack) {
	this.attacks[attackName] = attack;
}

/******************************************************************************

Update the player

******************************************************************************/
Player.prototype.update = function(dt) {

	//update player pos based on vel and forces
	this.updateRungeKutta(dt);

	//update currAttack pos based on player pos
	for (var i = 0; i < this.currAttacks.length; i++) {
		this.currAttacks[i].update(dt, this.pos.x, this.pos.y);
		//this.currAttacks[i].updateRungeKutta(dt);
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

/******************************************************************************

Add the given pre-defined attack to the list of current attacks to render and
update.

******************************************************************************/
Player.prototype.attack = function(attackString) {

	var curr = this.attacks[attackString];

	if (curr) {
		this.currAttacks.push(curr);
	}
	else {
		console.log('undefined attackString: ', attackString);
	}

};

/******************************************************************************

Remove the given attack from the current list of attacks to render and update

******************************************************************************/
Player.prototype.removeAttack = function(attackString) {
	var curr = this.attacks[attackString];

	console.log('removing attack: ', attackString);

	if (curr) {
		//this.currAttacks.split(curr);
		//console.log('should remove attack');
	}
	else {
		console.log('undefined attackString: ', attackString);
	}
}

/******************************************************************************

Override the Entity draw function to account for player attacks.

******************************************************************************/
Player.prototype.draw = function(ctx) {

	var img = this.animations[this.direction].getCurrImg();

	if (img != null) {
		ctx.drawImage(
			img,
			this.pos.x,
			this.pos.y,
			this.animations[this.direction].getCurrImg().width * this.drawOptions.scaledWidth,
			this.animations[this.direction].getCurrImg().height * this.drawOptions.scaledHeight
		);
	}

	//draw the current attacks.
	for (var i = 0; i < this.currAttacks.length; i++) {
		if (this.currAttacks[i]) {
			this.currAttacks[i].direction = this.direction;
			this.currAttacks[i].draw(ctx);
		}
	}
}

//export player constructor
module.exports = Player;
