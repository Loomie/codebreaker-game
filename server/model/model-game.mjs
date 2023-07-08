import { Team } from "./model-team.mjs"

/** define sets of fixed values to have defined options from which to choose instead of "any number" */
export const GamePhase = {
    Init: 0,
    ConstructCode: 1,
    BreakCode: 2,
    Results: 3
}

const codeLength = 3
export class Code {

    constructor(userCode) {
        if (userCode === undefined) {
            // called without parameter
            this.value = this.random_code()
        } else if (userCode instanceof Array && userCode.length === codeLength && userCode.every((value) => { return Number.isSafeInteger(value) })) {
            // called with array as parameter that contains only integers
            this.value = [...userCode] // create new array as clone/copy
        } else {
            // called with any other value as parameter
            throw `Invalid value for a Code: ${userCode}`
        }
    }

    /** @return three numbers in random order of the set one to four */
    random_code() {
        const randomNumbers = [1, 2, 3, 4].sort(function () { return 0.5 - Math.random() })
        return randomNumbers.slice(0, codeLength)
    }
}

/**
 * This state holds all values about the encoding. These fields are visible for each player and used in the server (not necesseraly the same object). It is solely a data class without logic.
 */
export class EncodingState {
    constructor(keyWords) {
        if (!keyWords || !(keyWords instanceof Array) || keyWords.length != 4) {
            throw "exactly four keywords must be given!"
        }
        this.keyWords = keyWords

        this.phase = GamePhase.Init
        this.encoder = null
        this.hints = []
        this.code = null
        this.guess = null
    }
}

/**
 * An EncodingGame holds a EncodingState and logic about encoding and decoding of key words for a single team. It manages the keywords, code, hints and guessed code. An EncodingGame cycles through GamePhases and has listeners to notify about changes.
 */
export class EncodingGame {
    constructor(keyWords, team) {
        this.state = new EncodingState(keyWords)
        if (!team || !(team instanceof Team) || team.members.length === 0) {
            throw "At least one player must play the game!"
        }
        this._team = team

        this._phaseListeners = []
    }

    /** Switches from the current to the next phase and setups this state accordingly. */
    nextPhase() {
        const currentPhase = this.state.phase
        switch (currentPhase) {
            case GamePhase.Init:
            case GamePhase.Results:
                console.debug(`switching phase from ${currentPhase} to ConstructCode for ${this._team.name}`)
                this.state.phase = GamePhase.ConstructCode
                this._startRound()
                break
            case GamePhase.ConstructCode:
                console.debug(`switching phase from ${currentPhase} to BreakCode for ${this._team.name}`)
                this.state.phase = GamePhase.BreakCode
                break
            case GamePhase.BreakCode:
                console.debug(`switching phase from ${currentPhase} to Results for ${this._team.name}`)
                this.state.phase = GamePhase.Results
                break
            default:
                throw `unkown game phase $currentPhase`
        }
        this._notifyListeners()
    }

    /** Start the encoding of keywords according to a new random code. Resets previous values. */
    _startRound() {
        this.state.encoder = this._nextEncoder()
        console.log(`encoder of round is ${this.state.encoder.playerName} for ${this._team.name}`)
        this.state.hints = []
        this.state.code = new Code()
        this.state.guess = null
    }

    /** Set the encoder to the next player. If the last player in the list was the encoder the first player has the next turn. */
    _nextEncoder() {
        const players = this._team.members
        // initially encoder is null which results in index -1 which is ok to increment
        const encoderIndex = players.indexOf(this.state.encoder)
        const nextIndex = (encoderIndex + 1) % players.length
        return players[nextIndex]
    }

    _notifyListeners() {
        this._phaseListeners.forEach(this._notifyListener, this)
    }

    _notifyListener(listener) {
        listener.onPhase(this.state.phase)
    }

    /**
    * @param {PhaseListener} listener
    */
    addListener(listener) {
        if (listener instanceof PhaseListener) {
            this._phaseListeners.push(listener)
        }
    }

    /**
    * @param {PhaseListener} listener
    */
    removeListener(listener) {
        if (listener instanceof PhaseListener) {
            const listenerIndex = this._phaseListeners.indexOf(listener)
            if (0 <= listenerIndex && listenerIndex < this._phaseListeners.length) {
                this._phaseListeners.splice(listenerIndex, 1)
            }
        }
    }
}

export class PhaseListener {
    constructor(callback) {
        if (typeof callback === "function") {
            this.callback = callback
        } else {
            throw "callback must be a function that accepts a GamePhase"
        }
    }

    onPhase(gamePhase) {
        this.callback(gamePhase)
    }
}