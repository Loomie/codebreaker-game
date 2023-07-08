import { avatars } from "../avatars.mjs"

/** define sets of fixed values to have defined options from which to choose instead of "any number" */
export const TeamId = {
    FirstTeam: 1,
    SecondTeam: 2
}

export class Team {
    constructor(teamId, name) {
        this.id = (teamId) ? teamId : TeamId.FirstTeam
        this.name = (name) ? name : "Team"
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

    /** @returns true if the given player is a memeber of this Team */
    hasPlayer(player) {
        if (player instanceof Player) {
            const playerIndex = this.members.indexOf(player)
            return playerIndex != -1

        }
        return false
    }
}

const _playerIds = []
export class Player {
    constructor(playerName) {
        this.id = this.generateId()
        this.playerName = (playerName) ? playerName : "Player"
        this.avatar = avatars.forName(this.playerName)
    }

    generateId() {
        var newId
        do {
            newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        } while (_playerIds.indexOf(newId) !== -1)
        _playerIds.push(newId)
        // console.debug(`created player id ${newId}`)
        return newId
    }

    destroy() {
        const idIndex = _playerIds.indexOf(this.id)
        if (0 <= idIndex && idIndex < _playerIds.length) {
            const removed = _playerIds.splice(idIndex, 1)
            // console.debug(`removed player id ${removed}`)
        }
        this.id = undefined
        this.playerName = undefined
    }
}
