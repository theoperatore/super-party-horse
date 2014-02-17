/******************************************************************************

Handles setting up game inputs and eventListeners for any game input.

******************************************************************************/
var Input = function Input(name, keyCode, callback) {
	this.name = name;
	this.keyCode = keyCode;
	this.callback = callback || 'undefined';
}
var inputs = {};

exports.init = function() {

	document.addEventListener('keydown', function(ev) {
		//left
		if (ev.keyCode === 65 ) {
			ev.preventDefault();
			ev.stopPropagation();
			console.log("left");
		}
		//down
		else if (ev.keyCode === 83) {
			ev.preventDefault();
			ev.stopPropagation();
			console.log("down");
		}
		//right
		else if (ev.keyCode === 68) {
			ev.preventDefault();
			ev.stopPropagation();
			console.log("right");
		}
		//up
		else if (ev.keyCode === 87) {
			ev.preventDefault();
			ev.stopPropagation();
			console.log("up");
		}

	});
}

exports.addInput = function(name, keyCode, callback) {

}