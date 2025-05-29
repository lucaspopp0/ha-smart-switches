package ble

import (
	"context"
	"fmt"
	"sync"
	"time"

	"tinygo.org/x/bluetooth"
)

type Device struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	RSSI     int16             `json:"rssi"`
	LastSeen time.Time         `json:"last_seen"`
	Services []bluetooth.UUID  `json:"services"`
	Metadata map[string]string `json:"metadata"`
}

type Service struct {
	mu         sync.RWMutex
	devices    map[string]*Device
	scanning   bool
	adapter    *bluetooth.Adapter
	scanCtx    context.Context
	cancelScan context.CancelFunc
}

func NewService() (*Service, error) {
	// Get the default adapter
	adapter := bluetooth.DefaultAdapter

	// Enable the adapter if needed
	err := adapter.Enable()
	if err != nil {
		return nil, fmt.Errorf("failed to enable BLE adapter: %w", err)
	}

	return &Service{
		devices: make(map[string]*Device),
		adapter: adapter,
	}, nil
}

func (s *Service) StartScan(duration time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.scanning {
		return nil // Already scanning
	}

	s.scanning = true
	s.scanCtx, s.cancelScan = context.WithTimeout(context.Background(), duration)

	go s.scanForDevices()

	return nil
}

func (s *Service) StopScan() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.scanning {
		return
	}

	s.scanning = false
	if s.cancelScan != nil {
		s.cancelScan()
	}
}

func (s *Service) IsScanning() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.scanning
}

func (s *Service) GetDevices() map[string]*Device {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Return a copy of the devices map
	devices := make(map[string]*Device)
	for k, v := range s.devices {
		devices[k] = v
	}
	return devices
}

func (s *Service) scanForDevices() {
	defer func() {
		s.mu.Lock()
		s.scanning = false
		s.mu.Unlock()
	}()

	fmt.Println("ble scanning...")

	err := s.adapter.Scan(func(adapter *bluetooth.Adapter, result bluetooth.ScanResult) {
		fmt.Printf("bluetooth result found: %v\n", result.LocalName())

		s.mu.Lock()
		defer s.mu.Unlock()

		deviceID := result.Address.String()
		device, exists := s.devices[deviceID]

		if !exists {
			device = &Device{
				ID:       deviceID,
				Name:     result.LocalName(),
				Services: []bluetooth.UUID{}, // Initialize empty services slice
				Metadata: make(map[string]string),
			}
			s.devices[deviceID] = device
		}

		// Update device info
		device.RSSI = result.RSSI
		device.LastSeen = time.Now()

		// Update name if we got a better one
		if localName := result.LocalName(); localName != "" && device.Name == "" {
			device.Name = localName
		}

		// Store manufacturer data if available
		if manufacturerData := result.AdvertisementPayload.ManufacturerData(); len(manufacturerData) > 0 {
			// Convert manufacturer data to hex string for storage
			hexData := ""
			for _, data := range manufacturerData {
				hexData += fmt.Sprintf("%04x:%x ", data.CompanyID, data.Data)
			}
			device.Metadata["manufacturer_data"] = hexData
		}
	})

	if err != nil {
		// Log error but don't crash
		fmt.Printf("scanning error: %v", err.Error())
		return
	}

	fmt.Println("ble scan stopping...")
}
