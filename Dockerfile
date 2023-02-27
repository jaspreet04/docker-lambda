FROM node:16-alpine3.16

RUN mkdir lambda

COPY . ./lambda

WORKDIR /lambda

CMD ["/bin/sh","start-dev.sh"]