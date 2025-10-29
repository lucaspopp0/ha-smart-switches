package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/model"
)

type GetLayoutDefinitionsResponse struct {
	Body map[model.LayoutVersion]model.LayoutDefinition
}

func (s *server) RegisterGetLayoutDefinitions(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-layout-definitions",
		Path:        "/api/layout-definitions",
		Summary:     "Get available layout definitions",
		Description: "Returns the definitions of all supported layout versions, including which buttons they support",
	}, s.getLayoutDefinitions)
}

func (s *server) getLayoutDefinitions(ctx context.Context, request *struct{}) (*GetLayoutDefinitionsResponse, error) {
	return &GetLayoutDefinitionsResponse{
		Body: model.LayoutDefinitions,
	}, nil
}
