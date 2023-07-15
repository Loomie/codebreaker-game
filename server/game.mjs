import { TeamId, Team, Code, EncodingGame, GamePhase, PhaseListener } from "./model.mjs"
import { wordlist } from "./wordlist.mjs"

/** game state */
export const data = {
    round: 1,
    team1: {
        team: new Team(TeamId.FirstTeam, "A very Blue Team name"),
        encoding: null,
        word1: {
            hints: []
        },
        word2: {
            hints: []
        },
        word3: {
            hints: []
        },
        word4: {
            hints: []
        }
    },
    team2: {
        team: new Team(TeamId.SecondTeam, "Red"),
        encoding: null,
        word1: {
            hints: []
        },
        word2: {
            hints: []
        },
        word3: {
            hints: []
        },
        word4: {
            hints: []
        }
    },

}

export function initGame() {
    const randomKeywords = unique_random_words(8)
    const keywords1 = randomKeywords.slice(0, 4)
    const keywords2 = randomKeywords.slice(4, 8)

    const encoding1 = new EncodingGame(keywords1, data.team1.team, data.team2.team)
    const encoding2 = new EncodingGame(keywords2, data.team2.team, data.team1.team)
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

export function receiveGuess(player, forTeamId, guess) {
    const guessNumbers = guess.map((value) => parseInt(value))
    const guessCode = new Code(guessNumbers)
    const guessFromTeam = data.team1.team.hasPlayer(player) ? data.team1.team.id : data.team2.team.id

    if (TeamId.FirstTeam === forTeamId) {
        const encoding1 = data.team1.encoding
        processGuess(encoding1, guess, player.playerName, guessFromTeam, guessCode, forTeamId)
    } else if (TeamId.SecondTeam === forTeamId) {
        const encoding2 = data.team2.encoding
        processGuess(encoding2, guess, player.playerName, guessFromTeam, guessCode, forTeamId)
    } else {
        console.warn(`received guess for invalid team id: ${forTeamId}`)
    }
}

function processGuess(encodingGame, guess, playerName, guessFromTeam, guessCode, forTeamId) {
    if (encodingGame.state.phase == GamePhase.BreakCode) {
        console.log(`received new guess ${guess} from player ${playerName} in team ${guessFromTeam} for team${forTeamId}`)
        encodingGame.state.guess[guessFromTeam] = guessCode
        const otherTeamId = TeamId.other(guessFromTeam)
        if (encodingGame.state.guess[otherTeamId]) {
            encodingGame.nextPhase()
        } else {
            console.debug(`waiting for guess of other team before proceeding`)
        }
    } else {
        console.log(`received guess ${guess} but wrong phase: ${encodingGame.state.phase}`)
    }
}

// remembers which team has finished which round and wants to proceed to the next round
const readyRound = { team1: 0, team2: 0 }

export function nextRound(player) {
    const encoding1 = data.team1.encoding
    const encoding2 = data.team2.encoding
    if (encoding1.state.phase == GamePhase.Results && data.team1.team.hasPlayer(player)) {
        console.log(`next round from player ${player.playerName} for team1`)
        readyRound.team1 = data.round
        copyHints(encoding1, data.team1)
    } else {
        if (encoding2.state.phase == GamePhase.Results && data.team2.team.hasPlayer(player)) {
            console.log(`next round from player ${player.playerName} for team2`)
            readyRound.team2 = data.round
            copyHints(encoding2, data.team2)
        } else {
            console.log(`next round but wrong phase`)
        }
    }
    // check if both teams are ready
    if (readyRound.team1 === data.round && readyRound.team2 === data.round) {
        data.round += 1
        encoding1.nextPhase()
        encoding2.nextPhase()
    }
}

function copyHints(encoding, dataTeam) {
    for (let index = 0; index < encoding.state.code.value.length; index++) {
        const codeDigit = encoding.state.code.value[index]
        const hint = encoding.state.hints[index]
        let hints
        switch (codeDigit) {
            case 1:
                hints = dataTeam.word1.hints
                break
            case 2:
                hints = dataTeam.word2.hints
                break
            case 3:
                hints = dataTeam.word3.hints
                break
            case 4:
                hints = dataTeam.word4.hints
                break
            default:
                throw new Error(`unexpected part of code: ${codeDigit}`)
        }
        hints.push(hint)
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


/** @return a random word from the given list of words */
function random_word(words) {
    return random_item(words)
}

/** @return a random item from the given array */
function random_item(items) {
    return items[Math.floor(Math.random() * items.length)]
}

/** @return a list with given count unique random words from the wordlist */
function unique_random_words(count) {
    const availableWords = wordlist()
    const randomWords = []
    let nextword
    for (let i = 0; i < count; i++) {
        let maxTries = 10
        do {
            nextword = random_word(availableWords)
            maxTries--
            // prevent duplicate keywords
        } while (randomWords.includes(nextword) && maxTries > 0)
        randomWords[i] = nextword
    }
    return randomWords
}
