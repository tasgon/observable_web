FROM alpine:latest as build
RUN apk add --no-cache crystal shards sqlite-dev zlib-dev openssl-dev libcrypto3 libpq-dev

WORKDIR /build
COPY shard.* .
RUN shards install

COPY ./src ./src/
RUN shards build

# Run
FROM alpine:latest

RUN apk add --no-cache gc pcre libevent libpq sqlite-libs zlib libssl3 libcrypto3 gmp bash

WORKDIR /opt/server
COPY --from=build /build/bin/server .
COPY run .

CMD ["bash", "./run"]