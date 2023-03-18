export default {
    props: {
        team1: Object
    },
    template: `
<main class="column-70" style="border-left: 1px solid #36363640; border-right: 1px solid #36363640;">
<article>
    <section class="columns">
        <div class="column-25">
            <div class="panel">
                <h1 class="panel-head">{{ team1.keywords[0] }}</h1>
                <p class="panel-block" v-for="code in team1.word1.hints">{{ code }}</p>
            </div>
        </div>
        <div class="column-25">
            <div class="panel">
                <h1 class="panel-head">{{ team1.keywords[1] }}</h1>
                <p class="panel-block" v-for="code in team1.word2.hints">{{ code }}</p>
            </div>
        </div>
        <div class="column-25">
            <div class="panel">
                <h1 class="panel-head">{{ team1.keywords[2] }}</h1>
                <p class="panel-block" v-for="code in team1.word3.hints">{{ code }}</p>
            </div>
        </div>
        <div class="column-25">
            <div class="panel">
                <h1 class="panel-head">{{ team1.keywords[3] }}</h1>
                <p class="panel-block" v-for="code in team1.word4.hints">{{ code }}</p>
            </div>
        </div>
    </section>
    <footer class="columns footer">
        <div class="column-50 center">
            <p>Wrong guesses of the own team:</p><span id="wrong-self-1">X</span><span
                id="wrong-self-2">O</span>
        </div>
        <div class="column-50 center">
            <p>Correct guesses of the enemy team:</p><span id="correct-others-1">O</span><span
                id="correct-others-2">O</span>
        </div>
    </footer>
</article>
<nav class="tabs center">
    <ul>
        <li class="is-active"><a id="team-select-a" href="#">Team A</a></li>
        <li><a id="team-select-b" href="#">Team B</a></li>
    </ul>
</nav>
</main>
`
}