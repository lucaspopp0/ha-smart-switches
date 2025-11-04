package config

import (
	"encoding/json"
	"os"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/model"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

const (
	envConfigFile     = "SWITCHES_JSON"
	defaultConfigFile = "/data/switches_v2.json"
)

func configFile() string {
	return util.GetEnv(envConfigFile, defaultConfigFile)
}

type Config struct {
	Switches map[string]model.Switch `json:"switches"`
}

func NewDefaultConfig() *Config {
	return &Config{
		Switches: map[string]model.Switch{},
	}
}

func FromFile() (*Config, error) {
	path := configFile()

	// Check if file exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// File doesn't exist, create default config
		defaultConfig := NewDefaultConfig()

		// Write default config to file
		if err := defaultConfig.WriteFile(); err != nil {
			return nil, err
		}

		return defaultConfig, nil
	}

	// File exists, read it
	configBytes, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	config := &Config{}
	err = json.Unmarshal(configBytes, &config)
	if err != nil {
		return nil, err
	}

	return config, nil
}

func (c *Config) WriteFile() error {
	configBytes, err := json.Marshal(c)
	if err != nil {
		return err
	}

	// Use O_CREATE to create file if it doesn't exist, O_TRUNC to truncate if it does
	file, err := os.OpenFile(configFile(), os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}

	defer func() {
		err = file.Close()
		if err != nil {
			panic(err)
		}
	}()

	_, err = file.Write(configBytes)
	if err != nil {
		return err
	}

	return nil
}
