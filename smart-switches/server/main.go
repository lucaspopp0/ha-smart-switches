package main

import (
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/api"
)

func main() {
	server := api.NewServer()
	server.Run()
}
