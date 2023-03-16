export default {
    props: {
        team1: Object,
        team2: Object,
        round: Number
    },
    template: `
<aside class="column-15">
    <h1 class="title">Teams</h1>
    <p class="menu-label">Blue:</p>
    <ul class="menu-list">
        <li v-for="player in team1.players">{{ player }} 🧑</li>
    </ul>
    <p class="menu-label">Red:</p>
    <ul class="menu-list">
        <li v-for="player in team2.players">{{ player }} 🔑</li>
    </ul>
    <br>
        <h1 class="title">Status</h1>
        <p class="menu-label">Round: {{ round }}</p>
</aside>
`
}