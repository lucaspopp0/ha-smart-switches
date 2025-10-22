package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

// RegisterGetAddonInfo registers the GET /addons/{addon}/info endpoint
func (s *MockServer) RegisterGetAddonInfo(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "get-addon-info",
			Method:      http.MethodGet,
			Path:        "/addons/{addon}/info",
			Summary:     "Get add-on information",
		},
		s.handleGetAddOnInfo,
	)
}

type getAddOnInfoInput struct {
	Addon string `path:"addon"`
}

type getAddOnInfoOutput struct {
	Body homeassistant.AddOn
}

func (s *MockServer) handleGetAddOnInfo(
	ctx context.Context,
	input *getAddOnInfoInput,
) (*getAddOnInfoOutput, error) {
	// Handle "self" as a special case
	if input.Addon == "self" {
		return &getAddOnInfoOutput{
			Body: homeassistant.AddOn{
				Slug: "smart-switches",
			},
		}, nil
	}

	for _, addon := range s.data.AddOns {
		if addon.Slug == input.Addon {
			return &getAddOnInfoOutput{
				Body: addon,
			}, nil
		}
	}

	return nil, huma.Error404NotFound("addon not found")
}
