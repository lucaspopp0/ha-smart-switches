package main

import (
	"fmt"
	"os"

	"github.com/goccy/go-yaml"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/api"
)

func configVersion() (string, error) {
	configPath := "/smartswitches/config.yml"

	configBytes, err := os.ReadFile(configPath)
	if err != nil {
		return "", err
	}

	config := struct {
		version string `yaml:"version"`
	}{}

	err = yaml.Unmarshal(configBytes, &config)
	if err != nil {
		return "", err
	}

	return config.version, nil
}

func main() {
	version, err := configVersion()
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Printf("starting up... (%s)\n", version)

	server := api.NewServer(version)
	server.Run()
}
