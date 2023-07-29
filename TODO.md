Bugs
====

- don't log state in (client) console
- first round should not be guessable for other team
- reset code on round start (empty ui dropdowns)
- end game for both encryption games/teams
- fixed height of marks so team switcher is at fixed position
    - larger marks (4em)
- layout for smaller screens
    - maybe use smaller font and scale everything down?
    - see https://stackoverflow.com/a/21981672
- allow submit only if all fields are set (hints and guesses)
- code read-only if phase is not BREAK_CODE

Features
========

- display name of team instead of "enemy team"
- Version number
- limit rounds, "sudden death"
- display numbers 1 to 4 for the keywords
- free text input for key words of other team to collect own hints
- lobbies to enter player name and join teams
    - let users edit team name
- parallel games (rooms) with codes to join
- help/howto play

Ideas
=====

- second team name: "The most reddest team name"
- more than two teams
- more than four key words and corresponding other code length
- points for correct guesses of other teams code
- read states and results with https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#speech_synthesis to the user
- team chat
