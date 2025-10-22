# Debugging with Delve

The local Docker image includes the Delve debugger for Go applications.

## Enabling the Debugger

Set the `DEBUG` environment variable to `true` in docker-compose.yml:

```yaml
services:
  server:
    environment:
      DEBUG: true
      # ... other env vars
```

Or pass it when running:

```bash
DEBUG=true docker compose up
```

## Connecting to the Debugger

The debugger listens on port **2345** (already exposed in docker-compose.yml).

### VS Code

Add this configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Connect to Docker",
      "type": "go",
      "request": "attach",
      "mode": "remote",
      "remotePath": "/build/server",
      "port": 2345,
      "host": "localhost"
    }
  ]
}
```

Then:
1. Start the server with `DEBUG=true make run-server`
2. In VS Code, go to Run & Debug (⇧⌘D)
3. Select "Connect to Docker" and click the play button

### GoLand / IntelliJ

1. Go to Run → Edit Configurations
2. Add new "Go Remote" configuration
3. Set Host: `localhost`, Port: `2345`
4. Click OK and start debugging

### Command Line

```bash
dlv connect localhost:2345
```

## Debugger Features

When connected, you can:
- Set breakpoints
- Step through code
- Inspect variables
- Evaluate expressions
- View goroutines and stack traces

## Notes

- The application is built with debug symbols (`-gcflags="all=-N -l"`)
- Debugger accepts multiple clients simultaneously
- The application will wait for debugger to attach before starting
