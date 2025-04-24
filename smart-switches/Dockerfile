ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

RUN mkdir /smartswitches

WORKDIR /data

COPY --from=go /usr/local/go /usr/local/go
COPY . /smartswitches

# Persistent data directory

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
