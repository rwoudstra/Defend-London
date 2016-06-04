var maxPlayers = 2;

window.onload = function(){
  detectDevice();
};

function detectDevice() {
  if(  /Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(navigator.userAgent) ){
    $('#gameLobbyMobile').show();
    //$('#phonetroller').show();
    //$('#controllerPlayerTwo').show();
  }else{
     //$('#gameArea').show();
     //startGame();
    // Testing game on pc: ^-- uncomment and comment the next three lines
	
	/*
$('#loadingScreen').show();
	App.Host.loading();
*/
	
App.Host.createGame();
    $('#gameLobbyDesktop').show();
    $('.background').show();

   
  }
}

var App;
var loading = 0;
var playerOneName;
var playerTwoName;

jQuery(function($){
  'use strict';
  var IO = {
    init: function() {
      IO.socket = io.connect();
      IO.bindEvents();
    },
    bindEvents : function() {
      IO.socket.on('connected', IO.onConnected );
      IO.socket.on('newGameCreated', IO.onNewGameCreated );
      IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom );
      IO.socket.on('buttonClicked', IO.buttonClicked );
    },
    onConnected : function() {
      App.mySocketId = IO.socket.socket.sessionid;
    },
    onNewGameCreated : function(data) {
      App.Host.gameInit(data);
    },
    playerJoinedRoom : function(data) {
      App[App.myRole].updateWaitingScreen(data);
    },
    buttonClicked: function (data) {
      App.Host.clickAction(data);
    }
  };

  App = {
    gameId: 0,
    playerName: '',
    myRole: '',
    mySocketId: '',
    init: function () {
      App.bindEvents();
      FastClick.attach(document.body);
    },
    controller: function (x,y) {
      App.$doc.on('touchstart', x, function(){ App.Player.button(y); });
      App.$doc.on('touchend', x, function(){ App.Player.button(y); });
    },
    bindEvents: function () {
      App.$doc = $(document);
      App.$doc.on('click', '#createButton', App.Host.createGame);
      App.$doc.on('click', '#joinGame',App.Player.onPlayerStartClick);

      // Controller functions
      // To add more buttons to the controller just use this function:
      // App.controller(UNIQUE_BUTTON_ID, UNIQUE_NUMBER);
      // UNIQUE_BUTTON_ID being the id of the button
      // and UNIQUE_NUMBER as an identifier
      // New buttons need to be added in app.host.cickAction too
      App.controller('#button1',1);
      App.controller('#button2',2);
      App.controller('#button3',3);
      App.controller('#button4',4);
      App.controller('#button5',5);
      App.controller('#button6',6);
    },

    Host : {
      players : [],
      playerActive : false,
      numPlayersInRoom: 0,
      createGame: function () {
        IO.socket.emit('hostCreateNewGame');
      },
      gameInit: function (data) {
        App.gameId = data.gameId;
        App.mySocketId = data.mySocketId;
        App.myRole = 'Host';
        App.Host.numPlayersInRoom = 0;
        App.Host.showCode();
      },
      showCode : function() {
        $('#introScreen').hide();
        $('#gameLobbyDesktop').show();
        $('#gameCode').html(App.gameId);
      },
      // Once the button has been received by the Host it will run the function
      // with the asigned identifier on the phonetroller.js file
      clickAction: function (data) {
        var cases = {
          1: button1,
          2: button2,
          3: button3,
          4: button4,
          5: button5,
          6: button6,
          0: joystick
        };
        if (cases[data.button]) {
          cases[data.button](data.pNum,data.player,data.angle);
        }
      },
      loading: function() {
        $('#loadingScreen').show();
        setInterval(function(){
          loading ++;
          $('#loadingBar').val(loading);
        },60);
        setTimeout(function(){
          $('#loadingScreen').hide();
          $('.background').hide();
          $('#gameArea').show();
          startGame();
        },10000);
        loading = 0;
      },
      cancelGame: function(){
        setTimeout(function(){
          if(App.Host.playerActive === false){
            location.reload();
          }
        },60000);
      },
      updateWaitingScreen: function(data) {
        App.Host.players.push(data);
        App.Host.numPlayersInRoom += 1;
        $('#temp_num').html(App.Host.numPlayersInRoom);
        if(App.Host.numPlayersInRoom == 1){
          playerOneName = data.playerName;
          $('#p1').html(playerOneName);
          App.Host.cancelGame();
        }else{
          playerTwoName = data.playerName;
          $('#p2').html(playerTwoName);
          App.Host.playerActive = true;
        }
        if (App.Host.numPlayersInRoom === maxPlayers) {
          $('#gameLobbyDesktop').hide();
          App.Host.loading();
        }
      }
    },

    Player : {
      setNum: 0,
      onPlayerStartClick: function() {
        $('#joinGame').html('Try again');
        var data = {
          gameId : $('#inputGameId').val(),
          playerName : $('#inputPlayerName').val() || 'Anonimous'
        };
        IO.socket.emit('playerJoinGame', data);
        App.myRole = 'Player';
        App.Player.myName = data.playerName;
      },

      updateWaitingScreen : function(data) {
        if(IO.socket.socket.sessionid === data.mySocketId){
          App.myRole = 'Player';
          App.gameId = data.gameId;
          App.setNum = data.pNumber;
          App.playerName = data.playerName;
          $('#gameLobbyMobile').hide();
          $('#phonetroller').show();

          if(App.setNum == 1){
            $('#controllerPlayerOne').show();

          }else{
            $('#controllerPlayerTwo').show();
            offset = $( "#joystick" ).offset();
          }
        }
      },

			//After a button is clicked, client prepares data of the button to send to host
      button: function(x,y) {
        var data = {
          gameId : App.gameId,
          player : App.Player.myName,
          pNum : App.setNum,
          button : x,
          angle : y
        };
        IO.socket.emit('pressButton', data);
      },
    }
  };

  IO.init();
  App.init();
}($));
