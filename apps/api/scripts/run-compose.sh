#!/usr/bin/env bash

trap "docker compose down" EXIT

docker compose up -d --wait

NODE_ENV=development bun --watch src/index.ts
