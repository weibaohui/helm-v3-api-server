FROM node:14.0.0
MAINTAINER paas-admin@paas.com

# cd to /usr/src
WORKDIR /usr/src

## Install Helm
COPY helm /usr/bin/helm
ENV HELM_BINARY="/usr/bin/helm"

## Install helm-api module
COPY package.json /usr/src
COPY index.js /usr/src
COPY service /usr/src/service
COPY config /usr/src/config
RUN npm install

ENV LANG zh_CN.UTF-8

COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

CMD [ "/startup.sh" ]
