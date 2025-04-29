package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/danielgtaylor/huma/v2/humacli"
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

	cli := humacli.New(func(hooks humacli.Hooks, o *struct{}) {
		// Create a new router & API.
		router := chi.NewMux()

		router.Use(func(h http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if strings.HasPrefix(r.URL.Path, "/site") {
					subpath := strings.TrimPrefix(r.URL.Path, "/site")
					if subpath == "" || subpath == "/" {
						subpath = "/index.html"
					}

					fileBytes, err := os.ReadFile(path.Join("/smartswitches/site", subpath))
					if err != nil {
						w.WriteHeader(http.StatusInternalServerError)
						w.Write([]byte(err.Error()))
					}

					w.Write(fileBytes)
					return
				}

				h.ServeHTTP(w, r)
			})
		})

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

		// huma.Register(api, huma.Operation{
		// 	Method:      http.MethodGet,
		// 	OperationID: "get-site1",
		// 	Path:        "/site",
		// }, func(ctx context.Context, i *struct{}) (*GetSiteResponse, error) {
		// 	return getSite(ctx, &GetSiteResponse{
		// 		Path: "index.html",
		// 	})
		// })

		// huma.Register(api, huma.Operation{
		// 	Method:      http.MethodGet,
		// 	OperationID: "get-site2",
		// 	Path:        "/site/",
		// }, func(ctx context.Context, i *struct{}) (*GetSiteResponse, error) {
		// 	return getSite(ctx, &GetSiteRequest{
		// 		Path: "index.html",
		// 	})
		// })

		// huma.Register(api, huma.Operation{
		// 	Method:      http.MethodGet,
		// 	OperationID: "get-site3",
		// 	Path:        "/site/*",
		// }, getSite)

		hooks.OnStart(func() {
			fmt.Println("Starting server on port 8000...")
			http.ListenAndServe(":8000", router)
		})
	})

	// Start the server!
	cli.Run()
}
