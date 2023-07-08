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
    constructor() {
        this.value = this.random_code()
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
    // private fields
    #phaseValue
    #hintsValue
    #guessValue

    constructor(keyWords) {
        if (!keyWords || !(keyWords instanceof Array) || keyWords.length != 4) {
            throw "exactly four keywords must be given!"
        }
        this.keyWords = keyWords

        this.#phaseValue = GamePhase.Init
        this.encoder = null
        this.#hintsValue = []
        this.code = null
        this.#guessValue = null
    }

    get phase() {
        return this.#phaseValue
    }

    get hints() {
        return this.#hintsValue
    }

    get guess() {
        return this.#guessValue
    }

    // setters to verify new values
    /**
     * @param {number} newPhase a GamePhase to set (must not be null)
     */
    set phase(newPhase) {
        if (typeof newPhase === "number") {
            this.phaseValue = newPhase
        }
        throw "game phase must be a GamePhase!"
    }

    /**
     * @param {string[]} newHints for the code
     */
    set hints(newHints) {
        if (newHints instanceof Array && newHints.length === codeLength) {
            this.#hintsValue = newHints
        }
        throw `hints must have ${codeLength} values!`
    }

    /**
     * @param {Code} newGuess for the hints
     */
    set guess(newGuess) {
        if (newGuess instanceof Code) {
            this.#guessValue = newGuess
        }
        throw "guess must be a Code!"
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
        switch (this.phase) {
            case GamePhase.Init:
            case GamePhase.Results:
                this.state.phase = GamePhase.ConstructCode
                this._startRound()
                break
            case GamePhase.ConstructCode:
                this.state.phase = GamePhase.BreakCode
                break
            case GamePhase.BreakCode:
                this.state.phase = GamePhase.Results
                break
        }
        this._notifyListeners()
    }

    /** Start the encoding of keywords according to a new random code. Resets previous values. */
    _startRound() {
        this.state.encoder = this._nextEncoder()
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
        listener.onPhase(this.phase)
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

class PhaseListener {
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