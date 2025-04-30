package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
)

type PutConfigRequest struct {
	Body config.Config
}

type PutConfigResponse struct {
	Body config.Config
}

func (s *server) RegisterPutConfig(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodPut,
		OperationID: "put-config",
		Path:        "/api/config",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.putConfig)
}

func (s *server) putConfig(ctx context.Context, req *PutConfigRequest) (*PutConfigResponse, error) {
	err := req.Body.WriteFile()
	if err != nil {
		return nil, err
	}

	s.cfg = req.Body

	return &PutConfigResponse{
		Body: req.Body,
	}, nil
}
