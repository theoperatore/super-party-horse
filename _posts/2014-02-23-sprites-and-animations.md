---

layout: post
title: "Sprites and Animation"
comments: true

---

My approach to animations and sprites is fairly simple. An animation is any number of individual *frames* played in a sequence, and a sprite is a collection of *animations* to be used at different times.

The ph-engine uses an *Entity* instead of a *Sprite*. They are both the exact same idea and type of object. I just happen to think Entity is a cooler word than Sprite.

For consistency, I'll refer to Sprites as Entities, but remember that they are the same idea but different terminology.

Frames are just images
----------------------

An animation is a sequential collection of *frames*. A frame is just a picture; one single, boring image.

![Start of Donkey basic attack]({{ site.baseurl }}/assets/donkey-attack-start-right.png)

This is one frame of the player's basic attack. By itself it doesn't mean much.

Let's say we create another frame similar to this one but just a tiny bit different...

![Middle of Donkey basic attack]({{ site.baseurl }}/assets/donkey-attack-middle-right.png)

This frame is just different enough from the other frame, such that when they are shown in sequence they show motion.

This is the basis of an Animation; switching between frames in order to show motion (and that's the extent of the animations in the game engine).

Code Time
---------

How do we represent one frame in JavaScript?

First we have to learn how to create an image element from scratch. If you want the technical approach, I'm partial to the [Mozilla Developer's Network](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Using_images). Otherwise stay here and I'll tell you what you need to know.

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

This image loading pattern describes how to load any image on the fly.

Now let's apply this to our idea of a frame.

A single frame has a couple of different properties:

- The image to show
- The amount of time to show the image
- A function to call when the image is loaded (optional)

Let's setup a nice constructor to handle these properties:

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
    img.addEventListener('load', callback());

    //start loading the image
    img.src = path;
}
{% endhighlight %}

Fantastic! We've defined a private contstructor that represents one frame. We are loading the image from the given `path`, remembering this frame's duration in `frameTime`, and setting up a `callback` function if one is specified.

In a little more detail, the `frameTime` property tells us how long we should show this image before moving to the next frame.

Now that we know how to make one frame, let's think about how to handle multiple frames.

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

    //current running time
    this.currTime = 0;

    //current index into _frames
    this.currIndex = 0;

    //should we loop this animation?
    this.loop = true;

    //callback function to be called upon completion
    this.completedCallback;
}
{% endhighlight %}

A fairly straightforward constructor. Nothing out of the ordinary here. We have our variables all set to handle our animation so lets define some functions that'll get us going.

{% highlight javascript linenos %}
//add frame function
Animation.prototype.addFrame = function(path, ms, callback) {

    //make a new frame as defined in our _Frame constructor above
    var frame = new _Frame(path, ms, callback);

    //add frame to collection
    this._frames.push(frame);

    //add to total frames
    this.numFrames++;

};
{% endhighlight %}

This function handles adding a new frame to our animation by first creating a new `_Frame` object (that actually loads our image), and pushing the frame into our array, `_frames`, all while noting the increase in frame count.

The next function is where the fun resides...

{% highlight javascript linenos %}
//update the current animation index
Animation.prototype.update = function(dt) {

    if (this.numFrames > 1) {

        //update the current run time
        this.currTime += dt;

        //update index if we're done with this frame
        if (this.currTime >= this._frames[this.currIndex].frameTime) {

            //grab the overflow
            this.currTime %= this._frames[this.currIndex].frameTime;

            //increase index
            this.currIndex++;
        }

        //check if the animation is done
        if (this.currIndex >= this.numFrames) {

            //handle not looping
            if (!this.loop) {

                //call the callback
                this.completedCallback();
            }

            //regardless, reset vars
            this.currTime = 0;
            this.currIndex = 0;

        }//end complete check
    } //end frame check
}; //end update
{% endhighlight %}

Since we only care about animations with more than one frame (otherwise it wouldn't be an animation...), we only allow updates on animations with more than 1 frame.

The update function accepts the change in time parameter our game loop provides, `dt`, and adds it to the current running total of animation time, `currTime`.

Next we check to see if the current frame's time limit is reached on line 10. If time is up, then reset `currTime` with the overflow and increase `currIndex` by one.

On line 20 we check to see if the animation is completed by comparing the current frame index to the total number of frames. If the animation is done, reset `currTime` and `currIndex` regardless of looping. If we aren't looping then call the callback function for this animation.

There are a couple of functions that handle setting the completed callback function and returning the current frame's img, but we won't cover them here. Just know that setting the callback function requirs checking that callback is of type 'function', and returning the current frame's img uses `currIndex`.

Enter the Entity
----------------

Entities have a bunch of properties that relate to other parts of a game or to the game engine, but the ones we are focusing on today have to deal with handling our animations we just defined.

This time I'm going to use psuedo code to illustrate creating an Entity because there is a lot going on under the hood that would make this post super long (flirting with disaster already...).

{% highlight javascript linenos %}
//new Entity object constructor
Entity = {

    //set up other properties
    ...

    //animations
    animations = {
        name : Animation
    }

    //direction
    direction = string

    //set up other vars
    ...
}
{% endhighlight %}

Here we have an `animations` object that will hold the name of our animation and the associated Animation object. We also define a `direction` property to be used to specify which animation to use by indexing into the `animations` object.

*Still pseudocode*

{% highlight javascript linenos %}
//handle adding a frame
addFrame (anim, path, ms, loadCallback) {

    //check to see if anim is already an animation,
    //create a new animation if it is not
    tmpAnim = animations[anim] || new Animation

    //add a frame to the animation
    tmpAnim.addFrame(path, ms, loadCallback)

    //add updated or new animation to collection
    animations[anim] = tmpAnim
}
{% endhighlight %}

A cool feature of this algorithm is that if you try to add a frame to an animation name that doesn't exist, that animation is created automatically. This saves us a step.

Everything else is pretty basic here; we use the `addFrame` function of object Animation that we defined above to load a new frame and add it to the animation.

All that is left is to handle updating those animations.

{% highlight javascript linenos %}
//Entity update function
Entity update {

    // other updating logic
    ...

    //update movement vectors
    ...

    //update animations
    animations[direction].update
}
{% endhighlight %}

In the Entity updating function we do a couple of things. First we update the position based on our motion vectors (to be covered in a separate post) and next, based on the current direction, call the update function of the associated animation.

All this means is that `direction` is the name of our animation and needs to be specified elsewhere, such as when the player hits a key on the keyboard. For example, we can set up a new Entity, give it some animations, and specify which animation to update:

{% highlight javascript linenos %}
//in an initializing function
var player = new Entity();

player.addFrame('left', './path/to/left1.png', 250);
player.addFrame('left', './path/to/left2.png', 250);
player.addFrame('left', './path/to/left3.png', 250);

player.direction = 'right';

//in another function...
...
if (input left is pressed) {

    player.direction = 'left';
}

{% endhighlight %}

Here we create a new Entity object named `player`, add some frames to its `left` animation and set its initial direction to `right`. Later in our game, in this case after the left input has been pressed, we set the direction of the entity to `left`. When our game loop updates this entity, the `left` animation will also be updated.

Conclusion
----------

Entities are just collections of animations, and an animation is just a collection of individual frames. I'm not going for anything super crazy in the animation department for this game because the choppy/rigid nature of the animations lead to a sillier experience for the user which hopefully leads to more fun (just the concept of Party Horse is silly...).

Of course, to achieve finer animations just add more frames. With the implementation now, adding more frames is easy and stable. A *batch animation loader* that accepts and loads multiple frames at once would probably be in order too.

That's all on Entities an Animations for now. In the future I'll add to the idea of an Entity by talking about how to update an Entity's position over time.

**Comment Storm!**
