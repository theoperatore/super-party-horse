---
layout: post
title: Game States for Everyone!
permalink: /game-states-for-everyone.html
---

A game state is the condition that the game is running in at any point in time. For example, most games have a 'Title Screen'; something that tells you the name of the game you are playing as well as some options to select like 'New Game', 'Continue', 'Options', 'Extras', etc...

The 'Title Screen' is a *state* that the game is in. The main updating loop is only going to render whatever is defined in the title screen state and only going to process inputs defined in the title screen state. The state tells the core of the game which inputs to listen for and to handle those inputs accordingly.

Any time the user changes the flow of the game, the current game state is being changed. In any RPG, there are a few states that a gamer might not have thought about; a field or exploring state when walking on the world map, the battle state while battling an enemy and performing dazzling maneuvers, or a town state to explore a town or village.

A 1v1 fighting game like Tekken or Street Fighter has different game states; *character select* and *fight* to name two. Both define certain inputs from a controller or keyboard or fight stick to mean different actions and have different graphics and layouts. 

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
Ok a little further explaining. For *Super Party Horse*, a state is defined as holding a reference to the player, the collection of other Entities in the game, basic images for scenery and depth, and what to do when an input is pressed.