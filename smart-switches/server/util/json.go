package util

import (
	"encoding/json"
	"fmt"
)

func MarshalIndent(v any) string {
	return MarshalIndentP(v, "", "  ")
}

func MarshalIndentP(v any, prefix string, indent string) string {
	jsonBytes, err := json.MarshalIndent(v, prefix, indent)
	if err != nil {
		return fmt.Sprintf("%v", v)
	}

	return string(jsonBytes)
}

func MarshalIndentBytes(v any, prefix string, indent string) string {
	jsonBytes, err := json.MarshalIndent(v, prefix, indent)
	if err != nil {
		return fmt.Sprintf("%v", v)
	}

	return string(jsonBytes)
}
