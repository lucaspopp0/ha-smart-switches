package api

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type StartBLEScanRequest struct {
	Body StartBLEScanRequestBody
}

type StartBLEScanRequestBody struct {
	Duration int `json:"duration" doc:"Scan duration in seconds (default: 30, max: 300)"`
}

type StartBLEScanResponse struct {
	Body StartBLEScanResponseBody
}

type StartBLEScanResponseBody struct {
	Message string `json:"message"`
	Scanning bool  `json:"scanning"`
}

type StopBLEScanResponse struct {
	Body StopBLEScanResponseBody
}

type StopBLEScanResponseBody struct {
	Message string `json:"message"`
	Scanning bool  `json:"scanning"`
}

func (s *server) RegisterBLEScan(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodPost,
		OperationID: "start-ble-scan",
		Path:        "/api/ble/scan/start",
		Summary:     "Start BLE device scan",
		Description: "Start scanning for BLE devices that can act as peripherals",
		Errors: []int{
			http.StatusBadRequest,
			http.StatusInternalServerError,
		},
	}, s.startBLEScan)

	huma.Register(api, huma.Operation{
		Method:      http.MethodPost,
		OperationID: "stop-ble-scan",
		Path:        "/api/ble/scan/stop",
		Summary:     "Stop BLE device scan",
		Description: "Stop the current BLE device scan",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.stopBLEScan)
}

func (s *server) startBLEScan(ctx context.Context, request *StartBLEScanRequest) (*StartBLEScanResponse, error) {
	duration := 30 // Default to 30 seconds
	if request.Body.Duration > 0 {
		duration = request.Body.Duration
		if duration > 300 { // Max 5 minutes
			duration = 300
		}
	}

	if s.bleService == nil {
		return nil, huma.Error500InternalServerError("BLE service not initialized")
	}

	err := s.bleService.StartScan(time.Duration(duration) * time.Second)
	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to start BLE scan", err)
	}

	return &StartBLEScanResponse{
		Body: StartBLEScanResponseBody{
			Message: "BLE scan started",
			Scanning: true,
		},
	}, nil
}

func (s *server) stopBLEScan(ctx context.Context, request *struct{}) (*StopBLEScanResponse, error) {
	if s.bleService == nil {
		return nil, huma.Error500InternalServerError("BLE service not initialized")
	}

	s.bleService.StopScan()

	return &StopBLEScanResponse{
		Body: StopBLEScanResponseBody{
			Message: "BLE scan stopped",
			Scanning: false,
		},
	}, nil
}