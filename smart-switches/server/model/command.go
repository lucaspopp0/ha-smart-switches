package model

import (
	"encoding/json"
	"strings"
)

type commandMatcher interface {
	MatchesKey(key string) (command Command, ok bool)
}

type Command struct {
	Cmd   string `json:"cmd"`
	Color []int  `json:"color"`
}

var _ json.Unmarshaler = (*Command)(nil)

func (c *Command) UnmarshalJSON(data []byte) error {
	str := string(data)

	if !strings.Contains(str, "{") {
		c.Cmd = str
		c.Color = []int{0, 0, 255}
		return nil
	}

	type base struct {
		Cmd   string `json:"cmd"`
		Color []int  `json:"color"`
	}

	var v base
	err := json.Unmarshal(data, &v)
	if err != nil {
		return err
	}

	c.Cmd = v.Cmd
	c.Color = v.Color

	return nil
}
