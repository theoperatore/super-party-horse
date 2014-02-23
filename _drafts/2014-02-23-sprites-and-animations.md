---

layout: post
title: "Sprites and Animation"

---

My approach to animations and sprites are fairly simple. An animation is any number of individual *frames* played in a sequence, and a sprite is a collection of *animations* that have the ability to move around the screen based on movement vectors.

The ph-engine uses an *Entity* instead of a *Sprite*. They are both the exact same idea and type of object. I just happen to think Entity is a cooler word than Sprite. 

For consistency, I'll refer to Sprites as Entities, but remember that they are the same idea but different terminology.

Frames are just images
----------------------

An animation is a sequential collection of *frames*. A frame is just a picture; one single, boring image. 

![Start of Donkey basic attack]({{ site.baseurl }}/assets/donkey-attack-start-right.png)

This is one frame of the player's basic attack. By itself it doesn't mean much. 

Let's say we create another frame similar to this one but just a tiny bit different...

![Middle of Donkey basic attack]({{ site.baseurl }}/assets/donkey-attack-middle-right.png)

As you can see now, this one is just different enough from the other image such that when they are shown in sequence they show motion.

This is the basis of an Animation; switching frames in order to show motion (and that's the extent of the animations in the game engine).

Code Time
---------

How do we represent one frame in javascript? If you want the technical approach, I'm partial to the [Mozilla Developer's Network](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Using_images). Otherwise stay here and I'll tell you what you need to know.

The `canvas` can use any `<img>` html tag on the page, but hard coding all of our images into the main html page for the game isn't good at all...

Instead we'll dynamically load our images with javascript.

{% highlight javascript linenos %}
//create a new img element
var img = new Image();

//setup event listener
img.addEventListener('load', function() {
	//hoop and hollar cause' our image be loaded...
});

//start loading the image by setting the source property
img.src = './path/to/img.png'

{% endhighlight %}

This is great! Now let's apply this to our idea of a frame.

{% highlight javascript linenos %}
//object constructor that represents one Frame in an Animation
var _Frame = function(path, ms, callback) {
	
    //the img of the frame
    this.img = new Image();

    //the time this frame should be shown for in milliseconds
    this.frameTime = ms;

    //check callback parameter
    callback = (typeof callback === 'function') ? callback : function() {};

    //setup event listener
    img.addEventListener('load', callback( { message: path + " tried", frame: this } );

    //start loading the image
    img.src = path;
}
{% endhighlight %}

Fantastic! We've defined a private contstructor that represents one frame. One thing I didn't cover yet is the `frameTime` property. This property tells us how long we should show this image in the animation. 

Animations are a collection of _Frames
--------------------------------------

As stated, an Animation is a collection of frames that are sequentially drawn on the screen. This means we need to keep track of a couple of different things:

- The frames to show
- The current time since the start of this animation
- The current index of the frame collection
- The total number of frames

Our constructor looks likes this:

{% highlight javascript linenos %}
var Animation = function() {
    
    //collection of frames
    this._frames = [];

    //total number of frames
    this.numFrames = 0;

    //total running time
    this.totalTime = 0;

    //current running time
    this.currTime = 0;

    //current index into _frames
    this.currIndex = 0;

    //has this animation completed?
    this.completed = false;

    //should we loop this animation?
    this.loop = true;

    //callback function to be called upon completion
    this.completedCallback;
}
{% endhighlight %}

A fairly straightforward constructor. Nothing out of the ordinary here. We have our variables all set to handle our animation so lets define some functions that'll get us going.

{% highlight javascript linenos %}
Animation.prototype.addFrame = function(path, ms, callback) {
    
    //make a new frame
    var frame = new _Frame(path, ms, callback);

    //add frame to collection
    this._frames.push(frame);

    //add to total frames
    this.numFrames++;

    //add to total running time
    this.totalTime += ms;
};
{% endhighlight %}

This function handles adding a new frame to our animation by first creating a new `_Frame` object (that actually loads our image), and pushing the frame into our array, `_frames` all while noting the increase in frame count and running time.

The next function is where the fun resides...

{% highlight javascript linenos %}
//update the current animation index 
Animation.prototype.update = function(dt) {
    
    //update the current run time
    this.currTime += dt;

    //if the currentTime is >= the current frame's run time...
    if (this.currTime >= this._frames[this.currIndex].frameTime) {

        //keep track of the overflow...
        this.currTime %= this._frames[this.currIndex].frameTime;

        //...and increase index to next frame
        this.currIndex++;
    }

    //if the animation is complete
    if (this.currIndex >= this.numFrames) {

        //hanlde looping
        if (this.loop) {

            //reset the index
            this.currIndex = 0;
        }

        //not looping
        else {

            //mark completed
            this.completed = true;

            //reset index
            this.currIndex = 0;

            //reset current run time
            this.currTime = 0;

            //call callback
            this.completedCallback();

        }
    }
};
{% endhighlight %}