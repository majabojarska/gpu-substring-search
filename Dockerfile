FROM node:lts-alpine
WORKDIR app
COPY dist dist/
CMD npx http-server dist -p 2137