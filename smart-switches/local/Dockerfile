FROM golang:1.24

RUN mkdir -p /smartswitches/server
COPY ./server /smartswitches/server

WORKDIR /smartswitches/server
RUN CG_ENABLED=0 go build -o server .

COPY ./local/run.sh /
RUN chmod a+x /run.sh

# Persistent data directory
WORKDIR /data

# Expose port
EXPOSE 8000
CMD [ "/run.sh" ]
