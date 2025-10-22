package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/mockha/api"
)

func main() {
	port := flag.String("port", "8123", "Port to run the mock server on")
	flag.Parse()

	server := api.NewMockServer(*port)

	fmt.Println("Mock Home Assistant API Server")
	fmt.Println("================================")
	fmt.Println()
	fmt.Println("To use this with your application, set these environment variables:")
	fmt.Printf("  export SUPERVISOR_HOST=localhost:%s\n", *port)
	fmt.Println("  export SUPERVISOR_TOKEN=mock-token-12345")
	fmt.Println()

	if err := server.Start(); err != nil {
		fmt.Fprintf(os.Stderr, "Error starting server: %v\n", err)
		os.Exit(1)
	}
}
