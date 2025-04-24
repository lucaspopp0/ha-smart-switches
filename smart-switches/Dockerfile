ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

WORKDIR /data

COPY --from=go /usr/local/go /usr/local/go
COPY site /data/site
COPY server /data/server

RUN find .

# Persistent data directory

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
