package util

import "os"

func GetEnv(envVar string, defaultValue string) string {
	if value := os.Getenv(envVar); value != "" {
		return value
	}

	return defaultValue
}
