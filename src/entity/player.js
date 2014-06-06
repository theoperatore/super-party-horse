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

	//the input map to check against
	this.inputMap = {};
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

Set the player's input map

******************************************************************************/
Player.prototype.setInputMap = function(map) {
	this.inputMap = map;
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
Player.prototype.pollInput = function(inputCollection, customInputMap) {
	var playerInput,
			inputMap = customInputMap || this.inputMap;

	for (var name in inputMap) {

		playerInput = inputCollection[inputMap[name]] || null;

		//running into problems where the animation is still playing while input
		//is continuing to add things to arrays during animation play.
		//need to find a way to 'taint' to denote that it should only be tracked
		//once.
		if (playerInput != null && playerInput.isPressed) {

			inputCollection[inputMap[name]].keydownCallback();
		}
	}
};

/******************************************************************************

Add the given pre-defined attack to the list of current attacks to render and
update.

******************************************************************************/
Player.prototype.attack = function(attackString) {

	var curr = this.attacks[attackString],
			found = false;

	if (curr) {

		//
		// only add if it doesn't already exist? Might work for now...
		//
		for (var i = 0; i < this.currAttacks.length; i++) {
			found = (curr === this.currAttacks[i]) ? true : false;
		}

		if (!found) { this.currAttacks.push(curr) };
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

	if (curr) {
		for (var i = 0; i < this.currAttacks.length; i++) {
			if (this.currAttacks[i] === curr) {
				this.currAttacks.splice(i,1);
				break;
			}
		}
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
