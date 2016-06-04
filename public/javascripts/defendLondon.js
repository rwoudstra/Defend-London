var game;
function startGame(){
  game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });
}

//  Loading google font for highscore text
WebFontConfig = {
  google: {
    families: ['Black Ops One']
  }
};

function preload() {

    game.load.image('space', 'assets/background.jpg');
    game.load.image('bomb', 'assets/bomb.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('bomber', 'assets/bomber.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('gun', 'assets/gun.png');
    game.load.image('hitPoint', 'assets/hitPoint.png');
    game.load.spritesheet('boom', 'assets/explosion.png', 158, 158, 8);
    game.load.spritesheet('planeboom', 'assets/planeboom.png', 50, 50, 4);
    game.load.audio('planesound', 'assets/audio/plane.mp3');

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

var sprite;
var planeSound;
var cursors;
var ground;

var bomb;
var bombs;
var bombTime = 0;
var boom;

var gun;
var bullet;
var bullets;
var bulletTime = 0;
var planeboom;
var gameOver = false;

var hitPoints;
var hitPoint;

var londonHP = 100;
var planeHP = 100;

var londonDMG = 5;
var planeDMG = 10;

var LondonHPText;

function bombHit (bomb, hitPoint) {
  bomb.kill();
  londonHP = londonHP-londonDMG;
  hitPoint.kill();
  boom.reset(bomb.x, ground.y-45);
  boom.animations.play('explosion', 15, false);
  boom.events.onAnimationComplete.add(function(){
     boom.kill();
  },this);

  console.log('hit');
  createHitpoint();
  //boomSound.play();
}

function createHitpoint () {

    var hitPoint = hitPoints.create(game.rnd.integerInRange(80, 1200), 640, 'hitPoint');
    hitPoint.anchor.setTo(0.5, 0.5);

    hitPointTween(hitPoint);
}

function hitPointTween (hitPoint) {

  var tween = game.add.tween(hitPoint).to( { y: hitPoint.y-30 }, 1000, Phaser.Easing.Linear.None, true);
  tween.yoyo(true, 10);
  tween.onComplete.add(hitPointTween, this);
}

function firebomb () {
  if (game.time.now > bombTime)
  {
    var bomb = bombs.getFirstDead();
    bomb.reset(sprite.body.x + 16, sprite.body.y + 16);
    bomb.lifespan = 3000;
    game.physics.arcade.velocityFromRotation(-5, 200, bomb.body.velocity);
    bombTime = game.time.now + 1000;
  }
}

function firebullet () {
  if (game.time.now > bulletTime)
  {
    var bullet = bullets.getFirstDead();
    bullet.reset(gun.body.x + 24, gun.body.y + 24);
    bullet.lifespan = 3000;
    game.physics.arcade.velocityFromAngle(gun.angle-50, 250, bullet.body.velocity);
    bulletTime = game.time.now + 500;
  }
}

function bulletHit (sprite, bullet){
  planeHP = planeHP-planeDMG;
  console.log('hit plane');
  planeBoom.reset(bullet.x, bullet.y);
  planeBoom.animations.play('planeexplosion', 15, false);
  planeBoom.events.onAnimationComplete.add(function(){
     planeBoom.kill();
  },this);
  bullet.kill();
}

function create() {

    //  This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    //  We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    // Plane geluid loop
    //planeSound = game.add.audio('planesound');
    //planeSound.play();

    //  Our bombs
    bombs = game.add.group();
    bombs.enableBody = true;
    bombs.physicsBodyType = Phaser.Physics.ARCADE;
    bombs.createMultiple(40, 'bomb');
    bombs.setAll('anchor.x', 0.5);
    bombs.setAll('anchor.y', 0.5);
    bombs.setAll('outOfBoundsKill', true);
    bombs.setAll('checkWorldBounds', true);

    //  Our bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', -2.5);
    bullets.setAll('anchor.y', -2.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);


    //  Our player bomber
    sprite = game.add.sprite(300, 300, 'bomber');
    sprite.anchor.set(0.5);

    //  Ground
    ground = game.add.sprite(0, 680, 'ground');

    // Gun
    gun = game.add.sprite(612, 646, 'gun');
    gun.anchor.set(0.5);

    hitPoints = game.add.group();
    hitPoints.enableBody = true;
    hitPoints.physicsBodyType = Phaser.Physics.ARCADE;

    createHitpoint();

    boom = game.add.sprite(0, 0, 'boom');
    boom.animations.add('explosion', [8,1,2,3,4,5,6,7], 8, true, true);
    boom.anchor.setTo(0.5, 0.5);
    boom.kill();

    planeBoom = game.add.sprite(0, 0, 'planeboom');
    planeBoom.animations.add('planeexplosion', [1,2,3,4], 4, true, true);
    planeBoom.anchor.setTo(0.5, 0.5);
    planeBoom.kill();

    //  and its physics settings
    game.physics.enable([sprite, ground, gun], Phaser.Physics.ARCADE);
    sprite.body.drag.set(100);
    sprite.body.collideWorldBounds = true;

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    LondonHPText = game.add.text(game.camera.x+20, game.camera.y+5, "London HP: "+londonHP);
    LondonHPText.font = 'Black Ops One';
    LondonHPText.fill = '#FFF';
    LondonHPText.fontSize = 22;
    LondonHPText.anchor.setTo(0);
    LondonHPText.fixedToCamera = true;

    PlaneHPText = game.add.text(game.camera.x+1100, game.camera.y+5, "Plane HP: "+planeHP);
    PlaneHPText.font = 'Black Ops One';
    PlaneHPText.fill = '#FFF';
    PlaneHPText.fontSize = 22;
    PlaneHPText.anchor.setTo(0);
    PlaneHPText.fixedToCamera = true;
}

function update() {

  LondonHPText.setText('London HP: '+londonHP);
  PlaneHPText.setText('Plane HP: '+planeHP);

  // give speed to aircraft contantly
  sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(sprite.angle, 250));

  // when bomb hits the hitpoint
  game.physics.arcade.overlap(bombs, hitPoints, bombHit, null, this);

  // Als kogel plane raakt voer bulletHit
  game.physics.arcade.overlap(bullets, sprite, bulletHit, null, this);



    /*
if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -150;
    }
    else if (cursors.right.isDown)
    {
         sprite.body.angularVelocity =150;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }
*/
    
    if (paddleLeft || cursors.right.isDown)
    {
      sprite.body.angularVelocity = 150;
    }
    else if (paddleRight || cursors.left.isDown)
    {
      sprite.body.angularVelocity = -150;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }
    
    if (throwBanana || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
      firebomb();
    }
    
    if (turretLeft || cursors.up.isDown)
    {
	   if(gun.angle < 40){
	   gun.angle += 1;
      }
      
    }
	if (turretRight || cursors.down.isDown)
    {
	  if(gun.angle > -120){
      gun.angle += -1;
      }
    }
    
    if (turretFire || game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
    {
       firebullet();
    }




    bombs.forEachExists(screenWrap, this);

}

function screenWrap (sprite) {

}

function render() {

  //game.debug.body(sprite);
  //game.debug.body(ground);
}
