package homeassistant

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"
)

const (
	baseURL = "http://supervisor/core/api/"
)

type EntityState struct {
	EntityID string `json:"entity_id"`
	State    string `json:"state"`
}

type homeassistantAPI interface {
	GetStates() ([]EntityState, error)
	GetEntityStates(entityID string) ([]EntityState, error)

	// CallService executes POST /core/api/services/{servicePath}
	// with the specified payload as the body if desired
	CallService(servicePath string, payload any) (*http.Response, error)
}

type API interface {
	homeassistantAPI

	ListEntities(
		domains ...string,
	) ([]string, error)

	// Tries to identify the service automatically and execute it
	Execute(
		entityID string,
	) (*http.Response, error)
}

type APIConfig struct {
	SupervisorToken string
}

type apiClient struct {
	cfg APIConfig
}

func NewAPI(cfg APIConfig) API {
	return &apiClient{
		cfg: cfg,
	}
}

func (c *apiClient) requestURL(path string) string {
	return fmt.Sprintf("%s%s", baseURL, path)
}

func (c *apiClient) do(req *http.Request) (*http.Response, error) {
	fmt.Printf("Sending %s %s\n", req.Method, req.URL.String())

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.cfg.SupervisorToken))

	return http.DefaultClient.Do(req)
}

func (c *apiClient) ListEntities(
	domains ...string,
) ([]string, error) {
	entityStates, err := c.GetStates()
	if err != nil {
		return nil, err
	}

	entityIDs := []string{}
	for _, es := range entityStates {
		for _, domain := range domains {
			if strings.HasPrefix(es.EntityID, domain) {
				entityIDs = append(entityIDs, es.EntityID)
			}
		}
	}

	return entityIDs, nil
}

func (c *apiClient) GetStates() ([]EntityState, error) {
	req, err := http.NewRequest(http.MethodGet, c.requestURL("states"), http.NoBody)
	if err != nil {
		return nil, err
	}

	resp, err := c.do(req)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%v error: %s", resp.StatusCode, string(body))
	}

	states := []EntityState{}
	err = json.Unmarshal(body, &states)
	if err != nil {
		return nil, err
	}

	return states, nil
}

func (c *apiClient) GetEntityStates(entityID string) ([]EntityState, error) {
	req, err := http.NewRequest(http.MethodGet, c.requestURL(fmt.Sprintf("states/%s", entityID)), http.NoBody)
	if err != nil {
		return nil, err
	}

	resp, err := c.do(req)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%v error: %s", resp.StatusCode, string(body))
	}

	states := []EntityState{}
	err = json.Unmarshal(body, &states)
	if err != nil {
		return nil, err
	}

	return states, nil
}

func (c *apiClient) CallService(
	servicePath string,
	payload any,
) (*http.Response, error) {
	var body io.Reader = http.NoBody
	if payload != nil {
		payloadBytes, err := json.Marshal(payload)
		if err != nil {
			return nil, err
		}

		body = bytes.NewReader(payloadBytes)
	}

	req, err := http.NewRequest(
		http.MethodPost,
		c.requestURL(path.Join("services/", servicePath)),
		body,
	)

	if err != nil {
		return nil, err
	}

	return c.do(req)
}

func (c *apiClient) Execute(
	entityID string,
) (*http.Response, error) {
	var servicePath string

	switch {
	case strings.HasPrefix(entityID, "script."):
		servicePath = "script/turn_on"
	case strings.HasPrefix(entityID, "scene."):
		servicePath = "scene/turn_on"
	default:
		return nil, fmt.Errorf("could not infer service path for entityID %q", entityID)
	}

	return c.CallService(servicePath, map[string]any{
		"entity_id": entityID,
	})
}
