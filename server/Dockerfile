# based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp
FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# building code for production
RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 12034
CMD [ "node", "server.mjs" ]