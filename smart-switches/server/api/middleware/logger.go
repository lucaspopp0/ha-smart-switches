package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

func Logger(ctx huma.Context, next func(huma.Context)) {
	fmt.Printf("incoming %s %s request\n", ctx.Method(), ctx.Operation().OperationID)

	bodyBuffer := &bytes.Buffer{}

	logger := &contextLogger{
		capturedCtx: ctx,
		status:      http.StatusOK,
		body:        bodyBuffer,
		header:      http.Header{},
	}

	next(logger)

	fmt.Printf("%v response for %s\n",
		logger.status, ctx.Operation().OperationID)

	bodyBytes := bodyBuffer.Bytes()
	_, err := ctx.BodyWriter().Write(bodyBytes)
	if err != nil {
		fmt.Printf("error piping response body: %v", err.Error())
	}

	if logger.status >= 400 {
		if strings.Contains(logger.header.Get("Content-Type"), "json") {
			jsonObj := map[string]any{}
			err = json.Unmarshal(bodyBytes, &jsonObj)
			if err != nil {
				fmt.Printf("error unmarshaling body: %v\n", err.Error())
				fmt.Printf("raw response: %s\n", string(bodyBytes))
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
