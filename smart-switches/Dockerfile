ARG BUILD_FROM

FROM $BUILD_FROM as homeassistant

RUN mkdir /smartswitches

COPY . /smartswitches

COPY run.sh /
RUN chmod a+x /run.sh

ENV IMAGE_NAME $BUILD_FROM

# Persistent data directory
WORKDIR /data


# Expose port
EXPOSE 8000
CMD [ "/run.sh" ]
