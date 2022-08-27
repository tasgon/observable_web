FROM alpine:latest as build
RUN apk add --no-cache crystal shards sqlite-dev zlib-dev openssl-dev

WORKDIR /build
COPY shard.* .
COPY ./src ./src/

RUN shards build

# Run
FROM alpine:latest

RUN apk add --no-cache sqlite zlib openssl

WORKDIR /opt/server
COPY --from=build /build/bin/server .

CMD