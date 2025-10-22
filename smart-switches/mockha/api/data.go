package api

import "github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"

// MockData holds the mock data for the server
type MockData struct {
	EntityStates []homeassistant.EntityState
	AddOns       []homeassistant.AddOn
}

// DefaultMockData returns default mock data for testing
func DefaultMockData() *MockData {
	return &MockData{
		EntityStates: []homeassistant.EntityState{
			{
				EntityID: "script.good_morning",
				State:    "off",
				Attributes: map[string]any{
					"friendly_name":  "Good Morning",
					"last_triggered": nil,
				},
			},
			{
				EntityID: "script.good_night",
				State:    "off",
				Attributes: map[string]any{
					"friendly_name":  "Good Night",
					"last_triggered": nil,
				},
			},
			{
				EntityID: "scene.movie_time",
				State:    "scening",
				Attributes: map[string]any{
					"friendly_name": "Movie Time",
					"entity_id": []string{
						"light.living_room",
						"light.kitchen",
					},
				},
			},
			{
				EntityID: "scene.bright",
				State:    "scening",
				Attributes: map[string]any{
					"friendly_name": "Bright Lights",
					"entity_id": []string{
						"light.living_room",
						"light.bedroom",
					},
				},
			},
			{
				EntityID: "light.living_room",
				State:    "on",
				Attributes: map[string]any{
					"friendly_name": "Living Room Light",
					"brightness":    255,
					"color_temp":    370,
				},
			},
			{
				EntityID: "switch.bedroom_fan",
				State:    "off",
				Attributes: map[string]any{
					"friendly_name": "Bedroom Fan",
				},
			},
		},
		AddOns: []homeassistant.AddOn{
			{
				Slug: "smart-switches",
			},
			{
				Slug: "mosquitto",
			},
		},
	}
}
