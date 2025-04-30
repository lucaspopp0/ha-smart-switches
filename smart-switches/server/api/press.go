package api

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

type PostPressRequest struct {
	Body PostPressRequestBody
}

type PostPressRequestBody struct {
	Switch string `json:"switch"`
	Key    string `json:"key"`
	Layout string `json:"layout"`
}

type PostPressResponse struct {
	Body any
}

func (s *server) RegisterPostPress(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodPost,
		OperationID: "press",
		Path:        "/press",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.postPress)
}

func (s *server) postPress(ctx context.Context, req *PostPressRequest) (*PostPressResponse, error) {
	if s.cfg.Switches == nil {
		return nil, huma.Error404NotFound("No switches configured", nil)
	}

	if _, ok := s.cfg.Switches[req.Body.Switch]; !ok {
		return nil, huma.Error404NotFound(fmt.Sprintf("No switch named %q", req.Body.Switch))
	}

	command, err := s.cfg.Switches[req.Body.Switch].Layouts.GetMapping(req.Body.Layout, req.Body.Key)
	if err != nil {
		return nil, huma.Error400BadRequest(err.Error())
	}

	resp, err := s.ha.Execute(*command)
	if err != nil {
		return nil, err
	}

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return &PostPressResponse{
		Body: string(responseBody),
	}, nil
}
