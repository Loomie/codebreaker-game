import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { io } from "https://unpkg.com/socket.io@4/client-dist/socket.io.esm.min.js"
import { Code, GamePhase, TeamId, Team, Player } from "./server/model.mjs"
import { wordlist } from "./server/wordlist.mjs"

/** construct Vue Application */
createApp({
    /** data which holds the state of the game */
    data() {
        return {
            version: '0.0.0',
            player: null,
            round: 1,
            myTeamId: TeamId.FirstTeam,
            visibleTeamId: this.myTeamId,
            team1: {
                team: new Team(TeamId.FirstTeam, "Blue"),
                phase: GamePhase.Init,
                keywords: [
                ],
                code: null,
                guess: [],
                current_hints: [
                    '', '', ''
                ],
                encoder: null,
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
                phase: GamePhase.Init,
                keywords: [],
                code: null,
                guess: [],
                current_hints: [
                ],
                encoder: null,
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
            _socket: null
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

        anyTeamNeedsPlayer() {
            // each team needs at least one encoder and one guesser
            return this.team1.team.members.length < 2 || this.team2.team.members.length < 2
        },

        visibleTeam() {
            if (this.visibleTeamId == TeamId.SecondTeam) {
                return this.team2
            }
            return this.team1
        },

        visibleCode() {
            if ((this.isEncoder && this.isOwnTeam) || this.visibleTeam.phase >= GamePhase.Results) {
                return (this.visibleTeam.code) ? this.visibleTeam.code.value : ['E', 'R', 'R']
            }
            return ["?", "?", "?"]
        },

        visibleGuess1: {
            get() {
                return (this.visibleTeam.guess[0]) ? this.visibleTeam.guess[0] : ''
            },

            set(newValue) {
                this.visibleTeam.guess[0] = newValue
            }
        },

        visibleGuess2: {
            get() {
                return (this.visibleTeam.guess[1]) ? this.visibleTeam.guess[1] : ''
            },

            set(newValue) {
                this.visibleTeam.guess[1] = newValue
            }
        },

        visibleGuess3: {
            get() {
                return (this.visibleTeam.guess[2]) ? this.visibleTeam.guess[2] : ''
            },

            set(newValue) {
                this.visibleTeam.guess[2] = newValue
            }
        },

        visibleHints() {
            return this.visibleTeam.current_hints
        },

        visibleKeywords() {
            if (this.isOwnTeam) {
                return this.visibleTeam.keywords
            }
            return ["****", "****", "****", "****"]
        },

        visiblePhaseName() {
            switch (this.visibleTeam.phase) {
                case GamePhase.AwaitOtherConfirmation:
                    return "Await Confirmation"
                case GamePhase.AwaitRemainingCode:
                    return "Await Code"
                case GamePhase.BreakCode:
                    return "Guess Code"
                case GamePhase.ConstructCode:
                    return "Encode Keywords"
                case GamePhase.End:
                    return "End"
                case GamePhase.Init:
                    return "Initialization"
                case GamePhase.Results:
                    return "Results"
                default:
                    return "Unknown"
            }
        },

        visibleTeamName() {
            return this.visibleTeam.team.name
        },

        isEncoder() {
            return this.visibleTeam.encoder?.id == this.player?.id
        },

        submit_text() {
            switch (this.visibleTeam.phase) {
                case GamePhase.Init:
                    return this.anyTeamNeedsPlayer ? 'Wait for Players' : 'Start'
                case GamePhase.BreakCode:
                    return 'Guess Code'
                case GamePhase.AwaitRemainingCode:
                    return 'Wait'
                case GamePhase.ConstructCode:
                    return this.isEncoder ? 'Give Hints' : 'Wait for Hints'
                case GamePhase.Results:
                    return 'Confirm Result'
                case GamePhase.End:
                    return 'End'
                case GamePhase.AwaitOtherConfirmation:
                default:
                    return 'Wait'
            }
        },

        /** @returns true if the submit button is disabled */
        is_submit_disabled() {
            switch (this.visibleTeam.phase) {
                case GamePhase.Init:
                    return this.anyTeamNeedsPlayer
                case GamePhase.BreakCode:
                    return this.isEncoder
                case GamePhase.AwaitRemainingCode:
                    return true
                case GamePhase.ConstructCode:
                    return !this.isEncoder
                case GamePhase.Results:
                    return false
                case GamePhase.AwaitOtherConfirmation:
                case GamePhase.End:
                default:
                    return true
            }
        },

        hintPlaceholder() {
            if (this.isOwnTeam && this.isEncoder) {
                const placeholders = []
                for (let index = 0; index < this.myTeam.code.value.length; index++) {
                    const codePart = this.myTeam.code.value[index]
                    const placeholder = `Encrypt "${this.myTeam.keywords[codePart - 1]}"`
                    placeholders.push(placeholder)
                }
                return placeholders
            }
            return ["", "", ""].fill("Wait for hint")
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

        /** @returns all CSS classes for a player in the player list depending on the game state */
        playerCss(aPlayer) {
            let classNames = ''
            if (aPlayer.id === this.player?.id) {
                classNames = classNames.concat('self')
            }
            if (this.team1.team.members.indexOf(aPlayer) !== -1) {
                if (this.team1.encoder?.id === aPlayer.id) {
                    classNames = classNames.concat(' encoder')
                }
            } else if (this.team2.team.members.indexOf(aPlayer) !== -1) {
                if (this.team2.encoder?.id === aPlayer.id) {
                    classNames = classNames.concat(' encoder')
                }
            }
            return classNames
        },

        /** @return a random word from the wordlist */
        random_word(words) {
            return this.random_item(words)
        },

        /** @return a random item from the given array */
        random_item(items) {
            return items[Math.floor(Math.random() * items.length)]
        },

        /** @return a list with given count unique random words from the wordlist */
        unique_random_words(count) {
            const availableWords = wordlist()
            const randomWords = []
            let nextword
            for (let i = 0; i < count; i++) {
                let maxTries = 10
                do {
                    nextword = this.random_word(availableWords)
                    maxTries--
                } while (randomWords.includes(nextword) && maxTries > 0)
                randomWords[i] = nextword
            }
            return randomWords
        },

        guessChanged() {
            console.debug('broadcasting guess to all clients')
            this._socket.volatile.emit('guess changed', this.myTeamId, this.team1.guess, this.team2.guess)
        },

        submit() {
            switch (this.visibleTeam.phase) {
                case GamePhase.Init:
                    this.initGame()
                    break
                case GamePhase.BreakCode:
                    this.submit_guess()
                    break
                case GamePhase.ConstructCode:
                    this.submit_hints()
                    break
                case GamePhase.Results:
                    this.submit_results()
                    break
                default:
                    console.warn(`no submit expected in phase ${this.visibleTeam.phase}`)
            }
        },

        initGame() {
            this.sendGameEvent('initGame')
        },

        submit_guess() {
            this.sendGameEvent('submit guess', this.visibleTeamId, this.visibleTeam.guess)
            console.log(`submitted guess: ${this.visibleTeam.guess}`)
        },

        submit_hints() {
            this.sendGameEvent('hints', this.myTeam.current_hints)
            console.log(`submitted hints: ${this.myTeam.current_hints}`)
        },

        submit_results() {
            this.sendGameEvent('confirm result')
            console.log(`confirmed result`)
        },

        sendGameEvent(eventName, ...eventArguments) {
            this._socket.emit(eventName, ...eventArguments)
        },

        updateState(gameData) {
            this.round = gameData.round
            this.copyState(this.team1, gameData.team1)
            this.copyState(this.team2, gameData.team2)
            console.info('Game state synced')
        },

        copyState(localTeam, remoteTeam) {
            localTeam.word1.hints = remoteTeam.word1.hints
            localTeam.word2.hints = remoteTeam.word2.hints
            localTeam.word3.hints = remoteTeam.word3.hints
            localTeam.word4.hints = remoteTeam.word4.hints

            localTeam.team.failedOwnDecodings = remoteTeam.team.failedOwnDecodings
            localTeam.team.correctOtherEncodings = remoteTeam.team.correctOtherEncodings

            const remoteEncoding = remoteTeam.encoding.state
            const isSamePhase = localTeam.phase === remoteEncoding.phase
            if (GamePhase.AwaitRemainingCode === remoteEncoding.phase && !remoteEncoding.guess[this.myTeamId]) {
                // if awaiting own guess say player that she has to break the code
                localTeam.phase = GamePhase.BreakCode
            } else {
                localTeam.phase = remoteEncoding.phase
            }
            if (remoteEncoding.hints.length === 0 && isSamePhase) {
                // keep local hints if encoder is still encoding and no hints are known by the server yet
            } else {
                localTeam.current_hints = remoteEncoding.hints
            }
            localTeam.code = remoteEncoding.code
            localTeam.keywords = remoteEncoding.keyWords
            localTeam.encoder = remoteEncoding.encoder
            localTeam.guess = remoteEncoding.guess[this.myTeamId]?.value ?? localTeam.guess
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
        this._socket = socket
        // variables to use in network handlers
        const data = this
        const team1 = this.team1
        const team2 = this.team2

        socket.on('version', function (gameVersion) {
            console.info(`game version ${gameVersion}`)
            data.version = gameVersion
        })
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
        socket.on('initGame', (gameData) => {
            //console.info(`received game data ${JSON.stringify(gameData)}`)
            data.updateState(gameData)
        })
        socket.on('guess changed', (forTeamId, team1Guess, team2Guess) => {
            if (data.myTeamId === forTeamId) {
                console.debug('received current guesses')
                team1.guess = team1Guess
                team2.guess = team2Guess
            }
        })

        // connect player to server
        const playerName = prompt("What's your name?", "your name")
        socket.emit("player join", playerName)
    }
}).mount('#app')
