module github.com/lucaspopp0/ha-smart-switches/smart-switches/mockha

go 1.24.2

replace github.com/lucaspopp0/ha-smart-switches/smart-switches => ../server

require (
	github.com/danielgtaylor/huma/v2 v2.35.0
	github.com/go-chi/chi/v5 v5.2.5
	github.com/lucaspopp0/ha-smart-switches/smart-switches v0.0.0-00010101000000-000000000000
)

require (
	golang.org/x/net v0.40.0 // indirect
	golang.org/x/text v0.25.0 // indirect
)
