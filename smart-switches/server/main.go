package main

import (
	"fmt"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/api"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
)

type GetConfigResponse struct {
	Body config.Config
}

type GetSiteResponse struct {
	Body []byte
}

type PutConfigRequest struct {
	Body config.Config
}

func main() {
	fmt.Println("starting up")
	server := api.NewServer()
	server.Run()
}
