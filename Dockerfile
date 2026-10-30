FROM node:24.18.0-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG PUBLIC_SENTRY_DSN
ENV DATABASE_URL=file:/tmp/build.db PUBLIC_SENTRY_DSN=$PUBLIC_SENTRY_DSN

RUN pnpm run build
RUN pnpm prune --prod

FROM node:24.18.0-alpine

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./package.json

USER node
EXPOSE 3000
CMD ["node", "build"]
