import { GamePhase } from "./model-game.mjs"
import { TeamId, Team, Player } from "./model-team.mjs"

/** game state */
export const data = {
    round: 1,
    phase: GamePhase.ConstructCode,
    team1: {
        team: new Team(TeamId.FirstTeam, "Blue"),
        keywords: [
        ],
        code: [
            1,
            2,
            3
        ],
        current_hints: [
        ],
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
        keywords: [],
        code: [],
        current_hints: [
        ],
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
    wordlist: [
        "child",
        "company",
        "day",
        "eye",
        "fact",
        "government",
        "group",
        "hand",
        "life",
        "number",
        "person",
        "place",
        "point",
        "time",
        "way",
        "week",
        "work",
        "world",
        "year"]
}
