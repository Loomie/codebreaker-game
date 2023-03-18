import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

/** define sets of fixed values to have defined options from which to choose instead of "any number" */

const GamePhase = {
    ConstructCode: 1,
    BreakCode: 2,
}

const TeamId = {
    FirstTeam: 1,
    SecondTeam: 2
}

/** construct Vue Application */
createApp({
    /** data which holds the state of the game */
    data() {
        return {
            round: 1,
            phase: GamePhase.ConstructCode,
            myTeamId: TeamId.FirstTeam,
            team1: {
                players: [
                    "dummy one",
                    "dumm three"
                ],
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
                players: [
                    "second dummy"
                ],
                keywords: [],
                code: [],
                current_hints: [
                ],
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
    },

    /** computed values based on data */
    computed: {
        myTeam() {
            if (this.myTeamId == TeamId.SecondTeam) {
                return this.team2;
            }
            return this.team1;
        },

        otherTeam() {
            if (this.myTeamId == TeamId.SecondTeam) {
                return this.team1;
            }
            return this.team2;
        }
    },

    /** functions that do something */
    methods: {
        /** @return a random word from the wordlist */
        random_word() {
            return this.random_item(this.wordlist);
        },

        /** @return a random item from the given array */
        random_item(items) {
            return items[Math.floor(Math.random() * items.length)];
        },

        /** @return a list with given count unique random words from the wordlist */
        unique_random_words(count) {
            const randomWords = []
            let nextword;
            for (let i = 0; i < count; i++) {
                let maxTries = 10;
                do {
                    nextword = this.random_word();
                    maxTries--;
                } while (randomWords.includes(nextword) && maxTries > 0);
                randomWords[i] = nextword
            }
            return randomWords;
        },

        /** @return three numbers in random order of the set one to four */
        random_code() {
            const randomNumbers = [1, 2, 3, 4].sort(function () { return 0.5 - Math.random() })
            return randomNumbers.slice(0, 3)
        }
    },

    /** lifecycle hooks for initialization */
    created() {
        this.team1.keywords = this.unique_random_words(4)
        this.team1.code = this.random_code()

        this.team2.keywords = this.unique_random_words(4)
        this.team2.code = this.random_code()
    }
}).mount('#app')