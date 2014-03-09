/******************************************************************************

  Core Vars

******************************************************************************/
var canvas = document.getElementById('playground'),
  ctx = canvas.getContext("2d"),
  now = +new Date,
  prev = +new Date,
  dt = 0,
  currState,

/******************************************************************************

  Constructors

******************************************************************************/
Entity = require("./entity/entity"),
GameState = require("./core/state"),

/******************************************************************************

  Managers

******************************************************************************/
Input = require('./core/input-manager'),
Renderer = require("./core/renderer");

/******************************************************************************

  Main Instance Vars

******************************************************************************/


/******************************************************************************

  Constants

******************************************************************************/

/******************************************************************************

  Core Functions

******************************************************************************/
function init() {

  //initialize input manager
  Input.init();

  //load player

  //set up 'loading' game state

  //set up 'gameover' game state

  //load enemies for state game?

  //set up game states

  //initialize renderer
  Renderer.init(ctx, canvas.width, canvas.height, title);

}

function update() {

  now = +new Date;
  dt = now - prev;
  prev = now;

  //check for player input and update player pos

  //update enemies

  //draw the game

  //set up next update loop
  requestAnimationFrame(update);
}

//initialize game
init();

//start main game!
requestAnimationFrame(update);
