FROM node:9.11.1

COPY . /dist

WORKDIR /dist

RUN npm install -g npm@">=6.0.0 < 7.0.0"
RUN npm install
RUN npm install pm2 -g
ENV DOCKER_ENV true
# CMD ["npm","run start:prod"]

EXPOSE 3000

CMD pm2-docker start dist/server.js