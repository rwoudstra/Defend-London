var express = require('express');
var path = require('path');
var app = express();
var game = require('./game');

// Turn down the logging activity
app.use(express.logger('dev'));

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));

// Create a Node.js based http server on port 80 (or 3000 for local testing)
var server = require('http').createServer(app).listen(80);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    game.initGame(io, socket);
    console.log("Server up and running. Go to http://127.0.0.1:3000");
});
