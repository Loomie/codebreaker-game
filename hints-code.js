export default {
    props: {
        team1: Object
    },
    template: `
<section class="column-15">
    <div class="columns">
        <div class="column-25">
            <div class="panel">
                <!-- Current 3-digit code -->
                <h1 class="panel-head">
                    <div class="code">
                        <span>{{ team1.code[0] }}</span>
                        <span>{{ team1.code[1] }}</span>
                        <span>{{ team1.code[2] }}</span>
                    </div>
                </h1>
                <!-- 1st line of the 3-digit code -->
                <div class="panel-block">
                <input type="text" id="hint1" :placeholder="team1.keywords[team1.code[0] - 1]">
                <input type="number" id="guess1" min="1" max="4">
                <input type="number" id="guessOthers1" min="1" max="4">
                </div>
                <!-- 2nd line of the 3-digit code -->
                <div class="panel-block">
                <input type="text" id="hint2" :placeholder="team1.keywords[team1.code[1] - 1]">
                <input type="number" id="guess2" min="1" max="4">
                <input type="number" id="guessOthers2" min="1" max="4">
                </div>
                <!-- 3rd line of the 3-digit code -->
                <div class="panel-block">
                <input type="text" id="hint3" :placeholder="team1.keywords[team1.code[2] - 1]">
                <input type="number" id="guess3" min="1" max="4">
                <input type="number" id="guessOthers3" min="1" max="4">
                </div>
                <!-- Button to submit -->
                <div class="panel-block">
                    <input type="button" class="button-submit" value="Submit">
                </div>
            </div>
        </div>
    </div>


</section>
`
}