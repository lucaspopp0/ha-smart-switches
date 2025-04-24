ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

# Persistent data directory
WORKDIR /data

RUN mkdir site

ENV NODE_VERSION=23.11.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN node --version
RUN npm --version

RUN npm install

COPY --from=node ./public ./site
COPY --from=go /usr/local/go /usr/local/go

COPY server ./server

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
