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
	rend.state = state || new State('title');
}

/******************************************************************************

Changes the current game state to the provided state; if the provided state is
not of the type 'state',  the game stat will not be changed

******************************************************************************/
exports.changeState = function(newState) {
	newState = (typeof newState === 'state') ? newState || rend.state;
	rend.state = newState;
}

/******************************************************************************

Draw all setup objects to the screen

******************************************************************************/
exports.draw = function() {

	if (rend.ctx != null) {

		if (rend.state != null) {

			//clear the canvas
			rend.ctx.clearRect(0, 0, rend.width, rend.height);

			//draw backdrop ... parallax?
			if (rend.state.scenery.backdrop != null) {

			}

			//draw background
			if (rend.state.scenery.background != null) {

			}

			//draw npcs
			if (rend.state.npcs.length > 0) {

			}

			//draw interactables ... powerups?
			if (rend.state.interactables.length > 0) {

			}

			//draw enemies
			if (rend.state.enemies.length > 0) {

			}

			//draw player including upgrades
			if (rend.state.player != null) {

			}

			//draw foreground
			if (rend.state.scenery.foreground != null) {

			}

			//draw hud
			if (rend.state.hud != null) {

			}
		}
		else {
			console.log('Game state is not set!');
		}
	}
	else {
		console.log('drawing ontext is not set!');
	}

}