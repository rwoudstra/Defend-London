var game;
function startGame(){
  game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });
}

//  Loading google font for highscore text
WebFontConfig = {
  google: {
    families: ['Fontdiner Swanky', 'Candal']
  }
};

function preload() {
  game.load.spritesheet('deadZookeeperImage', 'assets/monkeyEscape/deadHunter.png', 133, 139, 2);
  game.load.spritesheet('boatMonkeyImage', 'assets/monkeyEscape/boatMonkey.png', 153, 147, 27);
  game.load.spritesheet('hippoImage', 'assets/monkeyEscape/hippo.png', 60, 135, 3);
  game.load.spritesheet('crocImage', 'assets/monkeyEscape/croc.png', 60, 200, 20);
  game.load.spritesheet('throwMonkeyImage', 'assets/monkeyEscape/throwMonkey.png', 55, 55, 6);
  game.load.spritesheet('dartHitImage', 'assets/monkeyEscape/poof.png', 40, 40, 6);
  game.load.spritesheet('waveUpImage', 'assets/monkeyEscape/waveUp.png', 110, 146, 5);
  game.load.image('boatImage', 'assets/monkeyEscape/boat.png');
  game.load.image('zookeeperImage', 'assets/monkeyEscape/zookeeper.gif');
  game.load.image('landscapeBlock1', '../assets/landscape/landscapeBlock1.png'); //<-- for more landscape graphics, add them as landscapeBlock[NUMBER]
  game.load.image('canopyBlock1', '../assets/landscape/canopyBlock1.png');
  game.load.image('treeLogImage', 'assets/monkeyEscape/boomstronk.png');
  game.load.image('groteRotsImage', 'assets/monkeyEscape/groteRots.png');
  game.load.image('dartImage', 'assets/monkeyEscape/dart.png');
  game.load.image('bananaImage', 'assets/monkeyEscape/banana.png');
  game.load.image('jeepImage', 'assets/monkeyEscape/jeep.png');
  game.load.image('hunterBoatImage', 'assets/monkeyEscape/volgboot.png');
  game.load.audio('waveSound', 'assets/monkeyEscape/wave.mp3');
  game.load.audio('dartSound', 'assets/monkeyEscape/dart.mp3');
  game.load.audio('throwSound', 'assets/monkeyEscape/ThrowingMonkey.mp3');
  game.load.audio('KoSound', 'assets/monkeyEscape/KOHunter.mp3');

  //  Load our physics data exported from PhysicsEditor
  game.load.physics('physicsData', '../assets/physicsData.json');

  // Load json file with the locations of objects
  game.load.text('locations', 'assets/locations.json');

  //  Load the Google WebFont Loader script
  game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

// Objects
var levelBlocks;
var landscapeBlock1;
var canopyBlock1;
var playerBoat;
var boatMonkey;
var throwMonkey;
var treeLog;
var bigRock;
var enemyBullet;
var banana;
var jeeps;
var chaseBoat;
var deadHunter;
var hunters;
var hippo;

// sounds
var music;
var waveSound;
var dartSound;
var playedSound = false;
var gameOver = false;

// highscore
var score = 0;
var sec = 15;
var timer;
var scoreText;
var timescore = 0;
var timeMultiply = 10;
var shootscore = 0;
var shootPlus = 100;
var time;

//setting some standard variables
var monkeyAngle = 0;
var delay = 0;
var currentSpeed = 0;
var maxSpeed = 200;
var chaseBoatSpeed = 115;
var hippoSpeed = 70;
var crocSpeed = 40;
var friction = 3;
var turnAngle = 16;
var bounce = -20;
var objectQuantity;
var timer;

//vars for dynamically creating level blocks
var whichBlock;
var currentBlock = 0;
var totalBlocks = 100;
var blockHeight = 3000;
var nextBlockY = (blockHeight*totalBlocks)-(blockHeight/2);
var newBlockTrigger = (blockHeight*totalBlocks)-(blockHeight-500);
var objectGroupsInitialized = false;

// Shooting
var fireRate = 2000;
var nextFire = 3000;
var bananaFireRate = 700;
var nextBanana = 0;
var bulletRange = 800;
var enemyBulletRange = 2000;
var life;
var dead;

// Controls for testing
var cursors;
var fireButton;
var p2Left;
var p2Right;


function placeLevelBlock(levelBlockNum) {
  //whichBlock = 'landscapeBlock'+levelBlockNum; //<-- so multiple landscape graphics can be added. Works but currently only one graphic is used
  whichBlock = 'landscapeBlock1';
  var levelBlock = levelBlocks.create(640,nextBlockY, whichBlock);
  levelBlock.body.clearShapes();
  levelBlock.body.loadPolygon('physicsData', whichBlock);
  levelBlock.body.static = true;

  createObjects((nextBlockY-1500), levelBlockNum);

  nextBlockY = (nextBlockY-levelBlock.height);

  //increase the chaseboat's speed when currentBlock is multiply of 2
  if( currentBlock % 2 === 0 && currentBlock !== 0 ) {
    chaseBoatSpeed += 10;
  }
  currentBlock++;

}

function placeObject(objectGroupName, objectPhysics, objectImage, thisBlockNum, thisBlockY) {

  var locationFile = game.cache.getText('locations');
  var objectLocations = locationFile[objectGroupName];
  objectQuantity = Object.keys(objectLocations).length;

  for (i = 0; i < objectQuantity; i++){
    var block = parseInt(objectLocations[i]['block'], 10);

    if (block === thisBlockNum){
      var x = parseInt(objectLocations[i]['x'], 10);
      var y = (parseInt(objectLocations[i]['y'], 10)+thisBlockY);
      var object;

      switch(objectGroupName) {
        case "speedBoosts":
          object = speedBoosts.create( x, y, objectImage);
          object.animations.add('wavesAnimation', [1,2,3,4,5], 12, true, true);
          object.animations.play('wavesAnimation', 10, true);
          object.scale.x = 0.5;
          object.scale.y = 0.5;
          break;
        case "hippos":
          object = hippos.create( x, y, objectImage);
          object.body.kinematic = true;
          object.body.velocity.x = -hippoSpeed;
          object.body.rotation = 1.6;
          object.body.clearShapes();
          object.body.loadPolygon('physicsData', 'hippo');
          object.animations.add('hippoAnimation', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 12, true, true);
          object.animations.play('hippoAnimation', 10, true);
          break;
        case "crocs":
          object = crocs.create( x, y, objectImage);
          object.body.kinematic = true;
          object.body.velocity.x = crocSpeed;
          object.body.rotation = -1.6;
          object.body.clearShapes();
          object.body.loadPolygon('physicsData', 'croc');
          object.scale.x = 0.7;
          object.scale.y = 0.7;
          object.animations.add('crocAnimation', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 12, true, true);
          object.animations.play('crocAnimation', 10, true);
          break;
        case "treeLogs":
          object = treeLogs.create( x, y, objectImage);
          object.body.clearShapes();
          object.body.loadPolygon('physicsData', 'boomstronk');
          object.body.static = true;
          break;
        case "bigRocks":
          object = bigRocks.create( x, y, objectImage);
          object.body.clearShapes();
          object.body.loadPolygon('physicsData', 'groterots');
          object.body.static = true;
          break;
        case "jeeps":
          object = jeeps.create( x, y, objectImage);
          if (x < 500){
            object.rotation=3.1;
          }
          object.body.static = true;
          break;
        case "hunters":
          object = hunters.create( x, y, objectImage);
          object.body.static = true;
          //Dead hunter group for sprite when a hunter is hit
          //ObjectQuantity that's needed here is retrieved by the creation of hunters
          deadHunters = game.add.group();
          deadHunters.enableBody = true;
          deadHunters.physicsBodyType = Phaser.Physics.ARCADE;
          deadHunters.createMultiple(objectQuantity, 'deadZookeeperImage');
          deadHunters.forEach(function(item){
            item.bringToTop();
          });

          deadHunters.setAll('anchor.x', 0.5);
          deadHunters.setAll('anchor.y', 0.5);
          deadHunters.setAll('scale.x', 0.8);
          deadHunters.setAll('scale.y', 0.8);

          break;
      }
      object.bringToTop();
      // Set hunter anchor to middle
      hunters.setAll('anchor.x', 0.5);
      hunters.setAll('anchor.y', 0.5);
    }
  }
}

function createObjects(thisBlockY, thisBlockNum) {
  canopyBlock1 = game.add.sprite(0,thisBlockY,'canopyBlock1');
  //making sure the groups are created only the first time going through this function
  //for z index reasons making sure it happens once here
  // Enable body and physics for aall objects in a group
  if (objectGroupsInitialized === false){
    hunters = game.add.group();
    hunters.enableBody = true;
    hunters.physicsBodyType = Phaser.Physics.ARCADE;

    jeeps = game.add.group();
    jeeps.enableBody = true;
    jeeps.physicsBodyType = Phaser.Physics.ARCADE;

    crocs = game.add.group();
    crocs.enableBody = true;
    crocs.physicsBodyType = Phaser.Physics.P2JS;

    bigRocks = game.add.group();
    bigRocks.enableBody = true;
    bigRocks.physicsBodyType = Phaser.Physics.P2JS;

    treeLogs = game.add.group();
    treeLogs.enableBody = true;
    treeLogs.physicsBodyType = Phaser.Physics.P2JS;

    hippos = game.add.group();
    hippos.enableBody = true;
    hippos.physicsBodyType = Phaser.Physics.P2JS;

    speedBoosts = game.add.group();
    speedBoosts.enableBody = true;
    speedBoosts.physicsBodyType = Phaser.Physics.ARCADE;

    objectGroupsInitialized = true;
  }

  // Placing the objects in level block
  placeObject('speedBoosts', 'arcade', 'waveUpImage', thisBlockNum, thisBlockY);
  placeObject('hippos', 'p2', 'hippoImage', thisBlockNum, thisBlockY);
  placeObject('crocs', 'p2', 'crocImage', thisBlockNum, thisBlockY);
  placeObject('treeLogs', 'p2', 'treeLogImage', thisBlockNum, thisBlockY);
  placeObject('bigRocks', 'p2', 'groteRotsImage', thisBlockNum, thisBlockY);
  placeObject('jeeps', 'arcade', 'jeepImage', thisBlockNum, thisBlockY);
  placeObject('hunters', 'arcade', 'zookeeperImage', thisBlockNum, thisBlockY);

}

// Delay for smooth rotation
function applyDelay(n) {
  delay = n;
  currentSpeed = maxSpeed;
}

//for smoothly stopping the players from rotating
function decreaseAngularVelocity() {
  if (playerBoat.body.angularVelocity !== 0 && playerBoat.body.angularVelocity >= 0){
      playerBoat.body.angularVelocity -= 0.5;
  } else if (playerBoat.body.angularVelocity !==0){
      playerBoat.body.angularVelocity += 0.5;
  }

  if (playerBoat.body.angularVelocity <= 1 && playerBoat.body.angularVelocity >= -1){
    playerBoat.body.angularVelocity = 0;
  }

}

//enemy shoots at player
function enemyFire (hunter) {
  if (this.game.physics.arcade.distanceBetween(hunter, playerBoat) < 600) {
    if (this.game.time.now > nextFire && enemyBullets.countDead() > 0) {
      nextFire = this.game.time.now + fireRate;
      var bullet = enemyBullets.getFirstDead();
      bullet.reset(hunter.x, (hunter.y-7));
      bullet.life = this.game.time.now + enemyBulletRange;
      bullet.rotation = this.game.physics.arcade.moveToObject(bullet, boatMonkey, 500);
    }
  }
}

//monkey shoots
function fire () {
  if (this.game.time.now > nextBanana && bananas.countDead() > 0) {
    nextBanana = this.game.time.now + bananaFireRate;
    var banana = bananas.getFirstDead();
    banana.reset(throwMonkey.x, throwMonkey.y);
    banana.life = this.game.time.now + bulletRange;
    banana.rotation = this.throwMonkey.rotation;
    game.physics.arcade.velocityFromRotation(this.throwMonkey.rotation-1.575, 500, banana.body.velocity);
    throwSound.play();
  }
}

//Every bullet can live for a certain amount of time
function checkLife(bullet){
  if (this.game.time.now > bullet.life){
    bullet.kill();
  }
}

//when an enemy bullet hits the boat/monkey(s)
function bulletHitPlayer (playerBoat, bullet) {
  poof.reset(bullet.x, bullet.y);
  poof.animations.play('splashAnimation', 10, false);
  poof.events.onAnimationComplete.add(function(){
    poof.kill();
  },this);

  bullet.kill();
  dartSound.play();

  maxSpeed = 120; //Speed when player is hit
  setTimeout(function(){
    maxSpeed = 200;
  },1500); //Time the player is slowed down
}

//when the boat hits waveUp, speed up the players
function playerHitWaveUp (boatMonkey, waveUp) {
  if(playedSound === false){
    waveSound.play();
    playedSound = true;
  }
  maxSpeed = 400; //Speed when player is hit
  setTimeout(function(){
    maxSpeed = 200;
    waveSound.stop();
    playedSound = false;
  },1500); //Time the player is slowed down
}

function highscoreTimer(){
  timer = setInterval(function() {
    $('#timer').text(sec--);
    if (sec == -1) {
      window.location.href = "/";
    }
  }, 1000);
}

//when the chase boat hits the boat/monkey(s), game is over
function chaseBoatHitPlayer (throwMonkey, chaseBoat) {
  playerBoat.kill();
  throwMonkey.dead = true;
  throwMonkey.kill();
  boatMonkey.kill();

  setHighscore(score,playerOneName,playerTwoName);

  setHighscoreList();

  console.log("done:)");
  setTimeout(function(){
    $('#gameArea').hide(500);
    $('.spinnerContainer').show();
    $('.background').show();
    $('#highscoresScreen').show(500);
    gameOver = true;
    sec = 15;
    highscoreTimer();
  },1500);
}

function restartGame () {
  game.time.reset();
  score = 0;
  shootscore = 0;
  chaseBoatSpeed = 115;
  currentBlock = 0;
  objectGroupsInitialized = false;
  nextBlockY = (blockHeight*totalBlocks)-(blockHeight/2);
  newBlockTrigger = (blockHeight*totalBlocks)-(blockHeight-500);
  sec = 15;
  $('#timer').text(sec);
  clearInterval(timer);

  game.state.restart();
  $('#highscoresScreen').hide();
  $('.spinnerContainer').hide();
  $('.background').hide();
  $('#gameArea').show();
  gameOver = false;
}

function bulletHitEnemy (hunter,bullet){
  bullet.kill();

  deadHunter = deadHunters.getFirstDead();
  deadHunter.reset(hunter.x, hunter.y);
  deadHunter.animations.add('deadHunterAnimation', [1,2], 2, true, true);
  deadHunter.animations.play('deadHunterAnimation', 7, true);

  //create random angle for deadhunters
  deadHunter.angle = game.rnd.integerInRange(-180,180);

  hunter.kill();

  KoSound.play();

  shootscore = shootscore + shootPlus;

  text = game.add.text(hunter.x, hunter.y, "+"+shootPlus, { font: "45px Candal", fill: "#5b4014", align: "center" });
  text.stroke = '#FFFFFF';
  text.strokeThickness = 6;
  text.anchor.setTo(0.5, 0.5);

  text.alpha = 1;

  game.add.tween(text).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
  game.add.tween(text).to( { y: text.y-50 }, 2000, Phaser.Easing.Linear.None, true);
}

function accelerateToObject(obj1, obj2, speed) {
  if (typeof speed === 'undefined') { speed = 0; }
  var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  obj1.body.rotation = angle + game.math.degToRad(90); // correct angle of angry bullets (depends on the sprite used)
  obj1.body.force.x = Math.cos(angle) * speed;
  obj1.body.force.y = Math.sin(angle) * speed;
}

function aimHunters (hunter) {
  hunter.rotation = (game.physics.arcade.angleBetween(hunter, boatMonkey)+1.6);
}

function removeOutBounds (hunter) {
  if (hunter.y > playerBoat.y+375){
    hunter.kill();
  }
}

//making the crocs and hippos swim over the width of the river
function switchDirections() {
  hippos.forEach(function(item){
    if(item.body.velocity.x === hippoSpeed){
      item.body.velocity.x = -hippoSpeed;
      item.body.rotation = 1.6;
    } else {
      item.body.velocity.x = hippoSpeed;
      item.body.rotation = -1.6;
    }
  });
  crocs.forEach(function(item){
    if(item.body.velocity.x === crocSpeed){
      item.body.velocity.x = -crocSpeed;
      item.body.rotation = 1.6;
    } else {
      item.body.velocity.x = crocSpeed;
      item.body.rotation = -1.6;
    }
  });
}

function highscore() {
  time = game.time.totalElapsedSeconds();
  timescore = time * timeMultiply;
  if (shootscore) {
    score = shootscore + timescore;
  }
  else {
    score = timescore;
  }
}

//setting up the creation of a new level block and bringing all objects in it to top
function newLevelBlock(){
  newBlockTrigger-=blockHeight;
  var randNum = game.rnd.integerInRange(2,3);
  placeLevelBlock(randNum);
  game.time.events.remove(timer);
  timer = game.time.events.loop(Phaser.Timer.SECOND * 4.5, switchDirections, this);
  playerBoat.bringToTop();
  throwMonkey.bringToTop();
  boatMonkey.bringToTop();
  poof.bringToTop();
  chaseBoat.bringToTop();
  canopyBlock1.bringToTop();
  scoreText.bringToTop();
}

function create() {
  //FOR TESTING WITH KEYBOARD KEYS
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  p2Left = game.input.keyboard.addKey(Phaser.Keyboard.A);
  p2Right = game.input.keyboard.addKey(Phaser.Keyboard.D);

  //Wave sound
  waveSound = game.add.audio('waveSound');
  waveSound.volume = 8;

  //Dart Sound
  dartSound = game.add.audio('dartSound');
  dartSound.volume = 7;

  //KO Hunter Sound
  KoSound = game.add.audio('KoSound');
  KoSound.volume = 2;

  //ThrowMonkey Sound
  throwSound = game.add.audio('throwSound');
  throwSound.volume = 1;

  //Game options
  game.world.setBounds(0, 0, 1280, (3000*totalBlocks));
  game.stage.backgroundColor = '#8ba394';
  game.cache._text.locations.data = JSON.parse(game.cache.getText('locations'));

  // Enable p2 physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  //bounceness
  game.physics.p2.defaultRestitution = 0.5;

  //Placing the first level block
  levelBlocks = game.add.group();
  levelBlocks.enableBody = true;
  levelBlocks.physicsBodyType = Phaser.Physics.P2JS;
  placeLevelBlock(1);

  //Players & player related objects
  playerBoat = game.add.sprite(600, ((3000*totalBlocks)-200), 'boatImage');

  boatMonkey = game.add.sprite(0, 0, 'boatMonkeyImage');
  boatMonkey.anchor.setTo(0.5, 0.5);

  throwMonkey = game.add.sprite(0, 0, 'throwMonkeyImage');
  throwMonkey.anchor.setTo(0.5, 0.5);
  throwMonkey.dead = false;

  poof = game.add.sprite(0, 0, 'dartHitImage');
  poof.animations.add('splashAnimation', [1,2,3,4,5,6], 12, true, true);
  poof.anchor.setTo(0.5, 0.5);
  poof.kill();

  // Chaseboat & chaseboat related objects
  chaseBoat = game.add.sprite(600, ((3000*totalBlocks)+600), 'hunterBoatImage');
  chaseBoat.anchor.setTo(0.5,0.5);

  game.physics.arcade.enable([boatMonkey, throwMonkey, chaseBoat]);

  boatMonkey.animations.add('moveLeftAnimation', [1,2,3,4,5,6,7,8,9,10,11,12,13,14], 12, true, true);
  boatMonkey.animations.add('moveRightAnimation', [1,15,16,17,18,19,20,21,22,23,24,25,26,27], 12, true, true);

  throwMonkey.animations.add('throwBananaAnimation', [1,2,3,4,5,6], 12, true, true);

  // Enable the physics bodies on all the sprites and turn on the visual debugger
  game.physics.p2.enable(playerBoat, false);

  // Clear the shapes and load the polygon from the physicsData JSON file in the cache
  playerBoat.body.clearShapes();
  playerBoat.body.loadPolygon('physicsData', 'boat');
  playerBoat.anchor.setTo(0.5,0.7);

  timer = game.time.events.loop(Phaser.Timer.SECOND * 4.5, switchDirections, this);

  game.camera.follow(playerBoat);

  // The enemies bullet group
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(100, 'dartImage');

  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  // The enemies bullet group
  bananas = game.add.group();
  bananas.enableBody = true;
  bananas.physicsBodyType = Phaser.Physics.ARCADE;
  bananas.createMultiple(100, 'bananaImage');

  bananas.setAll('anchor.x', 0);
  bananas.setAll('anchor.y', 0.5);
  bananas.setAll('outOfBoundsKill', true);
  bananas.setAll('checkWorldBounds', true);

  scoreText = game.add.text(game.camera.x+30, game.camera.y+5, "Score: "+Math.round(score), {font: "30px Candal", fill: "#5b4014", stroke: '#FFFFFF', strokeThickness: 3});
  scoreText.anchor.setTo(0);
  scoreText.fixedToCamera = true;

  //Bring the canopy sprite to top so objects are under the trees
  canopyBlock1.bringToTop();
  scoreText.bringToTop();

}

function update() {

  scoreText.setText('Score: '+Math.round(score));

  if (playerBoat.y < newBlockTrigger){
    newLevelBlock();
  }

  if(throwAngle){
    throwMonkey.angle = throwAngle;
    throwMonkey.rotation+=1.6;
  }

  if (throwMonkey.dead === false) {
    //increasing the score unless game is over.
    highscore();
    //chaseBoat follows player
    chaseBoat.rotation = this.game.physics.arcade.moveToObject(chaseBoat, throwMonkey, chaseBoatSpeed)+1.6;
  } else {
    //chaseboat keeps going forward if player is dead.
    chaseBoat.body.velocity.y = -150;
    chaseBoat.body.velocity.x = 0;
    chaseBoat.rotation = 0;
  }

  //Making the hunters shoot & aim at player
  hunters.forEachAlive(enemyFire, this);
  hunters.forEachAlive(aimHunters,this);  //make hunters accelerate to ship
  hunters.forEachAlive(removeOutBounds, this); //kill hunters out of screen

  //bullets get killed after living a certain time (bulletRange variable)
  bananas.forEachAlive(checkLife, this);
  enemyBullets.forEachAlive(checkLife, this);

  //Collision for both bullet groups and chaseBoat
  game.physics.arcade.overlap(throwMonkey, chaseBoat, chaseBoatHitPlayer, null, this);
  game.physics.arcade.overlap(enemyBullets, throwMonkey, bulletHitPlayer, null, this);
  game.physics.arcade.overlap(bananas, hunters, bulletHitEnemy,null,this);
  game.physics.arcade.overlap(throwMonkey, speedBoosts, playerHitWaveUp,null,this);

  //for letting the boat behave less uncontrollable
  playerBoat.body.damping = 0.8;

  if (p2Left.isDown)
  {
    throwMonkey.rotation-=0.05;
  }

  if (p2Right.isDown)
  {
    throwMonkey.rotation+=0.05;
  }

  if (throwBanana || fireButton.isDown && throwMonkey.dead === false)
  {
    fire();
    throwMonkey.animations.play('throwBananaAnimation', 10, false);
  }

  if (paddleLeft || cursors.left.isDown)
  {
    playerBoat.body.rotateLeft(turnAngle);
    boatMonkey.animations.play('moveLeftAnimation', 10, false);
    if (delay === 0){
      applyDelay(32);
    }
  }
  else if (paddleRight || cursors.right.isDown)
  {
    playerBoat.body.rotateRight(turnAngle);
    boatMonkey.animations.play('moveRightAnimation', 10, false);
    if (delay === 0){
      applyDelay(-32);
    }
  }

  //slowly increase the angle with every time delay is updated and not 0
  if (delay > 0){
    delay-=1;
  } else if (delay < 0) {
    delay+=1;
  } else if (delay === 0){
    decreaseAngularVelocity();
    //when delay is 0 (no button input for sure), but speed > 0, slow the boat down
    if (currentSpeed > 0){
      currentSpeed-=friction;
    }
  }

  if (currentSpeed > 0)
  {
      playerBoat.body.thrust(currentSpeed);
  }

  boatMonkey.x = playerBoat.x;
  boatMonkey.y = playerBoat.y;
  throwMonkey.x = playerBoat.x;
  throwMonkey.y = playerBoat.y;
  boatMonkey.rotation = (playerBoat.rotation-3.15);


}

function render() {
}
