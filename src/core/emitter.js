/******************************************************************************

Defines an emitter to which listeners can subscribe.

******************************************************************************/
var Emitter = function() {
	this._subscribers = {
		'any' : []
	};
}

Emitter.prototype.on = function(type, callback) {
	type = type || 'any';

	if (typeof this._subscribers[type] === 'undefined') {
		this._subscribers[type] = [];
	}

	this._subscribers[type].push({callback : callback});
};

Emitter.prototype.emit = function(type, data) {
	var eventType = type || 'any',
	    subscribers = this._subscribers[eventType],
	    maxBound = subscribers ? subscribers.length : 0;

	for (var i = 0; i < maxBound; i++) {

		//call within the subscribers context?
		subscribers[i].callback.call(subscribers[i],data);
	}
};

Emitter.prototype.clone = function() {
	return new Emitter();
};

module.exports = new Emitter();