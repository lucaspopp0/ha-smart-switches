package main

import (
	"context"
	"os"
	"path"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

var (
	sitePath = util.GetEnv("SITE_PATH", "")
)

type GetSiteRequest struct {
	Path string `path:"*"`
}

func getSite(ctx context.Context, request *GetSiteRequest) (*GetSiteResponse, error) {
	fileBytes, err := os.ReadFile(path.Join(sitePath, request.Path))
	if err != nil {
		return nil, err
	}

	return &GetSiteResponse{
		Body: fileBytes,
	}, nil
}
