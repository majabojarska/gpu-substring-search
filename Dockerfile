FROM node:lts-alpine
WORKDIR /app
COPY dist dist/
COPY docker docker
WORKDIR /app/docker
RUN npm install
CMD npm start