package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

// RegisterGetEntityState registers the GET /core/api/states/{entityID} endpoint
func (s *MockServer) RegisterGetEntityState(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "get-entity-state",
			Method:      http.MethodGet,
			Path:        "/core/api/states/{entityID}",
			Summary:     "Get specific entity state",
		},
		s.handleGetEntityState,
	)
}

type getEntityStateInput struct {
	EntityID string `path:"entityID"`
}

type getEntityStateOutput struct {
	Body homeassistant.EntityState
}

func (s *MockServer) handleGetEntityState(
	ctx context.Context,
	input *getEntityStateInput,
) (*getEntityStateOutput, error) {
	for _, state := range s.data.EntityStates {
		if state.EntityID == input.EntityID {
			return &getEntityStateOutput{
				Body: state,
			}, nil
		}
	}

	return nil, huma.Error404NotFound("entity not found")
}
