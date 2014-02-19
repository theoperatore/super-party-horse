/******************************************************************************

Game states and determining which state the engine is in now.

******************************************************************************/

var State = function State(name) {
	this.name = name;
	this.player = null;
	this.enemies = [];
	this.npcs = [];
	this.interactables = [];
	this.scenery = {
		backdrop : null,
		background : null,
		foreground : null
	};
	this.inputs = [];
	this.hud = null;
};

/******************************************************************************

Setup the player with this state

******************************************************************************/
State.prototype.addPlayerToState = function(player) {
	this.player = player;
}

/******************************************************************************

Setup enemies to the state; can pass in either a single enemy, or an array

******************************************************************************/
State.prototype.addEnemyToState = function(enemy) {
	if (typeof enemy === 'entity') {
		this..enemies.push(enemy);
	}

	else if (enemy.length) {
		for (var i = 0; i < enemy.length; i++) {
			this..enemies.push(enemy[i]);
		}
	}
}

/******************************************************************************

Add NPCs to this State; can add single npcs or an array

******************************************************************************/
State.prototype.addNPCToState = function(npc) {
	if (typeof npc === 'entity') {
		this..npcs.push(npc);
	}

	else if (npc.length) {
		for (var i = 0; i < npc.length; i++) {
			this..npcs.push(npc[i]);
		}
	}
}

/******************************************************************************

Add interactable to this State; single or an array

******************************************************************************/
State.prototype.addInteractable = function(interactable) {
	if (typeof interactable === 'entity') {
		this.interactables.push(interactable);
	}

	else if (interactable.length) {
		for (var i = 0; i < interactable.length; i++) {
			this..interactables.push(interactable[i]);
		}
	}
}

module.exports = State;

