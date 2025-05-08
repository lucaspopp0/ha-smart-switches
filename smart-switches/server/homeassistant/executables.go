package homeassistant

import (
	"slices"
	"strings"
)

type Executables map[string]Executable

type Executable struct {
	Domain       string `json:"domain"`
	EntityID     string `json:"entityId"`
	FriendlyName string `json:"friendlyName"`
}

var executableDomains = []string{
	"script",
	"scene",
}

func isExecutable(state EntityState) (Executable, bool) {
	parts := strings.Split(state.EntityID, ".")
	domain := parts[0]

	if !slices.Contains(executableDomains, domain) {
		return Executable{}, false
	}

	return Executable{
		Domain:       domain,
		EntityID:     state.EntityID,
		FriendlyName: state.Attributes["friendly_name"].(string),
	}, true
}
