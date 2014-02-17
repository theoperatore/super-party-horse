/******************************************************************************

Private inner class that represents one frame in a sprite animation

******************************************************************************/
var _Frame = function _Frame(path, ms, callback) {
	this.img = new Image();
	this.frameTime = ms;

	if (typeof callback === "function") {
		this.img.addEventListener('load', callback( {
			message : path + " -- loaded",
			frame   : this
		}));
	}

	this.img.src = path;
}

/******************************************************************************

Defines an animation as an ordered array of images to be shown based on 
certain conditions and after a certain period of time.

******************************************************************************/
var Animation = function Animation() {
	this._frames = [];
	this.numFrames = 0;
	this.totalTime = 0;
	this.currTime = 0;
	this.currIndex = 0;
}

Animation.prototype.addFrame = function(path, ms, callback) {
	var frame = new _Frame(path, ms, callback);

	this._frames.push(frame);
	this.numFrames++;
	this.totalTime += ms;
};

Animation.prototype.update = function(dt) {
	this.currTime += dt;

	if (this.numFrames > 1) {
		if (this.currTime >= this.totalTime) {
			this.currTime = this.currTime % this.totalTime;
			this.currIndex = 0;
		}

		if (this.currTime >= this._frames[this.currIndex].frameTime) {
			this.currTime %= this._frames[this.currIndex].frameTime;
			this.currIndex++;
		}
	}
};

Animation.prototype.getCurrImg = function() {
	this.currIndex = (this.currIndex >= this.numFrames) ? 0 : this.currIndex;
	return this._frames[this.currIndex].img;
};

Animation.prototype.start = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

module.exports = Animation;

