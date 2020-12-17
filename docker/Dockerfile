FROM ubuntu:20.10

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    firefox \
    nodejs \
    npm \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
