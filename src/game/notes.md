# How to use

Every file inside this overwrites a part of the main game engine:

- player definitions
- enemy definitions
- npc definitions
- asset loading
- other


Should have to override by requiring?

```javascript
//core module
var partyHorse = require('./src/super-party-horse');

partyHorse.init = function() {
		//setup instance vars - developer defined/needs to implement draw/update/pollInput methods
		partyHorse.player  = require('./game/player');
		partyHorse.enemies = require('./game/enemy')('path/to/first/img.png', 50);
		partyHorse.npc     = require('./game/npc')('path/to/first/img.png',10);

		//system input setup
		partyHorse.inputManager.addSystemInput('select',13, function(){}, function(){});

		//setup game states
		partyHorse.createNewState('main');
		partyHorse.states['main'].addInput(/*input stuff*/);
		partyHorse.states['main'].setBackground('path/to/image');

		//setup main menu
		partyHorse.createNewMenu('start');
		partyHorse.menus['start'].addControl('startNewGame', 'New Game', function() {
			partyHorse.useState('main');
		});
		partyHorse.menus['start'].addControl('loadGame', 'Load Game', function(){});
		partyHorse.menus['start'].addControl('quit', 'Quit', function(){});

		//start game loop by calling partyHorse.update()/partyHorse.draw();
		partyHorse.start('start' /* current game state? */);

}

//possible custom game loop
partyHorse.update = function(dt) {

	partyHorse.anim = requestAnimationFrame(partyHorse.update);
	partyHorse.draw();
}

//possible custom render loop
partyHorse.draw = function() {
	partyHorse.player.draw(partyHorse.ctx);
}

//possibly custom start function
partyHorse.start = function(startingGameState) {

	partyHorse.currState = startingGameState || 'start';
	partyHorse.anim = requestAnimationFrame(partyHorse.update);
}
```
