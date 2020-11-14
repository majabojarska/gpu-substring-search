FROM node:lts-alpine
COPY dist dist
CMD npx http-server dist -p 2137