FROM node:8.9.0

COPY . /src

WORKDIR /src

ENV NODE_ENV production
RUN npm install --production

CMD ["npm","run start:prod"]

EXPOSE 3000