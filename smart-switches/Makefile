MF_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

IMAGE_NAME := ha-smart-switches

build-server:
	@cd $(MF_PATH); \
	\
	IMAGE_NAME=$(IMAGE_NAME) \
		bash scripts/build-server.sh
.PHONY: local-build

run-server: build-server
	@cd $(MF_PATH)/local; \
	\
	IMAGE_NAME=$(IMAGE_NAME) \
		bash ../scripts/run-server.sh
.PHONY: local-run
