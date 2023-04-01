import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { io } from "https://unpkg.com/socket.io@4/client-dist/socket.io.esm.min.js"
import { GamePhase, TeamId, Team, Player, Code, EncodingState } from "./server/model.mjs"

/** construct Vue Application */
createApp({
    /** data which holds the state of the game */
    data() {
        return {
            playerName: "your name",
            round: 1,
            phase: GamePhase.ConstructCode,
            myTeamId: TeamId.FirstTeam,
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
    },

    /** computed values based on data */
    computed: {
        myTeam() {
            if (this.myTeamId == TeamId.SecondTeam) {
                return this.team2
            }
            return this.team1
        },

        otherTeam() {
            if (this.myTeamId == TeamId.SecondTeam) {
                return this.team1
            }
            return this.team2
        },

        /** name of a CSS class for current team */
        teamFillClass() {
            return (this.myTeamId == TeamId.FirstTeam) ? "team1-fill" : "team2-fill"
        },
        teamFillActionClass() {
            return (this.myTeamId == TeamId.FirstTeam) ? "team1-fill-action" : "team2-fill-action"
        },
        teamBorderClass() {
            return (this.myTeamId == TeamId.FirstTeam) ? "team1-border" : "team2-border"
        }
    },

    /** functions that do something */
    methods: {
        moveToTeam1() {
            this.myTeamId = TeamId.FirstTeam
        },
        moveToTeam2() {
            this.myTeamId = TeamId.SecondTeam
        },

        /** @return a random word from the wordlist */
        random_word() {
            return this.random_item(this.wordlist)
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
        },

        /** @return three numbers in random order of the set one to four */
        random_code() {
            const randomNumbers = [1, 2, 3, 4].sort(function () { return 0.5 - Math.random() })
            return randomNumbers.slice(0, 3)
        }
    },

    /** lifecycle hooks for initialization */
    created() {
        const randomKeywords = this.unique_random_words(8)

        // dummy values
        this.team1.team.members = [new Player("dummy one"), new Player("dummy three")]
        this.team2.team.members = [new Player("second dummy")]

        this.team1.keywords = randomKeywords.slice(0, 4)
        this.team1.code = this.random_code()

        this.team2.keywords = randomKeywords.slice(4, 8)
        this.team2.code = this.random_code()
    },

    mounted() {
        // init networking
        const socket = io()
        const team1 = this.team1
        socket.on('players', function (currentPlayers) {
            team1.team.members = currentPlayers
        })

        // init data
        this.playerName = prompt("What's your name?", this.playerName)
        socket.emit("player join", this.playerName)
    }
}).mount('#app')