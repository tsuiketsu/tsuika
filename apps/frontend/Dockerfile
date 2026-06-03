FROM oven/bun:1 as base
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_GENAI_API_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_GENAI_API_KEY=${VITE_GENAI_API_KEY}

FROM base as install
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


USER bun
EXPOSE 3000/tcp 
ENTRYPOINT [ "bun", "serve", "--host", "--port", "3000" ]
