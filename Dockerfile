FROM node:8.16.0-alpine

ADD www/ www/

WORKDIR www
ENTRYPOINT www/bin/www
