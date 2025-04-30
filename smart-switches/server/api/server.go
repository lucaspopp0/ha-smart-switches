package api

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/danielgtaylor/huma/v2/humacli"
	"github.com/go-chi/chi/v5"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/config"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/homeassistant"
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

		fmt.Printf("Home assistant response:\nStatus code: %v\n%s",
			resp.StatusCode, string(responseBody))
	}

	fmt.Println("Starting server on port 8000...")
	http.ListenAndServe(":8000", s.router)
}

func NewServer() humacli.CLI {
	supervisorToken := os.Getenv("SUPERVISOR_TOKEN")

	s := &server{}

	s.CLI = humacli.New(func(hooks humacli.Hooks, o *struct{}) {
		s.ha = homeassistant.NewAPI(homeassistant.APIConfig{
			SupervisorToken: supervisorToken,
		})

		// Create a new router & API.
		s.router = chi.NewMux()

		s.router.Use(SiteMiddleware)

		api := humachi.New(
			s.router,
			huma.DefaultConfig("Smart Switches", "1.0.0"),
		)

		huma.AutoRegister(api, s)

		hooks.OnStart(s.onStart)
	})

	return s
}
