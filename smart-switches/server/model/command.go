package model

import (
	"encoding/json"
	"fmt"
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
	fmt.Printf("Command.UnmarshalJSON: raw data = %s\n", str)

	if !strings.Contains(str, "{") {
		fmt.Printf("Command.UnmarshalJSON: treating as string\n")
		c.Cmd = str
		c.Color = []int{0, 0, 255}
		return nil
	}

	fmt.Printf("Command.UnmarshalJSON: treating as object\n")
	type base struct {
		Cmd   string `json:"cmd"`
		Color []int  `json:"color"`
	}

	var v base
	err := json.Unmarshal(data, &v)
	if err != nil {
		fmt.Printf("Command.UnmarshalJSON: error unmarshaling object: %v\n", err)
		return err
	}

	c.Cmd = v.Cmd
	c.Color = v.Color

	return nil
}
