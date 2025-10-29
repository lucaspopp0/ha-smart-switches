package model

// LayoutVersion is an enum representing supported layout versions
type LayoutVersion string

const (
	V9 LayoutVersion = "v9"
)

// LayoutDefinition defines the structure and capabilities of a layout version
type LayoutDefinition struct {
	Version     LayoutVersion
	Description string
	Buttons     []string
}

// LayoutDefinitions contains all supported layout versions
var LayoutDefinitions = map[LayoutVersion]LayoutDefinition{
	V9: {
		Version:     V9,
		Description: "Second fully enclosed case",
		Buttons: []string{
			"on",
			"off",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
		},
	},
}

// LayoutInstance represents a user's configured layout instance
type LayoutInstance struct {
	Version LayoutVersion      `json:"version"`
	Buttons map[string]Command `json:"buttons"`
	Flipped bool               `json:"flipped"`
}
