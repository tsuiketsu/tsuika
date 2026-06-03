FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile \
    --production --ignore-scripts

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN  bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/dist /app/dist
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/drizzle /app/drizzle
COPY --from=prerelease /app/scripts /app/scripts

USER bun
EXPOSE 8000/tcp
CMD [ "bun", "run", "serve"  ]
