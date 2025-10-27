FROM golang:1.25

# Install Delve debugger
RUN go install github.com/go-delve/delve/cmd/dlv@latest

RUN mkdir -p /smartswitches/server
COPY ./server /smartswitches/server

WORKDIR /smartswitches/server
RUN go get ./...
# Build with debug symbols for Delve
RUN CGO_ENABLED=0 go build -gcflags="all=-N -l" -o server .

COPY ./local/run.sh /
RUN chmod a+x /run.sh

# Persistent data directory
WORKDIR /data

# Expose application and debugger ports
EXPOSE 8124 2345
CMD [ "/run.sh" ]
