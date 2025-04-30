package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/danielgtaylor/huma/v2/humacli"
	"github.com/go-chi/chi/v5"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
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
		haAPI := homeassistant.NewAPI(homeassistant.APIConfig{
			SupervisorToken: os.Getenv("SUPERVISOR_TOKEN"),
		})

		// Create a new router & API.
		router := chi.NewMux()

		router.Use(func(h http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if strings.HasPrefix(r.URL.Path, "/site") {
					subpath := strings.TrimPrefix(r.URL.Path, "/site")
					if subpath == "" || subpath == "/" {
						subpath = "/index.html"
					}

					fileBytes, err := os.ReadFile(path.Join("/smartswitches/site/public", subpath))
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

		hooks.OnStart(func() {
			fmt.Println("Testing home assistant connection...")
			resp, err := haAPI.CallService("/script/turn_on", map[string]any{
				"entity_id": "script.test_notification",
			})

			if err != nil {
				fmt.Printf("Home assistant service call failed: %v", err.Error())
			} else {
				responseBody, err := io.ReadAll(resp.Body)
				if err != nil {
					fmt.Printf("error reading home assistant response body: %v", err.Error())
				}

				fmt.Printf("Home assistant response:\nStatus code: %v\n%s",
					resp.StatusCode, string(responseBody))
			}

			fmt.Println("Starting server on port 8000...")
			http.ListenAndServe(":8000", router)
		})
	})

	// Start the server!
	cli.Run()
}
