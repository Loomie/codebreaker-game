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
    constructor(teamId, name) {
        this.id = teamId
        this.name = name
        this.members = []
        this.correctOtherEncodings = 0
        this.failedOwnDecodings = 0
    }

    addPlayer(player) {
        if (player instanceof Player) {
            this.members.push(player)
        } else {
            throw "team members must be Players!"
        }
    }

    /** @returns true if the player was removed from this team, false if it was not a member */
    removePlayer(player) {
        if (player instanceof Player) {
            const playerIndex = this.members.indexOf(player)
            if (0 <= playerIndex && playerIndex < this.members.length) {
                this.members.splice(playerIndex, 1)
                return true
            }
            return false
        } else {
            throw "team members must be Players!"
        }
    }
}

const _playerIds = []
export class Player {
    constructor(playerName) {
        this.id = this.generateId()
        this.playerName = playerName
    }

    generateId() {
        var newId
        do {
            newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        } while (_playerIds.indexOf(newId) !== -1)
        _playerIds.push(newId)
        console.debug("created player id " + newId)
        return newId
    }

    destroy() {
        const idIndex = _playerIds.indexOf(this.id)
        if (0 <= idIndex && idIndex < _playerIds.length) {
            const removed = _playerIds.splice(idIndex, 1)
            console.debug("removed player id " + removed)
        }
        this.id = undefined
        this.playerName = undefined
    }
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
 * This is state holds all values about the encoding. These fields are visible for each player and used in the server (not necesseraly the same object). It is solely a data class without logic.
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

    // setters to verify new values
    /**
     * @param {number} newPhase a GamePhase to set (must not be null)
     */
    set phase(newPhase) {
        if (typeof newPhase === "number") {
            this.phase = newPhase
        }
        throw "game phase must be a GamePhase!"
    }

    /**
     * @param {string[]} newHints for the code
     */
    set hints(newHints) {
        if (newHints instanceof Array && newHints.length === codeLength) {
            this.hints = newHints
        }
        throw "guess must be a Code!"
    }

    /**
     * @param {Code} newGuess for the hints
     */
    set guess(newGuess) {
        if (newGuess instanceof Code) {
            this.guess = newGuess
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
        // initially encoder is null which results in index -1 which is ok to increment
        const players = this._team.members
        const encoderIndex = players.indexOf(this.encoder)
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