package api

import (
	"net/http"
	"os"
	"path"
	"strings"
)

const (
	siteFolder = "/smartswitches/site/public"
	sitePrefix = "/site"
)

func SiteMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, sitePrefix) {
			subpath := strings.TrimPrefix(r.URL.Path, sitePrefix)
			if subpath == "" || subpath == "/" {
				subpath = "/index.html"
			}

			fileBytes, err := os.ReadFile(path.Join(siteFolder, subpath))
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
			}

			w.Write(fileBytes)
			return
		}

		next.ServeHTTP(w, r)
	})
}
