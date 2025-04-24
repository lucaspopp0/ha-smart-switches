ARG BUILD_FROM

FROM golang:1.24 as go

FROM $BUILD_FROM as homeassistant

COPY --from=go /usr/local/go /usr/local/go
COPY site site

# Persistent data directory
WORKDIR /data

ENV NODE_VERSION=23.11.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

RUN ls "$NVM_DIR/versions/node/v${NODE_VERSION}/bin"

WORKDIR /data/site
RUN "/root/.nvm/versions/node/v${NODE_VERSION}/bin/npm" install
RUN "/root/.nvm/versions/node/v${NODE_VERSION}/bin/npm" run build

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
