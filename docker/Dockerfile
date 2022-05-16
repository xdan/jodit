FROM ubuntu:latest

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    bzip2 \
    libasound2-dev \
    libdbus-glib-1-dev \
    libgtk-3-dev \
    nodejs \
    npm \
    wget \
  && wget --no-verbose -O /tmp/firefox.tar.bz2 "https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US" \
	&& tar -C /opt -xjf /tmp/firefox.tar.bz2 \
	&& ln -fs /opt/firefox/firefox /usr/bin/firefox \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app
