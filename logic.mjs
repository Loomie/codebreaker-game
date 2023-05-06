import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { io } from "https://unpkg.com/socket.io@4/client-dist/socket.io.esm.min.js"
import { Code, GamePhase, TeamId, Team, Player } from "./server/model.mjs"
import { wordlist } from "./server/wordlist.mjs"

/** construct Vue Application */
createApp({
    /** data which holds the state of the game */
    data() {
        return {
            player: null,
            round: 1,
            phase: GamePhase.ConstructCode,
            myTeamId: TeamId.FirstTeam,
            visibleTeamId: this.myTeamId,
            team1: {
                team: new Team(TeamId.FirstTeam, "Blue"),
                keywords: [
                ],
                code: null,
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
                code: null,
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
            }
        }
    },

    /** computed values based on data */
    computed: {
        myTeam() {
            if (this.myTeamId == TeamId.SecondTeam) {
                return this.team2
            }
            return this.team1
        },

        isOwnTeam() {
            return this.visibleTeamId === this.myTeamId
        },

        visibleTeam() {
            if (this.visibleTeamId == TeamId.SecondTeam) {
                return this.team2
            }
            return this.team1
        },

        visibleCode() {
            if (this.isOwnTeam) {
                return this.visibleTeam.code.value
            }
            return ["?", "?", "?"]
        },

        visibleKeywords() {
            if (this.isOwnTeam) {
                return this.visibleTeam.keywords
            }
            return ["****", "****", "****", "****"]
        },

        visibleTeamName() {
            return this.visibleTeam.team.name
        },

        /** name of a CSS class for current team */
        teamFillClass() {
            return (this.visibleTeamId == TeamId.FirstTeam) ? "team1-fill" : "team2-fill"
        },
        teamFillActionClass() {
            return (this.visibleTeamId == TeamId.FirstTeam) ? "team1-fill-action" : "team2-fill-action"
        },
        teamBorderClass() {
            return (this.visibleTeamId == TeamId.FirstTeam) ? "team1-border" : "team2-border"
        }
    },

    /** functions that do something */
    methods: {
        showTeam1() {
            this.visibleTeamId = TeamId.FirstTeam
        },
        showTeam2() {
            this.visibleTeamId = TeamId.SecondTeam
        },

        /** @return a random word from the wordlist */
        random_word() {
            return this.random_item(wordlist)
        },

        /** @return a random item from the given array */
        random_item(items) {
            return items[Math.floor(Math.random() * items.length)]
        },

        /** @return a list with given count unique random words from the wordlist */
        unique_random_words(count) {
            const randomWords = []
            let nextword
            for (let i = 0; i < count; i++) {
                let maxTries = 10
                do {
                    nextword = this.random_word()
                    maxTries--
                } while (randomWords.includes(nextword) && maxTries > 0)
                randomWords[i] = nextword
            }
            return randomWords
        }
    },

    /** lifecycle hooks for initialization */
    created() {
        const randomKeywords = this.unique_random_words(8)

        // dummy values
        this.team1.team.members = [new Player("dummy one"), new Player("dummy three")]
        this.team2.team.members = [new Player("second dummy")]

        this.team1.keywords = randomKeywords.slice(0, 4)
        this.team1.code = new Code()

        this.team2.keywords = randomKeywords.slice(4, 8)
        this.team2.code = new Code()
    },

    mounted() {
        // init networking
        const socket = io()
        const data = this
        const team1 = this.team1
        const team2 = this.team2
        socket.on('teamChanged', function (changedTeam) {
            if (changedTeam.id === TeamId.FirstTeam) {
                team1.team = changedTeam
            } else if (changedTeam.id === TeamId.SecondTeam) {
                team2.team = changedTeam
            }
        })
        socket.on('updateSelf', function (myPlayer, myTeam) {
            console.info(`${myPlayer.id} ${myPlayer.playerName} joined team ${myTeam.id}`)
            data.player = myPlayer
            data.myTeamId = myTeam.id
            data.visibleTeamId = data.myTeamId
        })

        // init data
        const playerName = prompt("What's your name?", "your name")
        socket.emit("player join", playerName)
    }
}).mount('#app')