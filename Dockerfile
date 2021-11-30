FROM node:bullseye

RUN apt-get update && apt-get upgrade

RUN apt-get install sqlite3 libsqlite3-dev
