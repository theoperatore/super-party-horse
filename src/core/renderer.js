/******************************************************************************

Functions to render everything to the screen.

******************************************************************************/
var rend = {
	ctx : null,
	height : 0,
	width : 0,
	state : null
};

/******************************************************************************

Must be called first to setup drawing context, canvas dimensions and game state

******************************************************************************/
exports.init = function(context, width, height, state) {
	rend.ctx = context;
	rend.width = width;
	rend.height = height;
	rend.state = state || null;
}

/******************************************************************************

Handles switching from gamestate to gamestate, but only for rendering purposes.
Changing inputs for new gamestates is handled elsewhere.

This function always assumes that the current underlying gamestate is the
most recent, so the player will always be passed from the current gamestate
to the new gamestate

DUNNO IF THIS IS ACTUALLY WORTH DOING...

******************************************************************************/
exports.useState = function(newState) {
	if (typeof newState != 'undefined') {
		rend.state = newState;
		rend.state.player = newState.player;
	}
}


/******************************************************************************

Draw all set up objects to the screen

******************************************************************************/
exports.draw = function(gameState) {

	//a passed in gameState trumps the stored gamestat
	renderState = gameState || rend.state;

	if (rend.ctx != null) {

		if (renderState != null) {

			//draw the current state
			renderState.draw(rend);

		}
		else {
			console.log('Game state is not set!');
		}
	}
	else {
		console.log('drawing context is not set!');
	}

}
