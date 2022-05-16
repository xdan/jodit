FROM ubuntu:latest

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    bzip2 \
    ca-certificates \
    libasound2-dev \
    libdbus-glib-1-dev \
    libgtk-3-dev \
    wget \
    xz-utils \
  && wget --no-verbose -O /tmp/firefox.tar.bz2 "https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US" \
	&& tar -C /opt -xjf /tmp/firefox.tar.bz2 \
	&& ln -fs /opt/firefox/firefox /usr/bin/firefox \
	&& rm /tmp/firefox.tar.bz2 \
	&& wget --no-verbose -O /tmp/node.tar.xz "https://nodejs.org/dist/v16.15.0/node-v16.15.0-linux-x64.tar.xz" \
	&& tar -C /opt -xJvf /tmp/node.tar.xz \
	&& mv /opt/node-v16.15.0-linux-x64 /opt/nodejs \
	&& rm /tmp/node.tar.xz \
	&& ln -fs /opt/nodejs/bin/node /usr/bin/node \
	&& ln -fs /opt/nodejs/bin/npm /usr/bin/npm \
  && adduser --disabled-password --shell /bin/bash --gecos "" jodit \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
