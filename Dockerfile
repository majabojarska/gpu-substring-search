FROM node:lts-alpine
RUN apk add --no-cache python make g++ libx11 libxext
WORKDIR app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build:prod
CMD npx http-server dist -p 2137