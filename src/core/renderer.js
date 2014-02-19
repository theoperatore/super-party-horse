/******************************************************************************

Functions to render everything to the screen.

******************************************************************************/
var rend = {
	ctx : null,
	height : 0,
	width : 0,
	player : null,
	enemies : [],
	npcs : [],
	interactables : [],
	level : '1',
	scenery : {
		background : null,
		backdrop : null,
		foreground : null
	},
	state : null,
};

/******************************************************************************

Must be called first to setup drawing context and dimensions of the canvas

******************************************************************************/
exports.init = function(context, width, height) {
	rend.ctx = context;
	rend.width = width;
	rend.height = height;
	rend.state = new State('title');
}

/******************************************************************************

Setup the player with the renderer

******************************************************************************/
exports.addPlayerToRenderer = function(player) {
	rend.player = player;
}

/******************************************************************************

Setup enemies to be drawn; can pass in either a single enemy, or an array

******************************************************************************/
exports.addEnemyToRenderer = function(enemy) {
	if (typeof enemy === 'entity') {
		rend.enemies.push(enemy);
	}

	else if (enemy.length) {
		for (var i = 0; i < enemy.length; i++) {
			rend.enemies.push(enemy[i]);
		}
	}
}

/******************************************************************************

Add NPCs to the renderer; can add single npcs or an array

******************************************************************************/
exports.addNPCToRenderer = function(npc) {
	if (typeof npc === 'entity') {
		rend.npcs.push(npc);
	}

	else if (npc.length) {
		for (var i = 0; i < npc.length; i++) {
			rend.npcs.push(npc[i]);
		}
	}
}

/******************************************************************************

Add interactable to renderer; single or an array

******************************************************************************/
exports.addInteractable = function(interactable) {
	if (typeof interactable === 'entity') {
		rend.interactables.push(interactable);
	}

	else if (interactable.length) {
		for (var i = 0; i < interactable.length; i++) {
			rend.interactables.push(interactable[i]);
		}
	}
}

/******************************************************************************

Draw all setup objects to the screen

******************************************************************************/
exports.draw = function(state) {

	//must be told which state to render

	if (rend.ctx != null) {

		//clear the canvas
		rend.ctx.clearRect(0, 0, rend.width, rend.height);

		//draw backdrop ... parallax?
		if (rend.scenery.backdrop != null) {

		}

		//draw background
		if (rend.scenery.background != null) {

		}

		//draw npcs
		if (rend.npcs.length > 0) {

		}

		//draw interactables ... powerups?
		if (rend.interactables.length > 0) {

		}

		//draw enemies
		if (rend.enemies.length > 0) {

		}

		//draw player including upgrades
		if (rend.player != null) {

		}

		//draw foreground
		if (rend.scenery.foreground != null) {

		}

		//draw hud
		if (rend.hud != null) {

		}
	}
	else {
		console.log('drawing ontext is not set!');
	}

}