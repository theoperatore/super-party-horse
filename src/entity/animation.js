/******************************************************************************

Private inner 'class' that represents one frame in an animation

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

/******************************************************************************

Add a frame to this animation. This function accepts only strings paths to 
images.

******************************************************************************/
Animation.prototype.addFrame = function(path, ms, callback) {
	var frame = new _Frame(path, ms, callback);

	this._frames.push(frame);
	this.numFrames++;
	this.totalTime += ms;
};

/******************************************************************************

Update this animation based on a 'dt' param interval.

******************************************************************************/
Animation.prototype.update = function(dt) {
	this.currTime += dt;

	//only update if there are 2 or more frames in this animation
	if (this.numFrames > 1) {

		//if the currentTime is greater than the current frame's running time...
		if (this.currTime >= this._frames[this.currIndex].frameTime) {

			//keep the overflow time...
			this.currTime %= this._frames[this.currIndex].frameTime;

			//and increase index to the next frame
			this.currIndex++;
		}
	}
};

/******************************************************************************

Returns the current frame's image for drawing. This function also handles
resetting the animation index if the animation is over; looping the animation

******************************************************************************/
Animation.prototype.getCurrImg = function() {
	this.currIndex = (this.currIndex >= this.numFrames) ? 0 : this.currIndex;
	return this._frames[this.currIndex].img || null;
};

/******************************************************************************

Synonymous with 'RESET', this function starts/restarts the current animation

******************************************************************************/
Animation.prototype.start = function() {
	this.currTime = 0;
	this.currIndex = 0;
};

//export the Animation constructor
module.exports = Animation;

