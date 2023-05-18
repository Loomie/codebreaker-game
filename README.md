# codebreaker-game
Decrypto-like multiplayer online browser game

It uses [Vue.js](https://vuejs.org/) for reactive pages.

The current page can be seen here: https://loomie.github.io/codebreaker-game/

Later it may look roughly like this:
![mock of the ui](concepts/mock.png)

## Glossary

Code
: Three numbers that denote the position of a _keyword_ for which a _hint_ must be given. For example 312 means the first _hint_ must relate to the third _keyword_, second _hint_ is for the first _keyword_ and last _hint_ is for the second _keyword_.

Encoder
: The player who gives _hints_ in the current _round_.

Guess
: One number of the _code_. One _guess_ is given for each _hint_ to reconstruct the _code_ used by the _encoder_.

Hint
: A related word for a specific _keyword_. It describes/encodes one _keyword_ so the own team can _guess_ it but hopefully the other team can not.

Keyword
: One of the four fixed words for which _hints_ must be given to _guess_ them.

Round
: The game is played in multiple _rounds_. Each _round_ consists of multiple steps that are went through: A _code_ is generated for each team, _Encoder_ gives _hints_ for that _code_ to her team, each team _guesses_ the _code_ based on the _hints_ for both teams, the original _code_ is revealed and compared to the _guesses_ and finally the result is checked if the game ends or continues with the next _round_.

# Installation

To run the game a central server is needed. It hosts the web pages and connects the players.

## Requirements
For the server part [node.js](https://nodejs.org/) must be installed. For the development version `git` is recommended. But the files can be downloaded directly form GitHub.

As an alternate the server can be run with Docker. You need docker to be installed in this case. See below for instructions to run the game server.

## Setup
To setup the server just clone the git repository. Change to the folder `server` and initialize the project:

    npm install

You need a TLS (SSL) certificate for HTTP/2 (HTTPS). Put a link to your certificate chain and key file as `cert.pem` and `key.pem` in the folder `server/`.

You can configure on which port the server runs with the environment variable `CODEBREAKER_PORT` (default: 12034).

## Start

The server runs on port 12034 by default. So point your browser to `https://<yourserver>:12034/`. You can change the port by setting the environment variable `CODEBREAKER_PORT`.

### Background service (daemon)

It is recommended to manage the service with systemd. A template service file is included. You need to create a copy and modify the path and maybe user name.

    cd codebreaker-game/server
    cp codebreaker.service.template codebreaker.service
    nano codebreaker.service
    sudo ln -s codebreaker.service /etc/systemd/system/
    sudo systemctl daemon-reload
    # autostart on boot
    sudo systemctl enable codebreaker

Afterwards you can start and stop the service with

    sudo systemctl start codebreaker
    sudo systemctl stop codebreaker

### Foreground

To run the process in the foreground:

    cd codebreaker-game/server
    node server.mjs

### Background one shot

To run the process in the background just append an ampersand. To read the output redirect it into a log file:

    node server.mjs >server.log &

## Stop

To stop the service run `sudo systemctl stop codebreaker`. To stop the foreground server press CTRL + C.

## Recommendation
Use a separate user to run the process. For linux create a system user without a login (needs root privileges). You need to start the server with a privileged user who changes to the dedicated system user. That is what systemd does for you.

    # create system user
    adduser --system --group codebreakeruser
    # download game
    su -s /bin/sh -c 'git clone https://github.com/Loomie/codebreaker-game.git' - codebreakeruser
    # setup service as described above with the created user
    # start the server in background (one shot)
    systemctl start codebreaker

Instead of calling `su` for each step you can get an interactive shell with `su -s /bin/bash - codebreakeruser`

Use a free HTTPS certificate from [Let's Encrypt](https://letsencrypt.org/) by using [`certbot`](https://certbot.eff.org/) on your server. Because the game runs as a separate user you have to give it access to the private key. You have to change the group of the key file to your codebreakeruser (primary) group.

    # change group of private key and certificate files if your domain is 'example.com'
    chgrp -R codebreakeruser /etc/letsencrypt/archive/example.com
    # allow the group to read the private key
    chmod g+r /etc/letsencrypt/archive/example.com/privkey1.pem
    # tell codebreaker to use the letsencrypt files
    su -s /bin/sh -c 'cd codebreaker-game/server && ln -s /etc/letsencrypt/live/example.com/cert.pem cert.pem' - codebreakeruser
    su -s /bin/sh -c 'cd codebreaker-game/server && ln -s /etc/letsencrypt/live/outstare.de/privkey.pem privkey.pem' - codebreakeruser

## Docker

All the setup is done in a Docker container. It needs a certificate and private key for secure connections (HTTPS) as stated in the section "Setup".

To build the docker image locally run the following after your setup is done (in main folder of this project):

    docker build --rm -t codebreakergame:latest .

To run the docker image in a container you need to provide the certificate and key file. Also set a local port where the game is reachable, like 4321 below:

    docker run --init -d -v <your/path/to/privkey.pem>:/usr/games/codebreaker/server/privkey.pem -v <your/path/to/cert.pem>:/usr/games/codebreaker/server/cert.pem -p 4321:12034 --name codebreakergame codebreakergame:latest

Access the game on your machine like https://localhost:4321

To stop the so started container run

    docker stop codebreakergame

To start again:

    docker start codebreakergame
