FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS prepare
COPY . .
RUN bunx --bun turbo@2.9.16 prune api --docker

FROM base AS install
RUN mkdir -p /temp/dev
COPY --from=prepare /app/out/json/ /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

RUN mkdir -p /temp/prod
COPY --from=prepare /app/out/json/ /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile \
  --production --ignore-scripts

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prepare /app/out/full .

ENV NODE_ENV=production
RUN  bun turbo build


FROM base AS release
COPY --from=prerelease  /app/apps/api/dist ./dist
COPY --from=prerelease  /app/apps/api/drizzle ./drizzle

USER bun
EXPOSE 8000/tcp
CMD [ "bun", "dist/index.js"  ]
