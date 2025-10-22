package api

import (
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// MockServer represents a simple mock Home Assistant API server
type MockServer struct {
	router *chi.Mux
	api    huma.API
	port   string
	data   *MockData
}

// NewMockServer creates a new mock Home Assistant API server
func NewMockServer(port string) *MockServer {
	s := &MockServer{
		router: chi.NewRouter(),
		port:   port,
		data:   DefaultMockData(),
	}

	s.setupServer()
	return s
}

// SetData allows setting custom mock data
func (s *MockServer) SetData(data *MockData) {
	s.data = data
}

func (s *MockServer) setupServer() {
	s.router.Use(middleware.Logger)
	s.router.Use(middleware.Recoverer)

	cfg := huma.DefaultConfig("Mock Home Assistant API", "1.0.0")
	cfg.DocsPath = ""
	cfg.SchemasPath = ""
	cfg.OpenAPIPath = ""

	s.api = humachi.New(s.router, cfg)

	// Auto-register all endpoints
	huma.AutoRegister(s.api, s)
}

// Start starts the mock server
func (s *MockServer) Start() error {
	addr := fmt.Sprintf(":%s", s.port)
	fmt.Printf("Starting mock Home Assistant API on %s\n", addr)
	fmt.Printf("Base URL: http://localhost%s\n", addr)
	return http.ListenAndServe(addr, s.router)
}
