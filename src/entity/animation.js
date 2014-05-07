/******************************************************************************

Private inner 'class' that represents one frame in an animation

******************************************************************************/
var _Frame = function _Frame(path, ms, completeCallback) {
	this.img = new Image();
	this.frameTime = ms;

	//loadCallback = (typeof loadCallback === 'function') ? loadCallback : function() {};

	/*this.img.addEventListener('load', loadCallback( {
		message : path + " -- loaded",
		frame   : this
	}));
	*/

	this.img.addEventListener('load', function(ev) {
		console.log('loaded:', path, ' -- frame: ', this);
	});

	this.img.src = path;

	this.completedCallback = (typeof completeCallback === 'function') ? completeCallback : null;
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
Animation.prototype.addFrame = function(path, ms, completedCallback, loadCallback) {
	var frame = new _Frame(path, ms, completedCallback, loadCallback);

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

	//only update if this frame is defined
	if (this._frames[this.currIndex]) {

		//update index if we're done with this frame
		if (this.currTime >= this._frames[this.currIndex].frameTime) {
			this.currTime %= this._frames[this.currIndex].frameTime;

			//this frame is over, if this frame has a callback, call it.
			if (this._frames[this.currIndex].completedCallback != null) {
				//console.log('calling frame completed callback');
				this._frames[this.currIndex].completedCallback();
			}

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
