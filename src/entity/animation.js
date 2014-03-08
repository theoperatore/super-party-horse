/******************************************************************************

Private inner 'class' that represents one frame in an animation

******************************************************************************/
var _Frame = function _Frame(path, ms, callback) {
	this.img = new Image();
	this.frameTime = ms;

	callback = (typeof callback === 'function') ? callback : function() {};

	this.img.addEventListener('load', callback( {
		message : path + " -- loaded",
		frame   : this
	}));

	this.img.src = path;
}

/******************************************************************************

Defines an animation as an ordered array of images to be shown based on 
certain conditions and after a certain period of time.

******************************************************************************/
var Animation = function Animation() {
	this._frames = [];
	this.numFrames = 0;
	this.currTime = 0;
	this.currIndex = 0;
	this.loop = true;
	this.completedCallback;
}

/******************************************************************************

Add a frame to this animation. This function accepts only strings paths to 
images.

******************************************************************************/
Animation.prototype.addFrame = function(path, ms, loadCallback) {
	var frame = new _Frame(path, ms, loadCallback);

	this._frames.push(frame);
	this.numFrames++;
};

/******************************************************************************

Add a callback function to be called when this animation is completed.

******************************************************************************/
Animation.prototype.addAnimationCompletedCallback = function(callback) {
	this.completedCallback = (typeof callback === 'function') ? callback : function() { console.log ('callback not a function'); };
};

/******************************************************************************

Update this animation based on a 'dt' param interval.

******************************************************************************/
Animation.prototype.update = function(dt) {
	this.currTime += dt;

	//only update if there are 2 or more frames in this animation
	if (this.numFrames > 1) {
		
		//update index if we're done with this frame
		if (this.currTime >= this._frames[this.currIndex].frameTime) {
			this.currTime %= this._frames[this.currIndex].frameTime;
			this.currIndex++;
		}

		//if the animation is done...
		if (this.currIndex >= this.numFrames) {

			//if we aren't looping...
			if (!this.loop) {

				//call the callback
				this.completedCallback();
			}

			//regardless, reset vars
			this.reset();
		}

	}
};

/******************************************************************************

Returns the current frame's image for drawing. The update functon ensures that
only a valid frame is returned; this.currIndex never results in 'undefined'

******************************************************************************/
Animation.prototype.getCurrImg = function() {
	return this._frames[this.currIndex].img;
};

/******************************************************************************

This function starts/restarts the current animation

******************************************************************************/
Animation.prototype.reset = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

//export the Animation constructor
module.exports = Animation;

