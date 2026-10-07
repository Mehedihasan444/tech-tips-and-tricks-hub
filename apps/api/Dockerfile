# Tech Tips & Tricks Hub — API
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN pnpm --filter @tech-tips-hub/api build
# Produce a pruned prod-only deployment of the API (no web deps, no devDeps).
RUN pnpm --filter @tech-tips-hub/api --prod deploy /prod/api

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Non-root for least privilege.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nodejs
USER nodejs
COPY --from=build --chown=nodejs:nodejs /prod/api/dist ./dist
COPY --from=build --chown=nodejs:nodejs /prod/api/package.json ./
COPY --from=build --chown=nodejs:nodejs /prod/api/node_modules ./node_modules
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 5000) + '/api/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["node", "./dist/server.js"]
