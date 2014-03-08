/******************************************************************************

Handles setting up game inputs and eventListeners for any game input.

******************************************************************************/
var Input = function Input(name, keyCode, callback, keyup) {
	this.name = name;
	this.keyCode = keyCode;
	this.keydownCallback = callback || function() {};
	this.keyupCallback = keyup || function() {};
	this.isPressed = false;
	this.isSystemInput = false;
}


/******************************************************************************

Structure to hold Input objects. Index is the keycode associated with the
keyboard event being processed, resulting data is the Input object holding the
function to call for either keydown or keyup 

******************************************************************************/
var inputs = [],
	inputMap = {};


/******************************************************************************

Initialized the DOM with keydown and keyup events and processes them
accordingly.

******************************************************************************/
exports.init = function() {

	document.addEventListener('keydown', function(ev) {
		
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		tmpInput.isPressed = true;

		if (tmpInput !== 'undefined' && tmpInput.isSystemInput) {
			tmpInput.keydownCallback();
		} 

	});

	document.addEventListener('keyup', function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		var tmpInput = inputs[ev.keyCode] || 'undefined';

		tmpInput.isPressed = false;

		(tmpInput !== 'undefined') ? tmpInput.keyupCallback() : console.log('undefined keyup');
	});
}

/******************************************************************************

Handles adding a new game input. 

WARNING: This function overrides whatever the previously associated
keyCode - Callback pairing...

Params:

name    -- String name of input. ex. 'moveLeft', 'jump', 'attack', etc...
keyCode -- Integer associated with this ASCII key event
keydownCallback -- function to be called when this key is depressed
keyupCallback   -- function to be called when this key is released

******************************************************************************/
exports.addInput = function(name, keyCode, keydownCallback, keyupCallback, systemInput) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback, keyupCallback);

	inputs[keyCode] = newInput;
	inputMap[name] = keyCode;
}

/******************************************************************************

Add a system input

******************************************************************************/
exports.addSystemInput = function(name, keyCode, keydownCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};

	var newInput = new Input(name, keyCode, keydownCallback);

	newInput.isSystemInput = true;

	inputs[keyCode] = newInput;
	inputMap[name] = keyCode;
}

/******************************************************************************

Removes the given input from the input collection.

******************************************************************************/
exports.removeInput = function(name) {
	if (inputMap[name]) {
		var out = inputs[inputMap[name]] = undefined;
		inputMap[name] = undefined;

		//console.log(out);
		//console.log(inputs);
	}
}

/******************************************************************************

Returns the underlying array holding all of the inputs and associated callbacks

******************************************************************************/
exports.getInputCollection = function() {
	return inputs;
}

/******************************************************************************

Updates the inputs and inputMap array with the input functions in the new state

WARNING: this function overrides previous input functions

******************************************************************************/
exports.useState = function(newState) {

	for (var i = 0; i < newState.inputs.length; i++) {
		var tmpInput = newState.inputs[i];

		inputs[tmpInput.keyCode] = tmpInput;
		inputMap[tmpInput.name] = tmpInput.keyCode;
	}
}

/******************************************************************************

Creates and Returns a new instance of Input; mainly used in game states

******************************************************************************/
exports.createInput = function(name, keyCode, keydownCallback, keyupCallback) {
	keydownCallback = (typeof keydownCallback === 'function') ? keydownCallback : function() {};
	keyupCallback = (typeof keyupCallback === 'function') ? keyupCallback : function() {};

	return new Input(name, keyCode, keydownCallback, keyupCallback);
}