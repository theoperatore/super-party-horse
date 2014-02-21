---
layout: post
title: "Game States for Everyone!"
---

A game state is the condition that the game is running in at any point in time. For example, most games have a 'Title Screen'; something that tells you the name of the game you are playing as well as some options to select like 'New Game', 'Continue', 'Options', 'Extras', etc...

The 'Title Screen' is a *state* that the game is in. The main updating loop is only going to render whatever is defined in the title screen state and only going to process inputs defined in the title screen state. The state tells the core of the game which inputs to listen for and to handle those inputs accordingly.

Any time the user changes the flow of the game, the current game state is being changed. In any RPG, there are a few states that a gamer might not have thought about; a field or exploring state when walking on the world map, the battle state while battling an enemy and performing dazzling maneuvers, or a town state to explore a town or village.

A 1v1 fighting game like Tekken or Street Fighter has different game states; *character select* and *fight* to name two. Both define certain inputs from a controller or keyboard or fight stick to mean different actions and have different graphics and layouts. 

Down to Business
----------------

So how do you handle changing game states during the course of the game?

First we need to define what a game state represents (and of course we'll use code! JS to the rescue!).

{% highlight javascript linenos %}
//State constructor function
var State = function(name) {

    //name of this state for reference
    this.name = name;

    //reference to the player object
    this.player = null;

    //collections of objects that interact with the player
    this.enemies       = [];
    this.npcs          = [];
    this.interactables = [];

    //defines the art for this state
    this.scenery = {
        backdrop   : null,
        background : null,
        foreground : null
    };

    //collection of inputs to handle
    this.inputs = [];
}
{% endhighlight %}

The importance of a game state is threefold: 

1. The engine needs to know what to render (player, enemies, scenery...)
2. The engine needs to know what objects need physics updates(player, enemies, interactables...)
3. The engine needs to know what to do when a user presses an input. 

Defined in this object are all of the necessary properties that fit those criteria. 

We hold a reference to the player object, `this.player`, and other entities, `this.enemies`, `this.npcs`, `this.interactables`, to specify to the Renderer and Physics components what to draw and what to update.

We define the property object `this.scenery` to hold environment images that the Renderer will draw.

Lastly, we define a collection of inputs, `this.inputs`, to hold input callbacks.

Usage
-----

To use a state, create a new instance:

`var title = new State('title');`

Set fields as you see fit:

{% highlight javascript %}
//set the title background
title.addBackground('./src/resources/title/sph-title.png');

//add '0' input to alert
title.addInput('start', 48, function() {
    alert('Easter Egg! You read the blog! Thanks!');
});
{% endhighlight %}

That's it! Now you use your newly created state, `title`, to draw the specified images to the canvas and listen for the specified inputs!