/** define sets of fixed values to have defined options from which to choose instead of "any number" */

export const GamePhase = {
    ConstructCode: 1,
    BreakCode: 2,
}

export const TeamId = {
    FirstTeam: 1,
    SecondTeam: 2
}

export class Team {
    constructor(teamId) {
        this.id = teamId
        this.members = []

    }
}

export class Player {
    constructor(playerName) {
        this.id = crypto.randomUUID()
        this.playerName = playerName
    }
}
