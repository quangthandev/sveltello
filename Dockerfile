FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm support
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

COPY . .

ARG DATABASE_URL=file:dev.db
ARG PUBLIC_SENTRY_DSN

RUN pnpm run build
RUN pnpm prune --production

FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
CMD ["node", "build"]