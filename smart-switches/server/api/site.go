package api

import (
	"io"
	"maps"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gabriel-vasile/mimetype"
)

const (
	siteFolder = "/smartswitches/site/public"
	apiPrefix  = "/api"
)

func SiteMiddleware(local bool) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, apiPrefix) {
				next.ServeHTTP(w, r)
				return
			}

			subpath := r.URL.Path
			if subpath == "" || subpath == "/" {
				subpath = "/index.html"
			}

			if local {
				localSite := "http://host.docker.internal:7128"

				proxyRequest, err := http.NewRequest(
					r.Method,
					localSite+subpath,
					r.Body,
				)

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				res, err := http.DefaultClient.Do(proxyRequest)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				responseBody, err := io.ReadAll(res.Body)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				maps.Copy(res.Header, w.Header())
				w.WriteHeader(res.StatusCode)
				w.Write(responseBody)
				return
			} else {
				filePath := path.Join(siteFolder, subpath)
				mtype, err := mimetype.DetectFile(filePath)

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
				}

				w.Header().Add("Content-Type", mtype.String())

				fileBytes, err := os.ReadFile(filePath)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
				}

				w.Write(fileBytes)
			}

			return
		})
	}
}
