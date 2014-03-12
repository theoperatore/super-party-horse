(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var vect=require("../utilities/vector2D");var AABB=function(realX,realY,x,y,width,height){this.width=width;this.height=height;this.minBoundX=realX+x;this.minBoundY=realY+y;this.maxBoundX=this.minBoundX+width;this.maxBoundY=this.minBoundY+height;this.offsetX=x;this.offsetY=y;this.center=vect.create((x+width)/2,(y+height)/2)};AABB.prototype.collidesWith=function(b){if(this.minBoundX>b.maxBoundX||this.minBoundY>b.maxBoundY||this.maxBoundX<b.minBoundX||this.maxBoundY<b.minBoundY){return false}return true};AABB.prototype.updatePos=function(realX,realY){this.minBoundX=realX+this.offsetX;this.minBoundY=realY+this.offsetY;this.maxBoundX=this.minBoundX+this.width;this.maxBoundY=this.minBoundY+this.height;this.center.x=(this.minBoundX+this.width)/2;this.center.y=(this.minBoundY+this.height)/2};module.exports=AABB},{"../utilities/vector2D":12}],2:[function(require,module,exports){exports.loadImg=function(path,callback){var img=new Image;img.addEventListener("load",function(ev){console.log("image loaded",path,ev);if(typeof callback==="function"){callback(img)}});img.src=path};exports.batchLoad=function(paths,callback){var out=[];for(var i=0;i<paths.length;i++){var tmpImg=new Image;tmpImg.addEventListner("load",function(ev){out.push(tmpImg);if(out.length===paths.length){if(typeof callback==="function"){callback(out)}else{console.log("images loaded but callback not specified!")}}});tmpImg.src=paths[i]}}},{}],3:[function(require,module,exports){var Input=function Input(name,keyCode,callback,keyup){this.name=name;this.keyCode=keyCode;this.keydownCallback=callback||function(){};this.keyupCallback=keyup||function(){};this.isPressed=false;this.isSystemInput=false};var inputs=[],inputMap={};exports.init=function(){document.addEventListener("keydown",function(ev){ev.preventDefault();ev.stopPropagation();var tmpInput=inputs[ev.keyCode]||"undefined";tmpInput.isPressed=true;if(tmpInput!=="undefined"&&tmpInput.isSystemInput){tmpInput.keydownCallback()}});document.addEventListener("keyup",function(ev){ev.preventDefault();ev.stopPropagation();var tmpInput=inputs[ev.keyCode]||"undefined";tmpInput.isPressed=false;tmpInput!=="undefined"?tmpInput.keyupCallback():console.log("undefined keyup")})};exports.addInput=function(name,keyCode,keydownCallback,keyupCallback,systemInput){keydownCallback=typeof keydownCallback==="function"?keydownCallback:function(){};keyupCallback=typeof keyupCallback==="function"?keyupCallback:function(){};var newInput=new Input(name,keyCode,keydownCallback,keyupCallback);inputs[keyCode]=newInput;inputMap[name]=keyCode};exports.addSystemInput=function(name,keyCode,keydownCallback){keydownCallback=typeof keydownCallback==="function"?keydownCallback:function(){};var newInput=new Input(name,keyCode,keydownCallback);newInput.isSystemInput=true;inputs[keyCode]=newInput;inputMap[name]=keyCode};exports.removeInput=function(name){if(inputMap[name]){var out=inputs[inputMap[name]]=undefined;inputMap[name]=undefined}};exports.getInputCollection=function(){return inputs};exports.useState=function(newState){for(var i=0;i<newState.inputs.length;i++){var tmpInput=newState.inputs[i];inputs[tmpInput.keyCode]=tmpInput;inputMap[tmpInput.name]=tmpInput.keyCode}};exports.createInput=function(name,keyCode,keydownCallback,keyupCallback){keydownCallback=typeof keydownCallback==="function"?keydownCallback:function(){};keyupCallback=typeof keyupCallback==="function"?keyupCallback:function(){};return new Input(name,keyCode,keydownCallback,keyupCallback)}},{}],4:[function(require,module,exports){var rend={ctx:null,height:0,width:0,state:null};exports.init=function(context,width,height,state){rend.ctx=context;rend.width=width;rend.height=height;rend.state=state||new State("dummy")};exports.useState=function(newState){if(typeof newState!="undefined"){rend.state=newState;rend.state.player=newState.player}};exports.draw=function(gameState){renderState=gameState||rend.state;if(rend.ctx!=null){if(renderState!=null){rend.ctx.clearRect(0,0,rend.width,rend.height);if(renderState.scenery.backdrop!=null){}if(renderState.scenery.background!=null){rend.ctx.drawImage(renderState.scenery.background,0,0)}if(renderState.npcs.length>0){}if(renderState.interactables.length>0){}if(renderState.enemies.length>0){for(var i=0;i<renderState.enemies.length;i++){renderState.enemies[i].draw(rend.ctx)}}if(renderState.player!=null){renderState.player.draw(rend.ctx)}if(renderState.scenery.foreground!=null){rend.ctx.drawImage(renderState.scenery.foreground,0,300)}if(renderState.hud!=null){}if(renderState.plainText!=null){rend.ctx.beginPath();rend.ctx.font="25pt sans-serif";rend.ctx.fillText(renderState.plainText,0,rend.height/2)}if(renderState.optionalRenderingFucntion!=null){renderState.ooptionalRenderingFunction()}}else{console.log("Game state is not set!")}}else{console.log("drawing context is not set!")}}},{}],5:[function(require,module,exports){var inputManager=require("./input-manager"),imageManager=require("./image");var State=function State(name){this.name=name;this.player=null;this.enemies=[];this.npcs=[];this.interactables=[];this.scenery={backdrop:null,background:null,foreground:null};this.inputs=[];this.hud=null;this.plainText=null;this.optionalRenderingFunction=null};State.prototype.addPlayerToState=function(player){this.player=player};State.prototype.addEnemyToState=function(enemy){if(enemy.length){for(var i=0;i<enemy.length;i++){this.enemies.push(enemy[i])}}else{this.enemies.push(enemy)}};State.prototype.addNPCToState=function(npc){if(npc.length){for(var i=0;i<npc.length;i++){this.npcs.push(npc[i])}}else{this.npcs.push(npc)}};State.prototype.addInteractableToState=function(interactable){if(interactable.length){for(var i=0;i<interactable.length;i++){this.interactables.push(interactable[i])}}else{this.interactables.push(interactable)}};State.prototype.addInput=function(name,keyCode,keydownCallback,keyupCallback){this.inputs.push(inputManager.createInput(name,keyCode,keydownCallback,keyupCallback))};State.prototype.addSystemInput=function(name,keyCode,keydownCallback){var input=inputManager.createInput(name,keyCode,keydownCallback);input.isSystemInput=true;this.inputs.push(input)};State.prototype.setBackdrop=function(path,callback){var state=this;imageManager.loadImg(path,function(img){state.scenery.backdrop=img;if(typeof callback==="function"){callback()}})};State.prototype.setBackground=function(path,callback){var state=this;imageManager.loadImg(path,function(img){state.scenery.background=img;if(typeof callback==="function"){callback()}})};State.prototype.setForeground=function(path,callback){var state=this;imageManager.loadImg(path,function(img){state.scenery.foreground=img;if(typeof callback==="function"){callback()}})};State.prototype.addOptionalRendering=function(callback){this.optionalRenderingFunction=typeof callback==="function"?callback:null};module.exports=State},{"./image":2,"./input-manager":3}],6:[function(require,module,exports){var _Frame=function _Frame(path,ms,callback){this.img=new Image;this.frameTime=ms;callback=typeof callback==="function"?callback:function(){};this.img.addEventListener("load",callback({message:path+" -- loaded",frame:this}));this.img.src=path};var Animation=function Animation(){this._frames=[];this.numFrames=0;this.currTime=0;this.currIndex=0;this.loop=true;this.completedCallback};Animation.prototype.addFrame=function(path,ms,loadCallback){var frame=new _Frame(path,ms,loadCallback);this._frames.push(frame);this.numFrames++};Animation.prototype.addAnimationCompletedCallback=function(callback){this.completedCallback=typeof callback==="function"?callback:function(){console.log("callback not a function")}};Animation.prototype.update=function(dt){this.currTime+=dt;if(this.numFrames>1){if(this.currTime>=this._frames[this.currIndex].frameTime){this.currTime%=this._frames[this.currIndex].frameTime;this.currIndex++}if(this.currIndex>=this.numFrames){if(!this.loop){this.completedCallback()}this.reset()}}};Animation.prototype.getCurrImg=function(){return this._frames[this.currIndex].img};Animation.prototype.reset=function(){this.currTime=0;this.currIndex=0};module.exports=Animation},{}],7:[function(require,module,exports){var Entity=require("./entity"),AABB=require("../core/boundingbox");var Enemy=function(){Entity.call(this);this.aabbs=[]};Enemy.prototype=Object.create(Entity.prototype);Enemy.prototype.addAABB=function(x,y,width,height){var box=new AABB(this.pos.x,this.pos.y,x,y,width,height);this.aabbs.push(box)};Enemy.prototype.update=function(dt){this.updateRungeKutta(dt);for(var i=0;i<this.aabbs.length;i++){this.aabbs[i].updatePos(this.pos.x,this.pos.y)}};module.exports=Enemy},{"../core/boundingbox":1,"./entity":8}],8:[function(require,module,exports){var vect=require("../utilities/vector2D"),Animation=require("./animation");var Entity=function Entity(){this.pos=vect.create(0,0);this.vel=vect.create(0,0);this.accel=vect.create(0,0);this.prev_pos=vect.create(0,0);this.mass=5;this.maxhp=100;this.currhp=100;this.inventory={};this.equipment={};this.upgrades={};this.direction="left";this.dirLock=false;this.animations={left:new Animation};this.drawOptions={scaledWidth:.5,scaledHeight:.5}};Entity.prototype.addFrame=function(animation,path,ms,loadCallback){var anim=this.animations[animation]||new Animation;anim.addFrame(path,ms,loadCallback);this.animations[animation]=anim};Entity.prototype.setAnimationLoop=function(anim,loop){if(this.animations[anim]){this.animations[anim].loop=loop}else{console.log("not a defined animation",anim)}};Entity.prototype.addAnimationCompletedCallback=function(anim,callback){if(this.animations[anim]){if(typeof callback==="function"){this.animations[anim].addAnimationCompletedCallback(callback)}}else{console.log(anim,"not a defined animation",anim)}};Entity.prototype.updateVerlet=function(dt){this.vel.x=2*this.pos.x-this.prev_pos.x;console.log(this.vel.x);this.pos.x=2*this.pos.x-this.prev_pos.x+this.accel.x*dt*dt;this.pos.y=2*this.pos.y-this.prev_pos.y+this.accel.y*dt*dt;this.prev_pos.x=this.pos.x;this.prev_pos.y=this.pos.y;this.animations[this.direction].update(dt)};Entity.prototype.updateRungeKutta=function(dt,stepsize){var k1,k2,k3,k4,h=stepsize||.2;k1=this.vel.x+this.accel.x*dt;k2=this.vel.x+k1/2+this.accel.x*(dt/2);k3=this.vel.x+k2/2+this.accel.x*(dt/2);k4=this.vel.x+k3+this.accel.x*dt;this.pos.x+=dt/6*(k1+2*k2+2*k3+k4);this.vel.x+=this.accel.x*dt;k1=this.vel.y+this.accel.y*dt;k2=this.vel.y+k1/2+this.accel.y*(dt+dt/2);k3=this.vel.y+k2/2+this.accel.y*(dt+dt/2);k4=this.vel.y+k3+this.accel.y*dt;this.pos.y+=dt/6*(k1+2*k2+2*k3+k4);this.vel.y+=this.accel.y*dt;if(this.animations[this.direction]!="undefined"){this.animations[this.direction].update(dt)}};Entity.prototype.draw=function(ctx){var img=this.animations[this.direction].getCurrImg();if(img!=null){ctx.drawImage(img,this.pos.x,this.pos.y,this.animations[this.direction].getCurrImg().width*this.drawOptions.scaledWidth,this.animations[this.direction].getCurrImg().height*this.drawOptions.scaledHeight)}};module.exports=Entity},{"../utilities/vector2D":12,"./animation":6}],9:[function(require,module,exports){var Entity=require("./entity"),AABB=require("../core/boundingbox.js");var Player=function Player(){Entity.call(this);this.aabbs=[]};Player.prototype=Object.create(Entity.prototype);Player.prototype.addAABB=function(x,y,width,height){var box=new AABB(this.pos.x,this.pos.y,x,y,width,height);this.aabbs.push(box)};Player.prototype.update=function(dt){this.updateRungeKutta(dt);for(var i=0;i<this.aabbs.length;i++){this.aabbs[i].updatePos(this.pos.x,this.pos.y)}};Player.prototype.pollInput=function(inputMap,inputCollection){var playerInput;for(var name in inputMap){playerInput=inputCollection[inputMap[name]]||null;if(playerInput!=null&&playerInput.isPressed){inputCollection[inputMap[name]].keydownCallback()}}};module.exports=Player},{"../core/boundingbox.js":1,"./entity":8}],10:[function(require,module,exports){var canvas=document.getElementById("playground"),ctx=canvas.getContext("2d"),now=+new Date,prev=+new Date,dt=0,currState,Entity=require("./entity/entity"),GameState=require("./core/state"),Enemy=require("./entity/enemy"),Input=require("./core/input-manager"),Renderer=require("./core/renderer"),Resource=require("./utilities/resource"),player,title=new GameState("title"),game=new GameState("game"),loading=new GameState("loading"),gameover=new GameState("gameover"),enemies=[],PLAYER_INPUT_MAP={left:65,right:68,up:87,down:83,attack:32};function init(){Input.init();player=Resource.loadPlayerDefinition();for(var i=1;i<5;i++){var jagwar=new Enemy;jagwar.addFrame("left","./src/resources/jagwar-left.png",1e3,function(ev){console.log(ev)});jagwar.pos.x=canvas.width-10;jagwar.pos.y=50*i;jagwar.accel.x=-1e-5;jagwar.addAABB(0,0,100,100);enemies.push(jagwar)}game.addEnemyToState(enemies);game.addInput("right",68,function(){player.vel.x=.2;if(!player.dirLock){player.direction="right"}},function(){player.vel.x=0});game.addInput("left",65,function(){player.vel.x=-.2;if(!player.dirLock){player.direction="left"}},function(){player.vel.x=0});game.addInput("up",87,function(){player.vel.y=-.2},function(){player.vel.y=0});game.addInput("down",83,function(){player.vel.y=.2},function(){player.vel.y=0});game.addInput("attack",32,function(){if(player.direction==="left"){player.direction="attack-left"}else if(player.direction==="right"){player.direction="attack-right"}player.dirLock=true});title.addSystemInput("start",13,function(){console.log("start pressed");Input.useState(game);Renderer.useState(game);currState=game;Input.removeInput("start")});title.plainText="<! Super Party Horse !> Press Enter to play!";game.addPlayerToState(player);game.setBackground("./src/resources/grass-background.png");game.setForeground("./src/resources/grass-foreground.png");Renderer.init(ctx,canvas.width,canvas.height,title);Input.useState(title);currState=title}function update(){now=+new Date;dt=now-prev;prev=now;player.pollInput(PLAYER_INPUT_MAP,Input.getInputCollection());player.update(dt);if(currState.enemies.length!=0){for(var i=0;i<currState.enemies.length;i++){if(currState.enemies[i]){currState.enemies[i].update(dt);for(var j=0;j<player.aabbs.length;j++){for(var k=0;k<currState.enemies[i].aabbs.length;k++){if(player.aabbs[j].collidesWith(currState.enemies[i].aabbs[k])){currState.enemies.splice(i,1);break}}}}}}Renderer.draw();requestAnimationFrame(update)}init();requestAnimationFrame(update)},{"./core/input-manager":3,"./core/renderer":4,"./core/state":5,"./entity/enemy":7,"./entity/entity":8,"./utilities/resource":11}],11:[function(require,module,exports){var Player=require("../entity/player"),AABB=require("../core/boundingbox");exports.loadResourceFile=function(path){};exports.exportObject=function(obj){};exports.loadPlayerDefinition=function(){var player=new Player;player.pos.y=100;player.pos.x=100;player.addFrame("right","./src/resources/donkey-idle-right.png",1e3,function(ev){console.log(ev)});player.addFrame("left","./src/resources/donkey-idle-left.png",1e3,function(ev){console.log(ev)});player.addFrame("attack-right","./src/resources/attack/donkey-attack-start-right.png",250,function(ev){console.log(ev)});player.addFrame("attack-right","./src/resources/attack/donkey-attack-middle-right.png",250,function(ev){console.log(ev)});player.addFrame("attack-right","./src/resources/attack/donkey-attack-end-right.png",400,function(ev){console.log(ev)});player.addFrame("attack-left","./src/resources/attack/donkey-attack-start-left.png",250,function(ev){console.log(ev)});player.addFrame("attack-left","./src/resources/attack/donkey-attack-middle-left.png",250,function(ev){console.log(ev)});player.addFrame("attack-left","./src/resources/attack/donkey-attack-end-left.png",400,function(ev){console.log(ev)});player.addAnimationCompletedCallback("attack-right",function(){console.log("attack-right completed");player.dirLock=false;player.direction="right"});player.addAnimationCompletedCallback("attack-left",function(){console.log("attack-left completed");player.dirLock=false;player.direction="left"});player.setAnimationLoop("attack-left",false);player.setAnimationLoop("attack-right",false);player.direction="right";player.addAABB(0,0,100,100);return player};exports.loadEnemyDefinition=function(){}},{"../core/boundingbox":1,"../entity/player":9}],12:[function(require,module,exports){var Vector2D=function(x,y){this.x=x;this.y=y};Vector2D.prototype.add=function(v2){this.x+=v2.x;this.y+=v2.y};Vector2D.prototype.diff=function(v2){this.x=v2.x-this.x;this.y=v2.y-this.y};Vector2D.prototype.scalar=function(s){this.x*=s;this.y*=s};Vector2D.prototype.normalize=function(){var dd=this.x*this.x+this.y*this.y,d=Math.sqrt(dd);this.x=this.x/d;this.y=this.y/d};Vector2D.prototype.magnitude=function(){var dd=this.x*this.x+this.y*this.y,d=Math.sqrt(dd);return d};Vector2D.prototype.dotProduct=function(v2){return this.x*v2.x+this.y*v2.y};exports.create=function(x,y){return new Vector2D(x,y)};exports.add=function(v1,v2){return new Vector2D(v1.x+v2.x,v1.y+v2.y)};exports.diff=function(v1,v2){return new Vector2D(v2.x-v1.x,v2.y-v1.y)};exports.scalar=function(v1,s){return new Vector2D(v1.x*s,v1.y*s)};exports.normalize=function(v1){var dd=v1.x*v1.x+v1.y*v1.y;d=Math.sqrt(dd);return new Vector2D(v1.x/d,v1.y/d)};exports.magnitude=function(v1){var dd=v1.x*v1.x+v1.y*v1.y,d=Math.sqrt(dd);return d};exports.dotProduct=function(v1,v2){return v1.x*v2.x+v1.y*v2.y}},{}]},{},[10]);