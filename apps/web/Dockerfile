# Tech Tips & Tricks Hub — Web
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
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:5000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
RUN pnpm --filter @tech-tips-hub/web build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/package.json ./
COPY --from=build /app/apps/web/next.config.js ./
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r => { if (!r.ok) process.exit(1) })"
CMD ["node", "/app/node_modules/next/dist/bin/next", "start", "-p", "3000"]
