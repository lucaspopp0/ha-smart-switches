# Mock Home Assistant API

A simple mock implementation of the Home Assistant Supervisor API for local development and testing.

## Features

- Mocks core Home Assistant API endpoints
- Supports entity states (scripts, scenes, lights, switches)
- Supports add-on management endpoints
- Service call simulation
- Built with Huma framework for clean API design

## Usage

### Running Locally

```bash
go run . --port=8123
```

### Using Docker

Build the image:

```bash
docker build -t mockha .
```

Run the container:

```bash
docker run -p 8123:8123 mockha
```

### Using with Docker Compose

The mock HA API is already configured in `local/docker-compose.yml`:

```bash
cd local
docker compose up
```

This will start both the mock Home Assistant API (on port 8123) and your smart-switches server (on port 8124) with the correct environment variables already set.

### Configuration

Set these environment variables in your application to use the mock API:

```bash
export SUPERVISOR_HOST=localhost:8123
export SUPERVISOR_TOKEN=mock-token-12345
```

The mock API doesn't validate tokens but requires the Authorization header to be present.

## Endpoints

### Core API

- `GET /core/api/states` - Get all entity states
- `GET /core/api/states/{entityID}` - Get specific entity state
- `POST /core/api/services/{domain}/{service}` - Call a service

### Add-ons API

- `GET /addons` - List all add-ons
- `GET /addons/{addon}/info` - Get add-on information
- `GET /addons/self/info` - Get current add-on information

## Default Mock Data

The mock API comes with pre-populated data:

**Scripts:**
- `script.good_morning`
- `script.good_night`

**Scenes:**
- `scene.movie_time`
- `scene.bright`

**Lights:**
- `light.living_room`

**Switches:**
- `switch.bedroom_fan`

**Add-ons:**
- `smart-switches`
- `mosquitto`

## Customizing Mock Data

You can customize the mock data by modifying [api/data.go](api/data.go) and rebuilding.

## Architecture

The mock server uses:
- **Huma** for HTTP API framework with OpenAPI support
- **Chi** for HTTP routing
- **huma.AutoRegister** for automatic endpoint registration

Each endpoint is defined in its own file following the pattern:
- File name matches the operation ID (e.g., `get-states.go`)
- Contains a `Register{OperationName}` method for auto-registration
- Types and handlers are colocated with the endpoint
