var Player = require('../entity/player'),
    AABB = require('../core/boundingbox'),
    Entity = require('../entity/entity'),
    Attack = require('../entity/attack');

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

  var player = new Player(),
      basicAttack = new Attack();

  //set up player
  player.pos.y = 100;
  player.pos.x = 100;

  player.addFrame('right', "./src/resources/donkey-idle-right.png", 1000);
  player.addFrame('left', "./src/resources/donkey-idle-left.png", 1000);

  player.addFrame('attack-right', "./src/resources/attack/donkey-attack-end-right.png", 400);
  player.addFrame('attack-left', "./src/resources/attack/donkey-attack-end-left.png", 400);

  //walk animations
  player.addFrame('walk-right', "./src/resources/donkey-walk-1.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-2.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-3.png", 250);
  player.addFrame('walk-right', "./src/resources/donkey-walk-2.png", 250);

  //add basic attack to list of known attacks.
  //this should be player.addAttack(attackName, attackObj, x, y); x/y in player space
  //player.attacks['basic'] = basicAttack;
  basicAttack.addFrame('attack-right', "./src/resources/attack/sound-waves-right.png", 400);
  basicAttack.addFrame('attack-left', "./src/resources/attack/sound-waves-left.png", 400);

  basicAttack.realX = player.pos.x;
  basicAttack.realY = player.pos.y;
  basicAttack.objX = 150;
  basicAttack.objY = 20;

  player.addAttack('basic', basicAttack);

  player.addAnimationCompletedCallback('attack-right', function() {
    console.log('attack-right completed');
    //player.dirLock = false;
    player.setDirection('right');
    player.state = 'idle';
    //player.removeAttack('basic');
  });

  player.addAnimationCompletedCallback('attack-left', function() {
    console.log('attack-left completed');
    //player.dirLock = false;
    //player.direction = 'left';
    player.setDirection('right');
    player.state = 'idle';
    player.removeAttack('basic');
  });

  player.setAnimationLoop('attack-left', false);
  player.setAnimationLoop('attack-right', false);

  player.direction = "right";


  player.addAABB(
    0,   //x coord of bounding box in object space
    0,   //y coord of bounding box in object space
    126.5, //width of bounding box
    125 //height of bounding box
  );

  return player;

}

/******************************************************************************

Loads and returns a single basic enemy entity

******************************************************************************/
exports.loadEnemyDefinition = function(numEnemies) {


}
