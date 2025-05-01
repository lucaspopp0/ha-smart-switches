package config

import (
	"encoding/json"
	"os"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/model"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

func configFile() string {
	return util.GetEnv("SWITCHES_JSON", "/data/switches.json")
}

type Config struct {
	Switches map[string]model.Switch `json:"switches"`
}

func FromFile() (*Config, error) {
	configBytes, err := os.ReadFile(configFile())
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

	file, err := os.OpenFile(configFile(), os.O_RDWR, os.ModeExclusive)
	if err != nil {
		return err
	}

	defer func() {
		err = file.Close()
		if err != nil {
			panic(err)
		}
	}()

	err = file.Truncate(0)
	if err != nil {
		return err
	}

	_, err = file.Write(configBytes)
	if err != nil {
		return err
	}

	return nil
}
