const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);

var players = [];

app.use(express.static('..', { index: 'index.html' }))

io.on('connection', (socket) => {
    var player;
    console.log('a user connected');
    socket.on('player join', (playerName) => {
        console.log('joined: ' + playerName);
        player = playerName;
        players.push(playerName);
        io.emit("players", players);
    });
    socket.on('disconnect', () => {
        console.log('disconnected: ' + (player ? player : 'user'));
        const playerIndex = players.indexOf(player);
        players.splice(playerIndex, 1);
        io.emit("players", players);
    });
});

server.listen(12034, () => {
    console.log('listening on *:12034');
});
