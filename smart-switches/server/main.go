package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
)

type GetConfigResponse struct {
	Body config.Config
}

type GetSiteResponse struct {
	Body []byte
}

type PutConfigRequest struct {
	Body config.Config
}

func main() {
	fmt.Println("starting up")

	// Create a new router & API.
	router := chi.NewMux()
	api := humachi.New(router, huma.DefaultConfig("Smart Switches", "1.0.0"))

	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-config",
		Path:        "/config",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, func(ctx context.Context, i *struct{}) (*GetConfigResponse, error) {
		cfg, err := config.FromFile()
		if err != nil {
			return nil, err
		}

		return &GetConfigResponse{
			Body: *cfg,
		}, nil
	})

	huma.Register(api, huma.Operation{
		Method:      http.MethodPut,
		OperationID: "put-config",
		Path:        "/config",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, func(ctx context.Context, input *PutConfigRequest) (*struct{}, error) {
		err := input.Body.WriteFile()
		if err != nil {
			return nil, err
		}

		return &struct{}{}, nil
	})

	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-site1",
		Path:        "/site",
	}, func(ctx context.Context, i *struct{}) (*GetSiteResponse, error) {
		return getSite(ctx, &GetSiteRequest{
			Path: "index.html",
		})
	})

	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-site2",
		Path:        "/site/",
	}, func(ctx context.Context, i *struct{}) (*GetSiteResponse, error) {
		return getSite(ctx, &GetSiteRequest{
			Path: "index.html",
		})
	})

	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "get-site3",
		Path:        "/site/*",
	}, getSite)

	// Start the server!
	http.ListenAndServe("127.0.0.1:8000", router)
}
