MF_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

IMAGE_NAME := ha-smart-switches

local-build:
	@cd $(MF_PATH); \
	\
	IMAGE_NAME=$(IMAGE_NAME) \
		bash scripts/docker-build.sh
.PHONY: local-build

local-run: local-build
	@cd $(MF_PATH)/local; \
	\
	IMAGE_NAME=$(IMAGE_NAME) \
		bash ../scripts/docker-run.sh
.PHONY: local-run
