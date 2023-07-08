import { TeamId, Team, EncodingGame } from "./model.mjs"

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
    data.team1.encoding = new EncodingGame(keywords1, data.team1.team)
    data.team2.encoding = new EncodingGame(keywords2, data.team2.team)
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
