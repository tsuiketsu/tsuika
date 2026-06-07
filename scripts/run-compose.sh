#!/usr/bin/env bash

trap "docker compose -f docker-compose.dev.yml down" EXIT

docker compose -f docker-compose.dev.yml up -d
turbo dev
