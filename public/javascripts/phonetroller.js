// Prevent accidently selecting buttons
$('.no-select').attr('unselectable','on').css({
  '-moz-user-select':'none',
  '-o-user-select':'none',
  '-khtml-user-select':'none', /* you could also put this in a class */
  '-webkit-user-select':'none',/* and add the CSS class here instead */
  '-ms-user-select':'none',
  'user-select':'none'
}).bind('selectstart', function(){ return false; });

//Define vars to send to monkeyEscape.js
var paddleLeft;
var paddleRight;
var throwBanana;
var throwAngle;

var turretLeft;
var turretRight;
var turretFire;

//Functions executed when pressing a button on the Phonetroller - x = player number & y = player name & z = angle of joystick
function throwSound() {
  var audio = document.getElementById('audio1');
  if (audio.paused) {
    audio.play();
  }else{
    audio.currentTime = 0;
  }
}

function paddleSound() {
  var audio = document.getElementById('audio2');
  if (audio.paused) {
    audio.play();
  }else{
    audio.currentTime = 0;
  }
}

//Left paddle//
function button1(x) {
  if(paddleLeft === true){
    paddleLeft = false;
  }else{
    paddleLeft = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
  //paddleSound();
}

// right paddle //
function button2(x) {
  if(paddleRight === true){
    paddleRight = false;
  }else{
    paddleRight = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
  //paddleSound();
}

// throw bomb 
function button3(x) {
  if(throwBanana === true){
    throwBanana = false;
  }else{
    throwBanana = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
  //throwSound();
}

//Left turret
function button4(x) {
  if(turretLeft === true){
    turretLeft = false;
  }else{
    turretLeft = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
}

// right turret
function button5(x) {
  if(turretRight === true){
    turretRight = false;
  }else{
    turretRight = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
}

// fire turret
function button6(x) {
  if(turretFire === true){
    turretFire = false;
  }else{
    turretFire = true;
  }
  if(gameOver && sec <= 14) {
    restartGame();
  }
}

// down btn //
function joystick(x,y,z) {
  throwAngle = z;
}
