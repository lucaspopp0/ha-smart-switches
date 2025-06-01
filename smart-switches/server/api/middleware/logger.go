package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

// contextKey is a custom type for context keys to avoid collisions
type contextKey string

const (
	// BodyBytesKey is the context key for storing request body bytes
	BodyBytesKey contextKey = "bodyBytes"
)

func BodyAppender(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Read the body
		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil {
			fmt.Printf("error reading request body: %v\n", err.Error())
		}

		// Close the original body
		r.Body.Close()

		// Create new ReadClosers for the body
		r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		// Store body bytes in context
		ctx := context.WithValue(r.Context(), BodyBytesKey, bodyBytes)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func Logger(ctx huma.Context, next func(huma.Context)) {
	fmt.Printf("incoming %s %s request\n", ctx.Method(), ctx.Operation().OperationID)

	var body string

	// Log request body if present in context
	if bodyBytes, ok := ctx.Context().Value(BodyBytesKey).([]byte); ok && len(bodyBytes) > 0 {
		if strings.Contains(ctx.Header("Content-Type"), "json") {
			jsonObj := map[string]any{}
			if err := json.Unmarshal(bodyBytes, &jsonObj); err == nil {
				body = "\n" + util.MarshalIndent(jsonObj)
			} else {
				body = "\n" + string(bodyBytes)
			}
		} else {
			body = "\n" + string(bodyBytes)
		}
	}

	operationID := ctx.Operation().OperationID

	fmt.Printf("Received request to %s %s\n",
		operationID, body)

	resBodyBuffer := &bytes.Buffer{}

	logger := &contextLogger{
		capturedCtx: ctx,
		status:      http.StatusOK,
		body:        resBodyBuffer,
		header:      http.Header{},
	}

	next(logger)

	fmt.Printf("%v response for %s\n",
		logger.status, operationID)

	resBodyBytes := resBodyBuffer.Bytes()
	_, err := ctx.BodyWriter().Write(resBodyBytes)
	if err != nil {
		fmt.Printf("error piping response body: %v", err.Error())
	}

	if logger.status >= 400 {
		if strings.Contains(logger.header.Get("Content-Type"), "json") {
			jsonObj := map[string]any{}
			err = json.Unmarshal(resBodyBytes, &jsonObj)
			if err != nil {
				fmt.Printf("error unmarshaling body: %v\n", err.Error())
				fmt.Printf("raw response: %s\n", string(resBodyBytes))
				return
			}

			fmt.Println(util.MarshalIndent(jsonObj))
		}
	}

}

type capturedCtx huma.Context

type contextLogger struct {
	capturedCtx
	status int
	body   io.Writer
	header http.Header
}

func (c *contextLogger) SetStatus(code int) {
	c.status = code
	c.capturedCtx.SetStatus(code)
}

func (c *contextLogger) BodyWriter() io.Writer {
	return c.body
}

func (c *contextLogger) SetHeader(name, value string) {
	c.header.Set(name, value)
	c.capturedCtx.SetHeader(name, value)
}

func (c *contextLogger) AppendHeader(name, value string) {
	c.header.Add(name, value)
	c.capturedCtx.AppendHeader(name, value)
}
