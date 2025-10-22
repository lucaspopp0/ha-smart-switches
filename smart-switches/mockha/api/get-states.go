package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

// RegisterGetStates registers the GET /core/api/states endpoint
func (s *MockServer) RegisterGetStates(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "get-states",
			Method:      http.MethodGet,
			Path:        "/core/api/states",
			Summary:     "Get all entity states",
		},
		s.handleGetStates,
	)
}

type getStatesOutput struct {
	Body []homeassistant.EntityState
}

func (s *MockServer) handleGetStates(
	ctx context.Context,
	input *struct{},
) (*getStatesOutput, error) {
	return &getStatesOutput{
		Body: s.data.EntityStates,
	}, nil
}
