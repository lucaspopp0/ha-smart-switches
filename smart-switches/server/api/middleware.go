package api

import (
	"fmt"

	"github.com/danielgtaylor/huma/v2"
)

func Logger(ctx huma.Context, next func(huma.Context)) {
	fmt.Printf("incoming %s request\n", ctx.Operation().OperationID)

	next(ctx)

	fmt.Printf("%v response for %s\n", ctx.Status(), ctx.Operation().OperationID)
}
