package api

import (
	"io"
	"maps"
	"net/http"
	"os"
	"path"
	"strings"
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
				localSite := "http://host.docker.internal:8000"

				proxyRequest, err := http.NewRequest(
					r.Method,
					path.Join(localSite, subpath),
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
				fileBytes, err := os.ReadFile(path.Join(siteFolder, subpath))
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
