ARG BUILD_FROM
ARG GO_BASE

FROM golang:1.25 AS go

FROM $BUILD_FROM AS homeassistant

COPY --from=go /usr/local/go /usr/local/go
ENV PATH "/usr/local/go/bin:$PATH"

RUN mkdir -p /smartswitches/server
RUN mkdir -p /smartswitches/site/public

COPY ./server /smartswitches/server
COPY ./site/public /smartswitches/site/public

WORKDIR /smartswitches/server
RUN go get ./...
RUN CG_ENABLED=0 go build -o server .

COPY run.sh /
RUN chmod a+x /run.sh

# Persistent data directory
WORKDIR /data

# Expose port
EXPOSE 8000
CMD [ "/run.sh" ]

LABEL org.opencontainers.image.source=https://github.com/lucaspopp0/ha-smart-switches
LABEL org.opencontainers.image.description="Add-on for home assistant"
LABEL org.opencontainers.image.licenses=MIT
