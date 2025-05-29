MF_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

IMAGE_NAME := ha-smart-switches

tidy-server:
	@cd $(MF_PATH)/server; \
	go mod tidy
.PHONY: tidy-server

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

generate-server-spec:
	@set -e; \
	\
	cd server; \
	rm -rf spec; \
	mkdir spec; \
	\
	go run . get-openapi \
		| yq -P -I2 -o=yaml '.' \
		> spec/openapi.yaml; \
	\
	git status -s -- spec
.PHONY: generate-server-spec

generate-server-sdk:
	@docker run --rm \
		--user $$(id -u) \
		-v $$(pwd)/site/src/api:/local \
		-v $$(pwd)/server/spec:/spec \
		openapitools/openapi-generator-cli:latest generate \
		-i /spec/openapi.yaml \
		-g typescript \
		-o /local/ \
		--additional-properties="npmName=@smart-switches/server,npmVersion=0.0.0,paramNaming=original,modelPropertyNaming=original"
.PHONY: generate-server-sdk
