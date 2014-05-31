var inputManager = require('./input-manager'),
    imageManager = require('./image');


/******************************************************************************

Defines a game state.

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
	this.plainText = null;
	this.optionalRenderingFunction = null;
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
	if (enemy.length) {
		for (var i = 0; i < enemy.length; i++) {
			this.enemies.push(enemy[i]);
		}
	}
	else {
		this.enemies.push(enemy);
	}
}

/******************************************************************************

Add NPCs to this State; can add single npcs or an array

******************************************************************************/
State.prototype.addNPCToState = function(npc) {
	if (npc.length) {
		for (var i = 0; i < npc.length; i++) {
			this.npcs.push(npc[i]);
		}
	}
	else {
		this.npcs.push(npc);
	}
}

/******************************************************************************

Add interactables to this State; single or an array

******************************************************************************/
State.prototype.addInteractableToState = function(interactable) {
	if (interactable.length) {
		for (var i = 0; i < interactable.length; i++) {
			this.interactables.push(interactable[i]);
		}
	}
	else {
		this.interactables.push(interactable);
	}
}

/******************************************************************************

Adds an input to this state, but not to the input manager

******************************************************************************/
State.prototype.addInput = function(name, keyCode, keydownCallback, keyupCallback) {
	//inputManager.addInput(name, keyCode, keydownCallback, keyupCallback);

	this.inputs.push(inputManager.createInput(name, keyCode, keydownCallback, keyupCallback));
};

/******************************************************************************

Adds a system input to this state, but not to the input manager

******************************************************************************/
State.prototype.addSystemInput = function(name, keyCode, keydownCallback) {
	var input = inputManager.createInput(name, keyCode, keydownCallback);

	input.isSystemInput = true;

	this.inputs.push(input);
};

/******************************************************************************

Load img for the backdrop for this state

******************************************************************************/
State.prototype.setBackdrop = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.backdrop = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

/******************************************************************************

Load img for background for this state

******************************************************************************/
State.prototype.setBackground = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.background = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

/******************************************************************************

Load img for the foreground for this state

******************************************************************************/
State.prototype.setForeground = function(path, callback) {
	var state = this;

	imageManager.loadImg(path, function(img) {
		state.scenery.foreground = img;

		if (typeof callback === 'function') {
			callback();
		}
	});
};

/******************************************************************************

Set any optional rendering function. set to 'null' if anything but a function
is passed as a parameter.

******************************************************************************/
State.prototype.addOptionalRendering = function(callback) {
	this.optionalRenderingFunction = (typeof callback === 'function') ? callback : null;
};

//
// Renders this gamestate to the given renderer rend context
//
State.prototype.draw = function(rend) {

  if (rend.ctx != null) {

    //clear the canvas
    rend.ctx.clearRect(0, 0, rend.width, rend.height);

    //draw backdrop ... parallax?
    if (this.scenery.backdrop != null) {

    }

    //draw background
    if (this.scenery.background != null) {
      rend.ctx.drawImage(this.scenery.background, 0, 0);
    }

    //draw npcs
    if (this.npcs.length > 0) {

    }

    //draw interactables ... powerups?
    if (this.interactables.length > 0) {

    }

    //draw enemies
    if (this.enemies.length > 0) {

      for (var i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];

        if (e != null) {
            e.draw(rend.ctx);

            //draw aabb
            //rend.ctx.strokeRect(e.aabbs[0].minBoundX,
            //					e.aabbs[0].minBoundY,
            //					e.aabbs[0].width,
            //					e.aabbs[0].height);
        }
      }

    }

    //draw player including upgrades
    if (this.player != null) {

      //draw the base of the character
      this.player.draw(rend.ctx);

      //draw aabb
      //rend.ctx.strokeRect(this.player.aabbs[0].minBoundX,
      //					this.player.aabbs[0].minBoundY,
      //					this.player.aabbs[0].width,
      //					this.player.aabbs[0].height);
    }

    //draw foreground
    if (this.scenery.foreground != null) {
      rend.ctx.drawImage(this.scenery.foreground, 0, rend.height - 250);
    }

    //draw hud
    if (this.hud != null) {

    }

    //draw basic text to the screen
    if (this.plainText != null) {
      rend.ctx.beginPath();
      rend.ctx.font = "25pt sans-serif";
      rend.ctx.fillText(this.plainText, 0 ,rend.height / 2);
    }

    //draw any optional rendering specified by the designer
    if (this.optionalRenderingFunction != null) {
      this.optionalRenderingFunction(rend.ctx);
    }
  }
  else {
    console.log('drawing context is not set!');
  }


}


//export the State constructor
module.exports = State;
