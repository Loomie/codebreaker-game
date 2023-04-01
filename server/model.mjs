/** define sets of fixed values to have defined options from which to choose instead of "any number" */

export const GamePhase = {
    Init: 0,
    ConstructCode: 1,
    BreakCode: 2,
    Results: 3
}

export const TeamId = {
    FirstTeam: 1,
    SecondTeam: 2
}

export class Team {
    constructor(teamId) {
        this.id = teamId
        this.members = []
        this.correctOtherEncodings = 0
        this.failedOwnDecodings = 0
    }
}

export class Player {
    constructor(playerName) {
        this.id = crypto.randomUUID()
        this.playerName = playerName
    }
}

export class Code {
    constructor() {
        this.value = this.random_code()
    }

    /** @return three numbers in random order of the set one to four */
    random_code() {
        const randomNumbers = [1, 2, 3, 4].sort(function () { return 0.5 - Math.random() })
        return randomNumbers.slice(0, 3)
    }
}

/**
 * An EncodingGame holds the state and logic about encoding and decoding of key words for a single team. It manages the keywords, code, hints and guessed code. An EncodingGame cycles through GamePhases and has listeners to notify about changes.
 */
export class EncodingGame {
    constructor(keyWords, players) {
        if (!keyWords || !(keyWords instanceof Array) || keyWords.length != 4) {
            throw "exactly four keywords must be given!"
        }
        this.keyWords = keyWords
        if (!players || !(players instanceof Array) || players.length == 0) {
            throw "At least one player must play the game!"
        }
        this.players = players

        this.phase = GamePhase.Init
        this.encoder = null
        this.hints = []
        this.code = null
        this.guess = null
    }

    /** Switches from the current to the next phase and setups this state accordingly. */
    nextPhase() {
        switch (this.phase) {
            case GamePhase.Init:
            case GamePhase.Results:
                startRound()
                break
            case GamePhase.ConstructCode:
                this.phase = GamePhase.BreakCode
                break
            case GamePhase.BreakCode:
                this.phase = GamePhase.Results
                break
        }
    }

    /** Start the encoding of keywords according to a new random code. Resets previous values. */
    startRound() {
        this.phase = GamePhase.ConstructCode
        this.encoder = nextEncoder()
        this.hints = []
        this.code = new Code()
        this.guess = null
    }

    /** Set the encoder to the next player. If the last player in the list was the encoder the first player has the next turn. */
    nextEncoder() {
        // initially encoder is null which results in index -1 which is ok to increment
        const encoderIndex = this.players.indexOf(this.encoder)
        const nextIndex = (encoderIndex + 1) % this.players.length
        return this.players[nextIndex]
    }
}
