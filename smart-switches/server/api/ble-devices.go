package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/ble"
)

type ListBLEDevicesResponse struct {
	Body ListBLEDevicesResponseBody
}

type ListBLEDevicesResponseBody struct {
	Devices  map[string]*ble.Device `json:"devices"`
	Scanning bool                   `json:"scanning"`
	Count    int                    `json:"count"`
}

func (s *server) RegisterBLEDevices(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:      http.MethodGet,
		OperationID: "list-ble-devices",
		Path:        "/api/ble/devices",
		Summary:     "List discovered BLE devices",
		Description: "Get a list of all BLE devices discovered during scanning",
		Errors: []int{
			http.StatusInternalServerError,
		},
	}, s.listBLEDevices)
}

func (s *server) listBLEDevices(ctx context.Context, request *struct{}) (*ListBLEDevicesResponse, error) {
	if s.bleService == nil {
		return nil, huma.Error500InternalServerError("BLE service not initialized")
	}

	devices := s.bleService.GetDevices()
	scanning := s.bleService.IsScanning()

	return &ListBLEDevicesResponse{
		Body: ListBLEDevicesResponseBody{
			Devices:  devices,
			Scanning: scanning,
			Count:    len(devices),
		},
	}, nil
}