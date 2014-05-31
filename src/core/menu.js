var GameState = require('./state'),
		Control   = require('./controls/control'),
		Entity    = require('../entity/entity'),
		Vector2D  = require('../utilities/vector2D'),
		ObjArray  = require('../utilities/objarray');

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

	//private selected control vars
	this._selectedControl = '';
	this._selectedIndex = 0;

	//indexed by control name
	this.controls = new ObjArray();

	//the entity that will be the selector
	this.selector = new Entity();
	this.selector.addFrame('select','./src/resources/selector.png', 1000);
	this.selector.direction = 'select';
}

//inheritance
Menu.prototype = Object.create(GameState.prototype);

//
// Adds a new control to the menu
//
Menu.prototype.addControl = function(name, label, callback) {
	var tmpCtrl = new Control(name, label),
			numCtrls = this.controls.length();

	//setup callback
	tmpCtrl.engageCallback = (typeof callback === 'function') ? callback : function() { console.log('Callback not set on control: ', name); };

	//setup position
	tmpCtrl.pos.y = numCtrls * 50;

	this.controls.add(name, tmpCtrl);
	console.log('control added: ', name);

}

//
// Engage Selected Control
//
Menu.prototype.engage = function() {
	var ctrl = this.controls.get(this._selectedIndex);

	if (ctrl) {
		ctrl.engage();
	}
	else {
		console.log('invalid control selected, index:', this._selectedIndex, ' length: ', this.controls.length());
	}
}

//
// Changes the currently selected control by specifying the direction:
// up, down, left, right
//
// Optional param int numChanged will move that many controls in the given
// direction
//
Menu.prototype.changeSelected = function(direction, numChanged) {

	if (direction === 'down') {
		this._selectedIndex += numChanged || 1;

		if (this._selectedIndex >= this.controls.length()) {
			this._selectedIndex = 0;
		}

	}
	else if (direction === 'up') {
		this._selectedIndex -= numChanged || 1;

		if (this._selectedIndex < 0) {
			this._selectedIndex = (this.controls.length() - 1);
		}
	}
	else if (direction === 'left') {
		//N/A
	}
	else if (direction === 'right') {
		//N/A
	}

}

//
// Poll for Menu Input
//
Menu.prototype.pollInput = function(inputMap, inputCollection) {}


//
// Draw menu controls in a list by overwritting base state draw
//
Menu.prototype.draw = function(rend) {

	//draw super class draw
	this.constructor.prototype.draw.call(this, rend);

	//draw controls to screen
	for (var i = 0; i < this.controls.length(); i++) {
		this.controls.get(i).draw(rend.ctx);
	}

	//draw selector
	this.selector.pos.x = this.controls.get(this._selectedIndex).pos.x - 50;
	this.selector.pos.y = this.controls.get(this._selectedIndex).pos.y + 5;
	this.selector.draw(rend.ctx);

}

//export constructor
module.exports = Menu;
