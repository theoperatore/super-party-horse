var Player = require('../entity/player'),
    AABB = require('../core/boundingbox');

/******************************************************************************

Manages the importing / creation of Entities from JSON files

******************************************************************************/
exports.loadResourceFile = function(path) {



}

/******************************************************************************

Exports the given object as a resource file

******************************************************************************/
exports.exportObject = function(obj) {



}

/******************************************************************************

Loads and returns a player object based on the included definitions

******************************************************************************/
exports.loadPlayerDefinition = function() {

  var player = new Player();

  //set up player
  player.pos.y = 100;
  player.pos.x = 100;

  player.addFrame('right', "./src/resources/donkey-idle-right.png", 1000, function(ev) {
    console.log(ev);
  });
  player.addFrame('left', "./src/resources/donkey-idle-left.png", 1000, function(ev) {
    console.log(ev);
  });

  player.addFrame('attack-right', "./src/resources/attack/donkey-attack-start-right.png", 250, function(ev) {
    console.log(ev);
  });
  player.addFrame('attack-right', "./src/resources/attack/donkey-attack-middle-right.png", 250, function(ev) {
    console.log(ev);
  });
  player.addFrame('attack-right', "./src/resources/attack/donkey-attack-end-right.png", 400, function(ev) {
    console.log(ev);
  });

  player.addFrame('attack-left', "./src/resources/attack/donkey-attack-start-left.png", 250, function(ev) {
    console.log(ev);
  });
  player.addFrame('attack-left', "./src/resources/attack/donkey-attack-middle-left.png", 250, function(ev) {
    console.log(ev);
  });
  player.addFrame('attack-left', "./src/resources/attack/donkey-attack-end-left.png", 400, function(ev) {
    console.log(ev);
  });

  player.addAnimationCompletedCallback('attack-right', function() {
    console.log('attack-right completed');
    //player.dirLock = false;
    player.direction = 'right';
  });

  player.addAnimationCompletedCallback('attack-left', function() {
    console.log('attack-left completed');
    //player.dirLock = false;
    //player.direction = 'left';
    player.direction = 'right';
  });

  player.setAnimationLoop('attack-left', false);
  player.setAnimationLoop('attack-right', false);

  player.direction = "right";

  player.addAABB(
    0,   //x coord of bounding box in object space
    0,   //y coord of bounding box in object space
    100, //width of bounding box
    100  //height of bounding box
  );

  return player;

}

/******************************************************************************

Loads and returns a single basic enemy entity

******************************************************************************/
exports.loadEnemyDefinition = function() {


}
