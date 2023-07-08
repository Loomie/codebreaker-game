import { TeamId, Team, EncodingGame, GamePhase, PhaseListener } from "./model.mjs"

/** game state */
export const data = {
    round: 1,
    team1: {
        team: new Team(TeamId.FirstTeam, "A very Blue Team name"),
        encoding: null,
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
        encoding: null,
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

}

export function initGame(keywords1, keywords2) {
    const encoding1 = new EncodingGame(keywords1, data.team1.team)
    const encoding2 = new EncodingGame(keywords2, data.team2.team)
    data.team1.encoding = encoding1
    data.team2.encoding = encoding2
    // TODO add listeners for network
    encoding1.addListener(new PhaseListener((phase) => console.debug(`encoding 1 phase is ${phase}`)))
    encoding2.addListener(new PhaseListener((phase) => console.debug(`encoding 2 phase is ${phase}`)))

    encoding1.nextPhase()
    encoding2.nextPhase()
}

export function receiveHints(player, hints) {
    const encoding1 = data.team1.encoding
    if (encoding1.state.phase == GamePhase.ConstructCode && encoding1.state.encoder == player) {
        console.log(`received new hints ${hints} from player ${player.playerName} for team1`)
        encoding1.state.hints = hints
        encoding1.nextPhase()
    } else {
        const encoding2 = data.team2.encoding
        if (encoding2.state.phase == GamePhase.ConstructCode && encoding2.state.encoder == player) {
            console.log(`received new hints ${hints} from player ${player.playerName} for team2`)
            encoding2.state.hints = hints
            encoding2.nextPhase()
        } else {
            console.log(`received hints ${hints} but current player is not encoder or wrong phase`)
        }
    }
}

export function getTeamWithLessPlayers() {
    const team1 = data.team1.team
    const team2 = data.team2.team
    if (team1.members.length <= team2.members.length) {
        return team1
    } else {
        return team2
    }
}
