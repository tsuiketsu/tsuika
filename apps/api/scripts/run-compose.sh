#!/usr/bin/env bash

trap "docker compose --env-file=../../.env down" EXIT

docker compose --env-file=../../.env up -d --wait

NODE_ENV=development bun --env-file=../../.env --hot src/index.ts
