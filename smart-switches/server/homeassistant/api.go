package homeassistant

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path"
	"strings"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

var (
	envSupervisorHost = "SUPERVISOR_HOST"
	baseURL           = fmt.Sprintf(
		"http://%s/",
		util.GetEnv(envSupervisorHost, "supervisor"),
	)
)

type EntityState struct {
	EntityID   string         `json:"entity_id"`
	State      string         `json:"state"`
	Attributes map[string]any `json:"attributes,omitempty"`
}

type AddOn struct {
	Slug string `json:"slug"`
}

type addonsAPI interface {
	ListAddOns() ([]AddOn, error)
	GetAddOnInfo(addon string) (*AddOn, error)
}

type coreAPI interface {
	GetStates() ([]EntityState, error)
	GetEntityStates(entityID string) ([]EntityState, error)

	// CallService executes POST /core/api/services/{servicePath}
	// with the specified payload as the body if desired
	CallService(servicePath string, payload any) (*http.Response, error)
}

type API interface {
	coreAPI
	addonsAPI

	ListExecutables() (Executables, error)

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

func (c *apiClient) ListExecutables() (Executables, error) {
	entityStates, err := c.GetStates()
	if err != nil {
		return nil, err
	}

	executables := Executables{}
	for _, es := range entityStates {
		if executable, ok := isExecutable(es); ok {
			executables[es.EntityID] = executable
		}
	}

	return executables, nil
}

func (c *apiClient) GetStates() ([]EntityState, error) {
	req, err := http.NewRequest(http.MethodGet, c.requestURL("core/api/states"), http.NoBody)
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
	req, err := http.NewRequest(http.MethodGet, c.requestURL(fmt.Sprintf("core/api/states/%s", entityID)), http.NoBody)
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
		c.requestURL(path.Join("core/api/services/", servicePath)),
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

func (c *apiClient) ListAddOns() ([]AddOn, error) {
	req, err := http.NewRequest(http.MethodGet, c.requestURL("addons"), http.NoBody)
	if err != nil {
		return nil, err
	}

	resp, err := c.do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s", resp.Status)
	}

	info := &struct {
		AddOns []AddOn `json:"addons"`
	}{}

	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&info)
	if err != nil {
		return nil, err
	}

	return info.AddOns, nil
}

func (c *apiClient) GetAddOnInfo(addon string) (*AddOn, error) {
	req, err := http.NewRequest(http.MethodGet, c.requestURL(fmt.Sprintf("addons/%s/info", addon)), http.NoBody)
	if err != nil {
		return nil, err
	}

	resp, err := c.do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s", resp.Status)
	}

	info := &AddOn{}
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&info)
	if err != nil {
		return nil, err
	}

	return info, nil
}
