import { data, getTeamWithLessPlayers, initGame, receiveHints } from "./game.mjs"
import { PhaseListener, Player } from "./model.mjs"
import express from 'express'
import { readFileSync } from 'fs'
import { createServer } from 'https'
import { Server } from "socket.io"

const DEFAULT_PORT = 12034

const app = express()
app.use(express.static('..', { index: 'index.html' }))
// HTTPS server
const server = createServer({
    key: readFileSync("privkey.pem"),
    cert: readFileSync("cert.pem")
}, app)
const io = new Server(server, {
    serveClient: false
})

// Networking for players
io.on('connection', (socket) => {
    var player = null
    console.log('a user connected')
    socket.emit('teamChanged', data.team1.team)
    socket.emit('teamChanged', data.team2.team)

    socket.on('player join', (playerName) => {
        console.log(`joined: ${playerName}`)
        player = new Player(playerName)

        const teamForPlayer = getTeamWithLessPlayers()
        teamForPlayer.addPlayer(player)
        // tell all players that a new player joined
        io.emit("teamChanged", teamForPlayer)
        // tell player who she is and what team he joined
        socket.emit('updateSelf', player, teamForPlayer)
    })

    socket.on('disconnect', () => {
        console.log(`disconnected: ${player ? player.playerName : 'user'}`)
        if (player) {
            if (data.team1.team.removePlayer(player)) {
                io.emit("teamChanged", data.team1.team)
            }
            if (data.team2.team.removePlayer(player)) {
                io.emit("teamChanged", data.team2.team)
            }
            player.destroy()
            player = null
        }
    })

    // Networking for game
    socket.on('initGame', () => {
        console.log('init game')
        // TODO generate random keywords
        initGame(['Auto', 'Haus', 'Schiff', 'Fenster'], ['Baum', 'Fluss', 'Wolke', 'Bank'])
        // on phase change send game state to all clients
        data.team1.encoding.addListener(new PhaseListener(() => {
            io.emit('initGame', data)
        }))
        data.team2.encoding.addListener(new PhaseListener(() => {
            io.emit('initGame', data)
        }))
        // TODO remove keywords of opposing team for each player to prevent cheating
        io.emit('initGame', data)
    })

    socket.on('hints', (newHints) => {
        receiveHints(player, newHints)
    })
})

// start server
const port = process.env.CODEBREAKER_PORT || DEFAULT_PORT
server.listen(port, () => {
    console.log(`listening on *:${port}`)
})
