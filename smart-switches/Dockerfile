ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

RUN mkdir /smartswitches


COPY --from=go /usr/local/go /usr/local/go
COPY . /smartswitches

WORKDIR /smartswitches/server
RUN go build -o server .

WORKDIR /data

# Persistent data directory

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
