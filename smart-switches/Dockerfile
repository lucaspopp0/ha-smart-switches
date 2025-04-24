ARG BUILD_FROM

FROM node:23 as node

WORKDIR /data

COPY server/* ./

RUN npm install
RUN npm run build

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

# Persistent data directory
WORKDIR /data

RUN mkdir site

COPY --from=node ./public/* ./site/*
COPY --from=go /usr/local/go /usr/local/go

COPY server/* ./server/

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
