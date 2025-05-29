module github.com/lucaspopp0/ha-smart-switches/smart-switches

go 1.24.2

replace github.com/lucaspopp0/ha-smart-switches/smart-switches => ./

require github.com/go-chi/chi/v5 v5.2.1

require (
	github.com/gabriel-vasile/mimetype v1.4.9 // indirect
	golang.org/x/net v0.39.0 // indirect
)

require (
	github.com/danielgtaylor/huma/v2 v2.32.0
	github.com/inconshreveable/mousetrap v1.1.0 // indirect
	github.com/spf13/cobra v1.8.1
	github.com/spf13/pflag v1.0.5 // indirect
)
