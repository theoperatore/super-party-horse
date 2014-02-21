---
layout: post
title: "Game States"
comments: true
---

A game state is the condition that the game is running in at any point in time. 

For example, *Super Party Horse* uses the states: `title`, `main`, and `end` (among others).

State `title` defines what the user sees and can interact with when the game first loads; the title screen.

State `main` defines the actions of a user input, the environment graphics, the Cows and Jaguars and Player during the main game.

State `end` defines the end of the game when the user looses all of their Cows.

By utilizing different states, the game can slide in and out of very different modes of interaction between the user and the game itself.

Still unclear? Keep reading.

Defining a State
----------------

First we need to define what a game state represents (and of course we'll use code).

The importance of a game state is threefold: 

1. The engine needs to know what to render (player, enemies, scenery...)
2. The engine needs to know what objects need physics updates(player, enemies, interactables...)
3. The engine needs to know what to do when a user presses an input. 

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

Defined in this `State` object are all of the necessary properties that fit those criteria. 

We hold a reference to the player object, `this.player`, and other entities, `this.enemies`, `this.npcs`, `this.interactables`, to specify to the Renderer and physics components what to draw and what to update.

We define the property object, `this.scenery`, to hold environment images that the Renderer will draw.

Lastly, we define a collection of inputs, `this.inputs`, to hold input callbacks.

As you can see, a state is just a way of grouping images and handling input.

By changing the current state of the game, the Renderer, PhysicsEngine, and InputManager will respond accordingly.
