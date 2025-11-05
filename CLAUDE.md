# Project Overview

This is a Home Assistant add-on that provides a web-based configuration UI for managing smart lightswitch hardware.
Works in tandem with the pico-switch firmware project (separate repository).

## Architecture

- **Backend**: Go server (port 8124) using Huma v2 REST framework with OpenAPI
  - Located at smart-switches/server/
  - Handles button press events from physical switches
  - Integrates with Home Assistant Supervisor API
  - Stores config in /data/switches_v2.json
  - Key endpoints: GET/PUT /api/config, POST /api/press, GET /api/executables

- **Frontend**: React + Gatsby static site with Ant Design UI
  - Located at smart-switches/site/
  - Uses uniforms for form generation
  - TypeScript client auto-generated from backend OpenAPI spec
  - Dev server on port 7128, production served by Go backend on 8124

## Integration with pico-switch

Physical pico-switch hardware (Raspberry Pi Pico W) sends HTTP POST to /api/press when buttons are pressed.
Backend looks up configured Home Assistant script/scene and executes it via HA Supervisor API.
Supports layout V9 (10 buttons: on, off, 1-8) with RGB LED color configuration per button.

## Key Files

- smart-switches/config.yml - HA add-on manifest and metadata
- smart-switches/CHANGELOG.md - Recent changes
- smart-switches/server/api/press.go - Button press handler
- smart-switches/server/homeassistant/api.go - HA integration client
- smart-switches/site/src/pages/index.tsx - Main UI dashboard

## Development

After any change to 'smart-switches/server/go.mod' or 'server/go.sum', be sure to tidy those files by running `make -C smart-switches tidy-server` before committing changes to git

Concise answers are preferred
