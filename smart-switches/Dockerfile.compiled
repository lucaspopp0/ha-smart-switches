ARG BUILD_FROM

FROM $BUILD_FROM as homeassistant

RUN mkdir -p /smartswitches/server
RUN mkdir -p /smartswitches/site/public

COPY ./server/server /smartswitches/server
COPY ./site/public /smartswitches/site/public

COPY run.sh /
RUN chmod a+x /run.sh

ENV IMAGE_NAME $BUILD_FROM

# Persistent data directory
WORKDIR /data

# Expose port
EXPOSE 8000
CMD [ "/run.sh" ]
