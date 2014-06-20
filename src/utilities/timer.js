//
// A timer that counts a number of ticks, and after a designated amount calls a
// function and removes the timer from the updating list.
// Primarily used to count core updates.
//
// Pitfalls of a core update counter is that it depends on the speed of the
// update function for the game loop. This timer assumes that the time between
// update calls is the same, which isn't necessarily the case.
//
var _timers = [];

//
// Sets up a function to be called after the allotted time has passed.
//
exports.after = function(time, t_callback) {

	//add a new timer
	_timers.push(
		{
			//converts seconds to ticks: 60 frames = 1 second
			endTime  : time * 60,
			currTime : 0,
			callback : t_callback
		}
	);

}

//
// Update all timers and if the timer has finished, remove from list and call
// callback function
//
exports.update = function(tick) {

	tick  = tick || 1;

	for (var i = 0; i < _timers.length; i++) {

		_timers[i].currTime += tick;

		if (_timers[i].currTime >= _timers[i].endTime) {

			var timer = _timers.splice(i,1);
			timer[0].callback();

		}

	}
}

//
// Removes all active timers
//
exports.clear = function() {
	_timers.length = 0;
}

//
// Returns number of timers currently running
//
exports.length = function() {
	return _timers.length;
}
