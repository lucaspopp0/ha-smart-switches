package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

// RegisterListAddons registers the GET /addons endpoint
func (s *MockServer) RegisterListAddons(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "list-addons",
			Method:      http.MethodGet,
			Path:        "/addons",
			Summary:     "List all add-ons",
		},
		s.handleListAddOns,
	)
}

type listAddOnsOutput struct {
	Body struct {
		AddOns []homeassistant.AddOn `json:"addons"`
	}
}

func (s *MockServer) handleListAddOns(
	ctx context.Context,
	input *struct{},
) (*listAddOnsOutput, error) {
	output := &listAddOnsOutput{}
	output.Body.AddOns = s.data.AddOns
	return output, nil
}
