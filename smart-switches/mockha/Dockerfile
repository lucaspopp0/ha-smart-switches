# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /build

# Copy go workspace files from parent directory
COPY go.work ./

# Copy server module (dependency)
COPY server/go.mod server/go.sum ./server/
COPY server/ ./server/

# Copy mockha module
COPY mockha/go.mod mockha/go.sum ./mockha/
COPY mockha/ ./mockha/

# Build the binary
WORKDIR /build/mockha
RUN go mod download && \
    CGO_ENABLED=0 GOOS=linux go build -o /mockha .

# Runtime stage
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /mockha /mockha

EXPOSE 8123

ENTRYPOINT ["/mockha"]
CMD ["--port=8123"]
