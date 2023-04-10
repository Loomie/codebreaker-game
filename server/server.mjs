import { GamePhase } from "./model-game.mjs"
import { TeamId, Team, Player } from "./model-team.mjs"
import express from 'express'
import { readFileSync } from 'fs'
import { createServer } from 'https'
import { Server } from "socket.io"

const app = express()
const server = createServer({
    key: readFileSync("privkey.pem"),
    cert: readFileSync("cert.pem")
}, app)
const io = new Server(server, {
    serveClient: false
})

/** game state */
const data = {
    round: 1,
    phase: GamePhase.ConstructCode,
    team1: {
        team: new Team(TeamId.FirstTeam, "Blue"),
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
        team: new Team(TeamId.SecondTeam, "Red"),
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
    var player = null
    console.log('a user connected')
    socket.emit('teamChanged', data.team1.team)
    socket.emit('teamChanged', data.team2.team)

    socket.on('player join', (playerName) => {
        console.log('joined: ' + playerName)
        player = new Player(playerName)

        const teamForPlayer = getTeamWithLessPlayers()
        teamForPlayer.addPlayer(player)
        io.emit("teamChanged", teamForPlayer)
    })

    socket.on('disconnect', () => {
        console.log('disconnected: ' + (player ? player.playerName : 'user'))
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
})

server.listen(12034, () => {
    console.log('listening on *:12034')
})

function getTeamWithLessPlayers() {
    const team1 = data.team1.team
    const team2 = data.team2.team
    if (team1.members.length <= team2.members.length) {
        return team1
    } else {
        return team2
    }
}