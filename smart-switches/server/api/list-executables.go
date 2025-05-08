package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

type ListExecutablesResponse struct {
	Body ListExecutablesResponseBody
}

type ListExecutablesResponseBody struct {
	Executables homeassistant.Executables `json:"executables"`
}

func (s *server) RegisterListExecutables(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "list-executables",
		Path:        "/api/executables",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.listExecutables)
}

func (s *server) listExecutables(ctx context.Context, request *struct{}) (*ListExecutablesResponse, error) {
	fmt.Println("Fetching executables from home assistant...")
	executables, err := s.ha.ListExecutables()
	if err != nil {
		return nil, err
	}

	s.executables = executables

	return &ListExecutablesResponse{
		Body: ListExecutablesResponseBody{
			Executables: executables,
		},
	}, nil
}
