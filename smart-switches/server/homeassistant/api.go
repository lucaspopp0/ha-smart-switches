package homeassistant

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path"
)

const (
	baseURL = "http://supervisor/core/api/"
)

type API interface {
	// CallService executes POST /core/api/services/{servicePath}
	// with the specified payload as the body if desired
	CallService(
		servicePath string,
		payload map[string]any,
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
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.cfg.SupervisorToken))

	return http.DefaultClient.Do(req)
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
