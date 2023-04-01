import { GamePhase, TeamId } from "./model.mjs"
import express from 'express'
import http from 'http'
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    serveClient: false
})

/** game state */
const data = {
    round: 1,
    phase: GamePhase.ConstructCode,
    team1: {
        name: "Blue",
        players: [],
        keywords: [
        ],
        code: [
            1,
            2,
            3
        ],
        current_hints: [
        ],
        word1: {
            hints: [
                "Code 1",
                "Haus",
                "Kreuzfahrtschiff",
                "Grübeln",
                "Code 5",
                "Code 6",
                "Code 7",
                "Code 8"
            ]
        },
        word2: {
            hints: [
                "Code 1",
                "Code 2"
            ]
        },
        word3: {
            hints: [
                "Code 1",
                "Code 2",
                "Code 3"
            ]
        },
        word4: {
            hints: [
                "Code 1"
            ]
        }
    },
    team2: {
        name: "Red",
        players: [],
        keywords: [],
        code: [],
        current_hints: [
        ],
        word1: {
            hints: [
                "Dummy"
            ]
        },
        word2: {
            hints: []
        },
        word3: {
            hints: [
                "Something",
                "Word"
            ]
        },
        word4: {
            hints: []
        }
    },
    wordlist: [
        "child",
        "company",
        "day",
        "eye",
        "fact",
        "government",
        "group",
        "hand",
        "life",
        "number",
        "person",
        "place",
        "point",
        "time",
        "way",
        "week",
        "work",
        "world",
        "year"]
}

app.use(express.static('..', { index: 'index.html' }))

io.on('connection', (socket) => {
    var player
    console.log('a user connected')
    socket.on('player join', (playerName) => {
        console.log('joined: ' + playerName)
        player = playerName
        data.team1.players.push(playerName)
        io.emit("players", data.team1.players)
    })
    socket.on('disconnect', () => {
        console.log('disconnected: ' + (player ? player : 'user'))
        const playerIndex = data.team1.players.indexOf(player)
        data.team1.players.splice(playerIndex, 1)
        io.emit("players", data.team1.players)
    })
})

server.listen(12034, () => {
    console.log('listening on *:12034')
})
