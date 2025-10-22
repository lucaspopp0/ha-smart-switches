package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

// RegisterCallService registers the POST /core/api/services/{domain}/{service} endpoint
func (s *MockServer) RegisterCallService(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "call-service",
			Method:      http.MethodPost,
			Path:        "/core/api/services/{domain}/{service}",
			Summary:     "Call a Home Assistant service",
		},
		s.handleCallService,
	)
}

type callServiceInput struct {
	Domain  string         `path:"domain" required:"true"`
	Service string         `path:"service" required:"true"`
	Body    map[string]any `json:"entity_id,omitempty"`
}

type callServiceOutput struct {
	Body struct {
		Success bool           `json:"success"`
		Domain  string         `json:"domain"`
		Service string         `json:"service"`
		Payload map[string]any `json:"payload,omitempty"`
	}
}

func (s *MockServer) handleCallService(
	ctx context.Context,
	input *callServiceInput,
) (*callServiceOutput, error) {
	fmt.Printf(
		"Mock service call: %s/%s with payload: %v\n",
		input.Domain,
		input.Service,
		input.Body,
	)

	output := &callServiceOutput{}
	output.Body.Success = true
	output.Body.Domain = input.Domain
	output.Body.Service = input.Service
	output.Body.Payload = input.Body

	return output, nil
}
