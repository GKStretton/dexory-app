# First stage: build stage
FROM golang:1.20 AS builder

WORKDIR /src

# doesn't fail if go.sum doesn't exist
COPY ./go.mod ./go.sum* ./

RUN go mod download

COPY . .

# this flag ensures binary is statically linked and will work in alpine
# -race doesn't work with the flag unfortunately, nor with basic alpine I think
# as it requires glibc but alpine uses musl libc
RUN CGO_ENABLED=0 go build -o /backend

# Second stage: production stage
# Here, 'alpine' is a lightweight Linux distribution
FROM alpine:latest AS production

# Install ca-certificates so application could make requests over HTTPS
# For future proofed sanity
RUN apk --no-cache add ca-certificates

# Copy the binary from the builder stage
COPY --from=builder /backend /backend

ENTRYPOINT ["/backend"]
