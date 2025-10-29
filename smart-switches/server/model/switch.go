package model

import (
	"fmt"
)

type Switch struct {
	Layouts map[LayoutVersion]LayoutInstance `json:"layouts"`
}

func (s *Switch) GetCommand(layoutVersion LayoutVersion, key string) (*Command, error) {
	layout, ok := s.Layouts[layoutVersion]
	if !ok {
		return nil, fmt.Errorf("layout %q not configured", string(layoutVersion))
	}

	cmd, ok := layout.Buttons[key]
	if !ok {
		return nil, fmt.Errorf("command %q not configured for layout %q", key, string(layoutVersion))
	}

	return &cmd, nil
}
