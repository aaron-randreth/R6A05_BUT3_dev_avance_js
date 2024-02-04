FROM node:lts-bullseye-slim

ARG ROOT=/home/node/app

RUN mkdir -p ${ROOT}/module \
	&& chown -R node:node ${ROOT}

WORKDIR ${ROOT}

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
