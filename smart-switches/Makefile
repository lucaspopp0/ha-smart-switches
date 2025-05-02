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

generate-server-sdk:
	@rm -rf ./site/src/api; \
	\
	docker run --rm \
		--user $$(id -u) \
		-v $$(pwd)/site/src/api:/local \
		-v $$(pwd)/server/spec:/spec \
		openapitools/openapi-generator-cli:latest generate \
		-i /spec/openapi.yaml \
		-g typescript-axios \
		-o /local/ \
		--additional-properties="npmName=@smart-switches/server,npmVersion=0.0.0,paramNaming=original,modelPropertyNaming=original"
.PHONY: generate-server-sdk
