package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
)

type GetConfigResponse struct {
	Body config.Config
}

func (s *server) RegisterGetConfig(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-config",
		Path:        "/api/config",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.getConfig)
}

func (s *server) getConfig(ctx context.Context, response *struct{}) (*GetConfigResponse, error) {
	fmt.Println("Fetching config from file...")
	cfg, err := config.FromFile()
	if err != nil {
		return nil, err
	}

	return &GetConfigResponse{
		Body: *cfg,
	}, nil
}
