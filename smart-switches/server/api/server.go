package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/danielgtaylor/huma/v2/humacli"
	"github.com/go-chi/chi/v5"
	"github.com/spf13/cobra"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
)

const (
	envSupervisorToken = "SUPERVISOR_TOKEN"
)

type server struct {
	humacli.CLI
	router *chi.Mux
	ha     homeassistant.API
	cfg    config.Config
}

func (s *server) onStart() {
	cfg, err := config.FromFile()
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err.Error())
	} else {
		s.cfg = *cfg
	}

	fmt.Println("Testing home assistant connection...")
	resp, err := s.ha.CallService("/script/turn_on", map[string]any{
		"entity_id": "script.test_notification",
	})

	if err != nil {
		fmt.Printf("Home assistant service call failed: %v", err.Error())
	} else {
		responseBody, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf("error reading home assistant response body: %v", err.Error())
		}

		fmt.Printf("Home assistant response:\nStatus code: %v\n%s\n",
			resp.StatusCode, string(responseBody))
	}

	fmt.Println("Starting server on port 8000...")
	http.ListenAndServe(":8000", s.router)
}

func NewServer(version string) humacli.CLI {
	supervisorToken := os.Getenv(envSupervisorToken)

	s := &server{}

	var api huma.API

	s.CLI = humacli.New(func(hooks humacli.Hooks, o *struct{}) {
		s.ha = homeassistant.NewAPI(homeassistant.APIConfig{
			SupervisorToken: supervisorToken,
		})

		// Create a new router & API.
		s.router = chi.NewMux()

		s.router.Use(SiteMiddleware)

		api = humachi.New(
			s.router,
			huma.DefaultConfig("Smart Switches", version),
		)

		huma.AutoRegister(api, s)

		hooks.OnStart(s.onStart)
	})

	// Add a command to print out the OpenAPI doc without starting the server.
	s.CLI.Root().AddCommand(&cobra.Command{
		Use:   "get-openapi",
		Short: "Dump OpenAPI to stdout",
		Long:  "Generate the OpenAPI spec and dump it to stdout without starting the server. Redirect the output to save to a file.",
		Run: func(cmd *cobra.Command, args []string) {
			b, _ := json.MarshalIndent(api.OpenAPI(), "", "  ")
			fmt.Println(string(b))
		}},
	)

	return s
}
