package model

import (
	"encoding/json"
	"fmt"
)

type Layouts struct {
	V4 *LayoutV4 `json:"v4,omitempty"`
	V5 *LayoutV5 `json:"v5,omitempty"`
	V6 *LayoutV6 `json:"v6,omitempty"`
	V7 *LayoutV7 `json:"v7,omitempty"`
}

func (l Layouts) GetLayout(name string) (Layout, error) {
	var layout Layout
	switch name {
	case "v4":
		layout = l.V4
	case "v5":
		layout = l.V5
	case "v6":
		layout = l.V6
	case "v7":
		layout = l.V7
	}

	if layout == nil {
		return nil, fmt.Errorf("layout %v not configured", name)
	}

	return layout, nil
}

func (l Layouts) GetMapping(layoutName string, key string) (*string, error) {
	layout, err := l.GetLayout(layoutName)
	if err != nil {
		return nil, err
	}

	return layout.GetMapping(key)
}

type Layout interface {
	GetMapping(key string) (*string, error)
}

type LayoutV4 struct {
	OnOff
	EightButtons
}

var _ Layout = (*LayoutV4)(nil)

func (v4 *LayoutV4) GetMapping(key string) (*string, error) {
	jsonLayout, err := json.Marshal(v4)
	if err != nil {
		return nil, err
	}

	mapping := map[string]string{}
	err = json.Unmarshal(jsonLayout, &mapping)
	if err != nil {
		return nil, err
	}

	if value, ok := mapping[key]; ok {
		return &value, nil
	}

	return nil, fmt.Errorf("unknown key %q", key)
}

type LayoutV5 struct {
	OnOff
	FourButtons
	WheelRoutines
	Flippable
}

var _ Layout = (*LayoutV5)(nil)

func (v6 *LayoutV6) GetMapping(key string) (*string, error) {
	if key == "wheel-routines" {
		return nil, fmt.Errorf("invalid key %q", key)
	}

	jsonLayout, err := json.Marshal(v6)
	if err != nil {
		return nil, err
	}

	mapping := map[string]string{}
	err = json.Unmarshal(jsonLayout, &mapping)
	if err != nil {
		return nil, err
	}

	if value, ok := mapping[key]; ok {
		return &value, nil
	}

	for _, routine := range v6.WheelRoutines.WheelRoutines {
		if routine.Name == key {
			return &routine.Command, nil
		}
	}

	return nil, fmt.Errorf("unknown key %q", key)
}

type LayoutV6 = LayoutV5

var _ Layout = (*LayoutV6)(nil)

type LayoutV7 struct {
	OnOff
	EightButtons
	Flippable
}

var _ Layout = (*LayoutV7)(nil)

func (v7 *LayoutV7) GetMapping(key string) (*string, error) {
	if key == "flippable" {
		return nil, fmt.Errorf("invalid key %q", key)
	}

	jsonLayout, err := json.Marshal(v7)
	if err != nil {
		return nil, err
	}

	mapping := map[string]string{}
	err = json.Unmarshal(jsonLayout, &mapping)
	if err != nil {
		return nil, err
	}

	if value, ok := mapping[key]; ok {
		return &value, nil
	}

	return nil, fmt.Errorf("unknown key %q", key)
}
