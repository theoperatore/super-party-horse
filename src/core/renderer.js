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

			//clear the canvas
			rend.ctx.clearRect(0, 0, rend.width, rend.height);

			//draw backdrop ... parallax?
			if (renderState.scenery.backdrop != null) {

			}

			//draw background
			if (renderState.scenery.background != null) {
				rend.ctx.drawImage(renderState.scenery.background, 0, 0);
			}

			//draw npcs
			if (renderState.npcs.length > 0) {

			}

			//draw interactables ... powerups?
			if (renderState.interactables.length > 0) {

			}

			//draw enemies
			if (renderState.enemies.length > 0) {

				for (var i = 0; i < renderState.enemies.length; i++) {
					var e = renderState.enemies[i];

					if (e != null) {
							e.draw(rend.ctx);

							//draw aabb
							rend.ctx.strokeRect(e.aabbs[0].minBoundX,
																	e.aabbs[0].minBoundY,
																	e.aabbs[0].width,
																	e.aabbs[0].height);
					}
				}

			}

			//draw player including upgrades
			if (renderState.player != null) {

				//draw the base of the character
				renderState.player.draw(rend.ctx);

				//draw aabb
				rend.ctx.strokeRect(renderState.player.aabbs[0].minBoundX,
														renderState.player.aabbs[0].minBoundY,
														renderState.player.aabbs[0].width,
														renderState.player.aabbs[0].height);
			}

			//draw foreground
			if (renderState.scenery.foreground != null) {
				rend.ctx.drawImage(renderState.scenery.foreground, 0, rend.height - 250);
			}

			//draw hud
			if (renderState.hud != null) {

			}

			//draw basic text to the screen
			if (renderState.plainText != null) {
				rend.ctx.beginPath();
				rend.ctx.font = "25pt sans-serif";
				rend.ctx.fillText(renderState.plainText, 0 ,rend.height / 2);
			}

			//draw any optional rendering specified by the designer
			if (renderState.optionalRenderingFucntion != null) {
				renderState.ooptionalRenderingFunction();
			}
		}
		else {
			console.log('Game state is not set!');
		}
	}
	else {
		console.log('drawing context is not set!');
	}

}
