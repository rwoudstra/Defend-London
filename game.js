var io;
var gameSocket;
var setNum = 0;
var thisGameId = 1000;

exports.initGame = function(sio, socket){
  io = sio;
  gameSocket = socket;
  gameSocket.emit('connected', { message: "You are connected!" });
  gameSocket.on('hostCreateNewGame', hostCreateNewGame);
  gameSocket.on('playerJoinGame', playerJoinGame);
  gameSocket.on('pressButton', pressButton);
};

//player clicked button on Phonetroller
function pressButton(data) {
  io.sockets.in(data.gameId).emit('buttonClicked', data);
}

//The 'START' button was clicked and 'hostCreateNewGame' event was triggered.
function hostCreateNewGame() {
  // Create an unique game code
  thisGameId += Math.floor((Math.random() * 1000));
  //reset var to limit code length to 4 digits
  if ( thisGameId > 9999) {
    thisGameId = 1000;
  }
  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});
  // Join the Room and wait for the players
  this.join(thisGameId.toString());
}

//Player clicked start
function playerJoinGame(data) {
  //Increase player number everytime a new player joins
  setNum += 1;
  // Set limit+1 to reset var
  if(setNum === 3){
    setNum = 1;
  }
  //Set new data to include player number
  data = {
    gameId : data.gameId,
    playerName : data.playerName,
    pNumber : setNum
  };
  //Player's Socket.IO socket object
  var sock = this;
  // Look up the game code in the Socket.IO manager object.
  var room = gameSocket.manager.rooms["/" + data.gameId];
  // If the room exists...
  if( room !== undefined ){
    // attach the socket id to the data object.
    data.mySocketId = sock.id;
    // Join the room
    sock.join(data.gameId);
    //Run function 'playerJoinedRoom' on client side
    io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
  }
}
