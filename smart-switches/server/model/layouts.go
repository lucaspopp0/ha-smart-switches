package model

import (
	"encoding/json"
	"fmt"
	"reflect"
)

type layoutMatcher interface {
	MatchesLayout(key string) bool
}

type Layout interface {
	layoutMatcher
}

type Layouts struct {
	V4 *LayoutV4 `json:"v4,omitempty"`
	V5 *LayoutV5 `json:"v5,omitempty"`
	V6 *LayoutV6 `json:"v6,omitempty"`
	V7 *LayoutV7 `json:"v7,omitempty"`
}

func (l Layouts) GetLayout(name string) (Layout, error) {
	rval := reflect.ValueOf(l)
	if rval.IsZero() {
		return nil, nil
	}

	if rval.Kind() == reflect.Pointer {
		if rval.IsNil() {
			return nil, nil
		}

		rval = rval.Elem()
	}

	for f := range rval.NumField() {
		field := rval.Field(f)

		if field.CanInterface() {
			if field.Kind() == reflect.Pointer {
				if field.IsNil() {
					continue
				}
			}

			if layout, ok := field.Interface().(Layout); ok && layout != nil {
				if layout.MatchesLayout(name) {
					fmt.Printf("matched layout %#v\n", layout)
					return layout, nil
				}
			}
		}
	}

	return nil, fmt.Errorf("layout %v not configured", name)
}

func (l Layouts) GetCommand(layoutName string, keyName string) (string, error) {
	layout, err := l.GetLayout(layoutName)
	if err != nil {
		return "", err
	}

	jsonBytes, err := json.Marshal(layout)
	if err != nil {
		return "", err
	}

	mappings := map[string]string{}
	err = json.Unmarshal(jsonBytes, &mappings)
	if err != nil {
		return "", err
	}

	command, ok := mappings[keyName]
	if !ok {
		return "", fmt.Errorf("no commands found for %q", keyName)
	}

	return command, nil
}

func (l Layouts) recurseForCommandMatchers(value reflect.Value, key string) (string, bool) {
	if value.IsZero() {
		return "", false
	}

	if value.CanInterface() {
		if matcher, ok := value.Interface().(commandMatcher); ok && matcher != nil {
			if command, ok := matcher.MatchesKey(key); ok {
				fmt.Printf("key %q matched command %q\n", key, command)
				return command, true
			}
		}
	}

	switch value.Kind() {
	case reflect.Struct:
		for f := range value.NumField() {
			field := value.Field(f)
			if command, ok := l.recurseForCommandMatchers(field, key); ok {
				return command, true
			}
		}
	case reflect.Array:
		for field := range value.Seq() {
			if command, ok := l.recurseForCommandMatchers(field, key); ok {
				return command, true
			}
		}
	case reflect.Map:
		for _, mapKey := range value.MapKeys() {
			field := value.MapIndex(mapKey)
			if command, ok := l.recurseForCommandMatchers(field, key); ok {
				return command, true
			}
		}
	}

	return "", false
}

type LayoutV4 struct {
	OnOff
	EightButtons
}

var _ Layout = (*LayoutV4)(nil)

func (v4 LayoutV4) MatchesLayout(key string) bool {
	return key == "v4"
}

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

func (v5 LayoutV5) MatchesLayout(key string) bool {
	return key == "v5"
}

func (v5 *LayoutV5) GetMapping(key string) (*string, error) {
	if key == "wheel-routines" {
		return nil, fmt.Errorf("invalid key %q", key)
	}

	jsonLayout, err := json.Marshal(v5)
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

	for _, routine := range v5.WheelRoutines.WheelRoutines {
		if routine.Name == key {
			return &routine.Command, nil
		}
	}

	return nil, fmt.Errorf("unknown key %q", key)
}

type LayoutV6 struct {
	LayoutV5
}

func (v6 LayoutV6) MatchesLayout(key string) bool {
	return key == "v6"
}

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

func (v7 LayoutV7) MatchesLayout(key string) bool {
	return key == "v7"
}
