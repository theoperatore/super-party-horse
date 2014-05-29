var GameState = require('./state'),
		Control   = require('./controls/control'),
		Vector2D  = require('../utilities/vector2D');

//
// A window that extends a state and contains controls
//
var Menu = function(name) {

	//Inherit game state
	GameState.call(this, name);

	//movement vectors
	this.pos = Vector2D.create(0,0);
	this.vel = Vector2D.create(0,0);
	this.acc = Vector2D.create(0,0);

	//indexed by control name
	this.controls = {};
}

//inheritance
Menu.prototype = Object.create(GameState.prototype);

//
// Adds a new control to the menu
//
Menu.prototype.addControl = function(name, label, callback) {

	//only add if not in the menu already
	if (!this.controls[name]) {

		var tmpCtrl = new Control(name, label);
		tmpCtrl.engageCallback = (typeof callback === 'function') ? callback : function() { console.log('Callback not set on control: ', name); };
		this.controls[name] = tmpCtrl;
	}
}

//
// Draw menu controls in a list
//


//export constructor
module.exports = Menu;
