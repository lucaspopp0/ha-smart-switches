ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

COPY --from=go /usr/local/go /usr/local/go
ENV PATH "/usr/local/go/bin:$PATH"

RUN mkdir -p /smartswitches/server
RUN mkdir -p /smartswitches/site/public

COPY ./server /smartswitches/server
COPY ./site/public /smartswitches/site/public

WORKDIR /smartswitches/server
RUN CG_ENABLED=0 go build -o server .

COPY run.sh /
RUN chmod a+x /run.sh

ENV IMAGE_NAME $BUILD_FROM

# Persistent data directory
WORKDIR /data

# Expose port
EXPOSE 8000
CMD [ "/run.sh" ]
