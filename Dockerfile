FROM node:8.9.4

COPY . /dist

WORKDIR /dist

RUN npm install
RUN npm install pm2 -g
ENV DOCKER_ENV true
# CMD ["npm","run start:prod"]

EXPOSE 3000

CMD pm2-docker start dist/server.js