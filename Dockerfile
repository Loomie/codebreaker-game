# based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp
FROM node:lts

ENV CODEBREAKER_PORT=12034
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/games/codebreaker/server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY server/package*.json ./

RUN npm install

# building code for production
RUN npm ci --omit=dev

# Bundle app source
WORKDIR /usr/games/codebreaker
COPY . .

WORKDIR /usr/games/codebreaker/server
EXPOSE ${CODEBREAKER_PORT}
CMD [ "node", "server.mjs" ]