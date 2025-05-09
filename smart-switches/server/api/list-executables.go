package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

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
	if false {
		fmt.Println("Fetching executables from /data/executables.json")
		jsonBytes, err := os.ReadFile("/data/executables.json")
		if err != nil {
			return nil, err
		}

		s.mExecutables.Lock()
		err = json.Unmarshal(jsonBytes, &s.executables)
		defer s.mExecutables.Unlock()

		if err != nil {
			return nil, err
		}

		return &ListExecutablesResponse{
			Body: ListExecutablesResponseBody{
				Executables: s.executables,
			},
		}, nil
	}

	fmt.Println("Fetching executables from home assistant...")
	executables, err := s.ha.ListExecutables()
	if err != nil {
		return nil, err
	}

	s.mExecutables.Lock()
	s.executables = executables
	s.mExecutables.Unlock()

	return &ListExecutablesResponse{
		Body: ListExecutablesResponseBody{
			Executables: executables,
		},
	}, nil
}
