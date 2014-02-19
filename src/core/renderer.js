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
	level : '1',
	scenery : {
		background : null,
		backdrop : null,
		foreground : null
	}
};

/******************************************************************************

Must be called first to setup drawing context and dimensions of the canvas

******************************************************************************/
exports.init = function(context, width, height) {
	rend.ctx = context;
	rend.width = width;
	rend.height = height;
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

Draw all setup objects to the screen

******************************************************************************/
exports.draw = function() {

	//clear the canvas
	rend.ctx.clearRect(0, 0, rend.width, rend.height);

	//draw backdrop ... parallax?

	//draw background

	//draw npcs

	//draw interactables ... powerups?

	//draw enemies

	//draw player including upgrades

	//draw foreground

}