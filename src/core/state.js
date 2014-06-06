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
  this.alert = {
    text : null,
    font : "bold 64px Helvetica Neue, sans-serif",
    alpha : 1,
    style : "rgba(51, 51, 51, 1)",
    rendTime : 1000,
    top : 100
  };
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
// Set alert text and options
//
State.prototype.setAlert = function(text, options) {
  this.alert.text = text;
  this.alert.font = (options && options.font) ? options.font : "bold 128px Helvetica Neue, sans-serif";
  this.alert.alpha = (options && options.alpha) ? options.alpha : 1;
  this.alert.style = (options && options.style) ? options.style : "#333";
  this.alert.rendTime = (options && options.rendTime) ? options.rendTime : 1000;
  this.alert.top = (options && options.top) ? options.top : 100;
}

//
// Update this state's assets: scenery, npcs, interactables, enemies, player
// hud, alert
//
State.prototype.update = function(dt) {

  //if the player is set
  if (this.player) {

    //poll input
    this.player.pollInput(inputManager.getInputCollection());
    this.player.update(dt);
  }

  //if there are enemies to update
  if (this.enemies.length > 0) {

    //loop through them
    for(var i = 0; i < this.enemies.length; i++) {

      if (this.enemies[i]) {

        //updates pos and AI
        this.enemies[i].update(dt);

        //if the player collides with enemy
        //only check if the enemy is near the player?
        if (this.player.aabbs[0].collidesWith(this.enemies[i].aabbs[0])) {

          //player hurt!

        }

        //if player attacks collide with enemy
        for (var a = 0; a < this.player.currAttacks.length; a++) {

            if (this.player.currAttacks[a].aabbs[0].collidesWith(this.enemies[i].aabbs[0])) {

              //remove enemy from array
              this.enemies.splice(i,1);
              //currState.enemies[i].stop();

              break;

            }

        }//end for player attacks

      }//end if enemy exists
    }//end for loop through enemies
  }//end update enemies

  //update npcs
  if (this.npcs.length > 0) {

  }

  //update interactables
  if (this.interactables.length > 0) {

  }

  //update alert text
  if (this.alert.text) {
    
  }
}

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
      rend.ctx.font = "lighter 25pt Helvetica Neue,sans-serif";
      rend.ctx.fillText(this.plainText, 0 ,rend.height / 2);
    }

    //draw a text alert to the screen
    if (this.alert.text != null) {

      rend.ctx.beginPath();
      rend.ctx.font = this.alert.font;
      rend.ctx.fillStyle = this.alert.style;

      var x = ((rend.width / 2) - rend.ctx.measureText(this.alert.text).width / 2);
      //console.log('drawing text', this.alert.text,'at pos: ', x);

      rend.ctx.fillText(this.alert.text, x, this.alert.top);
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
