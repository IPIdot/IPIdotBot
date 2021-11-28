FROM node:alpine

RUN apk update && apk upgrade

RUN apk add --no-cache sqlite
