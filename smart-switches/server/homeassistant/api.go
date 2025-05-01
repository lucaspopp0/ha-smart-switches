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

type API interface {
	ListEntities(
		domains ...string,
	) ([]string, error)

	// CallService executes POST /core/api/services/{servicePath}
	// with the specified payload as the body if desired
	CallService(
		servicePath string,
		payload map[string]any,
	) (*http.Response, error)

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

type EntityState struct {
	EntityID string `json:"entity_id"`
	State    string `json:"state"`
}

func (c *apiClient) ListEntities(
	domains ...string,
) ([]string, error) {
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

	entities := []string{}
	for _, domain := range domains {
		for _, state := range states {
			if strings.HasPrefix(state.EntityID, domain) {
				entities = append(entities, state.EntityID)
			}
		}
	}

	return entities, nil
}

func (c *apiClient) CallService(
	servicePath string,
	payload map[string]any,
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
