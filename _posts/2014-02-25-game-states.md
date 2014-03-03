---
layout: post
title: "Game States"
comments: true
---

A game state is the condition that the game is running in at any point in time.

For example, *Super Party Horse* uses the states: `title`, `main`, and `gameover` (among others).

State `title` defines what the user sees and can interact with when the game first loads; the title screen.

State `main` defines the actions of a user input, the environment graphics, the Cows and Jaguars and Player during the main game.

State `gameover` defines the end of the game when the user looses all of their Cows.

By utilizing different states, the game can slide in and out of very different modes of interaction between the user and the game itself.

Defining a State
----------------

First we need to define what a game state represents (in code).

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

    //collections of Entities that interact with the player
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

Defined in this `State` object are all of the necessary properties that fit the above criteria.

We hold a reference to the player object, `this.player`, and other entities, `this.enemies`, `this.npcs`, `this.interactables`, that the Renderer and main update functions will call to draw and update respectively.

We define the property object, `this.scenery`, to hold environment images that the Renderer will draw.

Lastly, we define a collection of inputs, `this.inputs`, to hold input callbacks.

As you can see, a state is just a way of grouping Entities and handling input.

Once we have a mechanism to add new inputs and set the scenery of any state, we can switch between them fairly easily.

Switching between States
------------------------

There are two steps involved with switching between states:

1. Set the new state in the Renderer
2. Set up the new state's inputs in the InputManager

The engine renderer uses the current state to draw everything; in particular what we have defined above.

Every frame, the renderer will draw the `backdrop`, `background`, `npcs`, `enemies`, `interactables`, `player`, and `foreground`.

Because the renderer is set up to use this internal state, all we need to do is make sure the internal state is the same as the current state we want the game to render. To facilitate the transition, just use the `Renderer.useState()` function:

{% highlight javascript %}
//define new states
var game = new State('game'),
    title = new State('title');

//set up new states
game.setBackground('./path/to/background.png');
game.setBackdrop('./path/to/backdrop.png');
game.setForeground('./path/to/foreground.png');
...
title.setBackground('./title-logo.png');
...

//import renderer
var Renderer = require('./path/to/renderer');

//init renderer
...

//make renderer use 'title' state
Renderer.useState(title);
// => draws everything in 'title' next update

...
...

//later...
Renderer.useState(game);
// => draws everything in 'game' next update
{% endhighlight %}

Switching of states in the renderer is easy.

Switching input is a little tricker, but can also be implemented with one function.

*Pseudocode time*

{% highlight javascript linenos %}
//resides in input.js or InputManager
exports.useState = function(newState) {

    //temporary input variable
    var tmpInput;

    //check newState
    if (newState exists) {

        //loop through defined inputs in the new state
        from 0 to length of newState inputs {

            //cache the current input
            tmpInput = newState.inputs[i];

            //check for system input
            if (tmpInput.isSystemInput) {

                //set up as system input
                add system input
            }
            else {

                //add new regular input
                add input
            }
        } //end newState input loop
    } //end validity check
} //end useState function
{% endhighlight %}

The reason switching inputs is a little trickier is because of how we keep track of the inputs. Game states don't keep track of inputs the same way the InputManager does.

The InputManager (input handling post to follow) direcly maps keyCodes as an index into the array holding available inputs.

A state keeps the inputs to implement in an array as well, but doesn't use the input's keyCode as an index; the inputs are simply *pushed* into the underlying array in sequence.

We do this for two reasons: we can easily loop through all of the `newState` inputs with a basic for-loop and add them to the InputManager, and the `newState` inputs array is smaller than the InputManager input collection:

{% highlight javascript %}
//basic empty array
var a = [], b = [];

//add element at index 65
a[65] = 2;
// a.length == 66 (InputManager inputs array)

//add element to b
b.push(2);
// b.length == 1 (State inputs array)
{% endhighlight %}

Because the size of the inputs array in the InputManager will be the size of the largest keyCode, looping through that large of a collection will take a long time compared to a smaller array.

Not to fear though, `state` inputs hold a `keyCode` property that allows for easy indexing into the InputManager inputs array.

Using the above function is the same as using the function for switching states in the Renderer:

{% highlight javascript %}
//require InputManager and make states
var InputManager = require('./path/to/input-manager'),
    title = new State('title'),
    game = new State('game');

//add input to 'title'
title.addSystemInput('start', 13, function() {
  console.log('You pushed spacebar!');
});

//add inputs to 'game'
game.addInput('left', 65,

//keydownCallback
function() {
    //move player left
},

//keyupCallback
function() {
    //stop player
});

game.addInput('left', 68,

//keydownCallback
function() {
    //move player right
},

//keyupCallback
function() {
    //stop player
});

//start using state title
InputManager.useState(title);

...
...

//switch to state game
InputManager.useState(game);

...
{% endhighlight %}

<br>

Conclusion
----------

Different *states* of a game only serve to provide a mechanism for scenery and inputs to be grouped together and easily changed.

Using different states make it easy to build a title screen with associated inputs (press 'enter' to play) that, upon detecting the correct input, switches to another state that will render the game and set up player movement inputs.

Next up should be an article showing how the InputManager works. I have a feeling that reading that article might clear up any doubts about how input is *specifically* handled.

That's all. Let me know what you think about anything (even about writing style too)!

**Comment Storm!**
