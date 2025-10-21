package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
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
		Path:        "/api/press",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.postPress)
}

func (s *server) postPress(ctx context.Context, req *PostPressRequest) (*PostPressResponse, error) {
	reqBodyJSON, _ := json.Marshal(req.Body)
	log.Printf("Press request: %s", string(reqBodyJSON))

	if s.cfg.Switches == nil {
		return nil, huma.Error404NotFound("No switches configured", nil)
	}

	if _, ok := s.cfg.Switches[req.Body.Switch]; !ok {
		return nil, huma.Error404NotFound(fmt.Sprintf("No switch named %q", req.Body.Switch))
	}

	command, err := s.cfg.Switches[req.Body.Switch].Layouts.GetCommand(req.Body.Layout, req.Body.Key)
	if err != nil {
		log.Printf("GetCommand failed for layout=%q key=%q: %v", req.Body.Layout, req.Body.Key, err)
		return nil, huma.Error400BadRequest(err.Error())
	}

	resp, err := s.ha.Execute(command)
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
