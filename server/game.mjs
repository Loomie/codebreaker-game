import { GamePhase, TeamId, Team, EncodingGame } from "./model.mjs"

/** game state */
export const data = {
    round: 1,
    phase: GamePhase.ConstructCode,
    team1: {
        team: new Team(TeamId.FirstTeam, "A very Blue Team name"),
        encoding: new EncodingGame(['Auto', 'Haus', 'Schiff', 'Fenster'], this.team),
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
        encoding: new EncodingGame(['Baum', 'Fluss', 'Wolke', 'Bank'], this.team),
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
    }
}
