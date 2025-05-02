package api

import "github.com/danielgtaylor/huma/v2"

func AllowCORS(ctx huma.Context, next func(huma.Context)) {
	ctx.SetHeader("Access-Control-Allow-Origin", "*")
	ctx.SetHeader("Access-Control-Allow-Methods", "*")
	ctx.SetHeader("Access-Control-Allow-Headers", "*")
	ctx.SetHeader("Access-Control-Allow-Credentials", "true")
	ctx.SetHeader("Access-Control-Expose-Headers", "*")

	next(ctx)
}
