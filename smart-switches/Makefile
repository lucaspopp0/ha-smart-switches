SHELL := /bin/bash -e

MF_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

IMAGE_NAME := ha-smart-switches

tidy-server:
	@cd $(MF_PATH)/server; \
	go mod tidy; \
	go fmt ./...
.PHONY: tidy-server

build-server:
	@set -x; \
	cd $(MF_PATH); \
	\
	IMAGE_NAME=$(IMAGE_NAME) \
		bash scripts/build-server.sh
.PHONY: local-build

run-server: build-server
	@set -x; \
	cd $(MF_PATH)/local; \
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

build-site:
	@cd $(MF_PATH)/site && npm run build
.PHONY: run-site

run-site:
	@cd $(MF_PATH)/site && npm run develop
.PHONY: run-site

build-mockha:
	@cd mockha; \
	GOOS=linux go build -tags netgo -o mockha-linux; \
	DOCKER_BUILDKIT=1 docker build --quiet --tag lucaspopp0/mockha:latest .
.PHONY: build-mockha

run-mockha:
	@make build-mockha; \
	docker run --rm -p 8123:8123 lucaspopp0/mockha:latest
.PHONY: run-mockha
