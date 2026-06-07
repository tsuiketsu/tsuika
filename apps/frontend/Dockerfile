FROM oven/bun:1 AS base
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_GENAI_API_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_GENAI_API_KEY=${VITE_GENAI_API_KEY}

FROM base AS prepare
COPY . .
RUN bunx --bun turbo@2.9.16 prune frontend --docker

FROM base as install
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
RUN bun turbo build


FROM base AS release
WORKDIR /app/apps/frontend
RUN useradd --system --uid 1001 --gid bun tanstack

COPY --from=install    --chown=tanstack:bun /temp/prod/node_modules ./node_modules
COPY --from=prerelease --chown=tanstack:bun /app/apps/frontend/dist ./dist
COPY --from=prerelease --chown=tanstack:bun /app/apps/frontend/package.json ./package.json

USER tanstack
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "serve", "--host", "--port", "3000" ]
