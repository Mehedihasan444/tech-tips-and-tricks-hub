# Tech Tips & Tricks Hub

A full-stack social platform where users publish tech tips and tutorials, with real-time chat,
stories, comments, search, and a premium subscription tier.

This repository is a **[Turborepo](https://turborepo.com) monorepo** using **pnpm workspaces**.

![Turborepo](https://img.shields.io/badge/Turborepo-2.11.5-black?style=flat-square&logo=turborepo)
![Next.js](https://img.shields.io/badge/Next.js-14.2.14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-black?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-green?style=flat-square&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=flat-square&logo=socket.io)

---

## Table of Contents

- [Packages](#packages)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Root Scripts](#root-scripts)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Socket.IO Events](#socketio-events)
- [Deployment](#deployment)
- [Repository History](#repository-history)
- [Known Issues](#known-issues)

---

## Packages

| Package              | Path       | Description                                         |
| -------------------- | ---------- | --------------------------------------------------- |
| `@tech-tips-hub/web` | `apps/web` | Next.js 14 (App Router) web client                  |
| `@tech-tips-hub/api` | `apps/api` | Express + TypeScript REST API and Socket.IO gateway |

### Tech stack

**Client** — Next.js 14.2.14 (App Router) · React 18 · TypeScript · NextUI v2 · Tailwind CSS 3.4 ·
TanStack React Query 5 · NextAuth 4 (Google OAuth) · Socket.IO client 4.8 · Framer Motion ·
Chart.js · Leaflet · Quill · pdfmake

**Server** — Express 4.21 · TypeScript 5 · Mongoose 8 (MongoDB) · Socket.IO 4.8 · Zod ·
jsonwebtoken · bcryptjs · Cloudinary + Multer · Meilisearch · Nodemailer (Gmail SMTP) + Handlebars ·
AamarPay

---

## Prerequisites

- **Node.js >= 20.19.0** (developed and verified on v22.22.3, pinned via `.nvmrc`)
- **pnpm >= 9** (this repo uses pnpm workspaces; `packageManager` is pinned to `pnpm@12.8.1`)
- **MongoDB** running locally (or a reachable connection string)
- Optional: a **Meilisearch** instance (search degrades if absent)

---

## Getting Started

```bash
# 1. Install all workspace dependencies from the repo root (single lockfile)
pnpm install

# 2. Create your env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Fill in the values (see Environment Variables below)

# 4. Start client and server together
pnpm dev
```

`pnpm dev` runs both apps in parallel via Turbo. To run just one:

```bash
pnpm --filter @tech-tips-hub/api dev   # API on  :5000
pnpm --filter @tech-tips-hub/web dev   # Web  on  :3000
```

| App      | Dev URL                      |
| -------- | ---------------------------- |
| Client   | http://localhost:3000        |
| Server   | http://localhost:5000        |
| API base | http://localhost:5000/api/v1 |

> **Note** — the server seeds an admin user on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
> (`apps/api/src/app/utils/seeding.ts`).

---

<!-- SECTION:ENV -->

## Environment Variables

Copy the example files; every variable below is read by the running app.

### `apps/api/.env`

| Variable                 | Required | Purpose                                                  |
| ------------------------ | -------- | -------------------------------------------------------- |
| `NODE_ENV`               | Yes      | `development` / `production` (drives SMTP `secure` flag) |
| `PORT`                   | Yes      | HTTP port, defaults to `5000` in the example             |
| `CLIENT_URL`             | Yes      | Web origin; used for the CORS allow-list and email links |
| `SERVER_URL`             | Yes      | Public API URL; used to build payment redirect URLs      |
| `DB_URL`                 | Yes      | MongoDB connection string                                |
| `BCRYPT_SALT_ROUNDS`     | Yes      | Password hashing cost                                    |
| `JWT_ACCESS_SECRET`      | Yes      | Access-token signing secret                              |
| `JWT_ACCESS_EXPIRES_IN`  | Yes      | e.g. `1d` (parsed by `ms`)                               |
| `JWT_REFRESH_SECRET`     | Yes      | Refresh-token signing secret                             |
| `JWT_REFRESH_EXPIRES_IN` | Yes      | e.g. `7d`                                                |
| `ADMIN_EMAIL`            | Yes      | Admin account seeded on boot                             |
| `ADMIN_PASSWORD`         | Yes      | Admin password                                           |
| `ADMIN_PROFILE_PHOTO`    | No       | Admin avatar URL                                         |
| `ADMIN_MOBILE_NUMBER`    | No       | Admin mobile number                                      |
| `CLOUDINARY_CLOUD_NAME`  | Feature  | Cloudinary image storage                                 |
| `CLOUDINARY_API_KEY`     | Feature  | Cloudinary API key                                       |
| `CLOUDINARY_API_SECRET`  | Feature  | Cloudinary API secret                                    |
| `MEILISEARCH_HOST`       | No       | Meilisearch host                                         |
| `MEILISEARCH_MASTER_KEY` | No       | Meilisearch API key                                      |
| `SENDER_EMAIL`           | Feature  | Gmail sender address                                     |
| `SENDER_APP_PASS`        | Feature  | Gmail **App Password**, not the account password         |
| `RESET_PASS_UI_LINK`     | Yes      | Path appended to `CLIENT_URL` for reset emails           |
| `STORE_ID`               | Feature  | AamarPay store id                                        |
| `SIGNATURE_KEY`          | Feature  | AamarPay signature key                                   |
| `PAYMENT_URL`            | Feature  | AamarPay checkout endpoint                               |
| `PAYMENT_VERIFY_URL`     | Feature  | AamarPay verification endpoint                           |

Variables marked _Feature_ are only needed when that feature is used (uploads, email, payments).

### `apps/web/.env.local`

| Variable                 | Required | Purpose                                  |
| ------------------------ | -------- | ---------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL` | Yes      | API origin; the client appends `/api/v1` |
| `SERVER_URL`             | No       | Fallback origin on the server            |
| `NEXTAUTH_SECRET`        | Yes      | NextAuth signing secret                  |
| `NEXTAUTH_URL`           | Yes      | e.g. `http://localhost:3000`             |
| `GOOGLE_ID`              | Feature  | Google OAuth client id                   |
| `GOOGLE_SECRET`          | Feature  | Google OAuth client secret               |
| `JWT_ACCESS_SECRET`      | Yes      | **Must match the server value**          |

> **`JWT_ACCESS_SECRET` must be identical in both apps.** `apps/web/src/middleware.ts` decodes
> the access-token cookie with it to enforce role-based routing.

> **Build-time requirement** — `NEXT_PUBLIC_SERVER_URL` must be set when running `pnpm build`.
> It is embedded into the client bundle at build time. Turbo treats it as a cache input, so
> changing it correctly invalidates the cache and triggers a rebuild.

---

## Root Scripts

| Script            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `pnpm dev`        | Run client + server dev servers in parallel                     |
| `pnpm build`      | Build both packages (Turbo caches the output)                   |
| `pnpm start`      | Start production servers for both packages                      |
| `pnpm lint`       | Lint both packages (API currently fails on pre-existing errors) |
| `pnpm lint:web`   | Lint the web app only (currently clean)                         |
| `pnpm lint:api`   | Lint the API app only                                           |
| `pnpm type-check` | Type-check both packages without emitting                       |
| `pnpm clean`      | Remove build output, caches, and `node_modules`                 |
| `pnpm format`     | Format the repo with Prettier                                   |

Tasks are defined in `turbo.json`. `build` caches to `.next/` and `dist/`; `dev` and `start` are
persistent and never cached.

```bash
npx turbo run build --filter=@tech-tips-hub/api
npx turbo run dev --filter=@tech-tips-hub/web
```

---

## Architecture

```
tech-tips-and-tricks-hub/
├── apps/
│   ├── web/             # Next.js app (App Router)
│   │   └── src/
│   │       ├── app/       # Route groups: (auth), (commonLayout), (dashboardLayout)
│   │       ├── components/ui/
│   │       ├── config/    # axios instance, NextAuth options, env config
│   │       ├── context/   # socket + user providers
│   │       ├── hooks/     # React Query hooks (post, comment, user, payment, ...)
│   │       ├── services/  # per-feature HTTP service layer
│   │       ├── types/
│   │       ├── utils/
│   │       └── middleware.ts
│   └── api/             # Express API
│       └── src/
│           ├── app.ts     # Express app (CORS, parsers, /api/v1, error handlers)
│           ├── server.ts  # bootstrap: connect DB -> seed -> subscription check -> listen
│           └── app/
│               ├── builder/     # QueryBuilder (search/filter/sort/paginate)
│               ├── config/      # env config, Cloudinary, Multer
│               ├── errors/      # AppError + mongoose/zod/duplicate handlers
│               ├── middlewares/ # auth, validation, body parsing, error handling
│               ├── modules/     # feature modules (see API Reference)
│               ├── socket/      # Socket.IO gateway
│               └── utils/       # seeding, email, Meilisearch, token helpers
├── package.json         # pnpm workspaces root
├── turbo.json           # task graph + cache config
└── package-lock.json    # single lockfile for the whole workspace
```

**Request flow (client → server)**

1. `apps/web/src/config/axios.config.ts` attaches the `accessToken` cookie as the
   `Authorization` header.
2. On a `401`, the response interceptor calls `/auth/refresh-token` and retries the request once.
3. `middleware.ts` guards page routes: unauthenticated users are redirected to `/login`, and
   decoded roles gate `/dashboard` (USER) and `/admin-dashboard` (ADMIN).

---

## API Reference

All routes are mounted under **`/api/v1`**. `USER` / `ADMIN` denote role-protected routes.

### Auth — `/auth`

| Method | Path               | Auth        | Description                                   |
| ------ | ------------------ | ----------- | --------------------------------------------- |
| POST   | `/register`        | —           | Register with email + password                |
| POST   | `/login`           | —           | Login, returns access + refresh tokens        |
| POST   | `/social-login`    | —           | Google OAuth sign-in                          |
| POST   | `/forget-password` | —           | Request a password reset email                |
| POST   | `/reset-password`  | USER, ADMIN | Reset password                                |
| POST   | `/refresh-token`   | —           | Exchange refresh token for a new access token |

### Posts — `/posts`

| Method | Path   | Auth | Description                                |
| ------ | ------ | ---- | ------------------------------------------ |
| POST   | `/`    | USER | Create post (max 3 images)                 |
| GET    | `/`    | —    | List posts (query, filter, sort, paginate) |
| GET    | `/:id` | —    | Single post                                |
| PUT    | `/:id` | USER | Update post (max 3 images)                 |
| DELETE | `/:id` | USER | Delete post                                |

### Users — `/users`

| Method | Path                    | Auth  | Description                    |
| ------ | ----------------------- | ----- | ------------------------------ |
| POST   | `/create-user`          | ADMIN | Create a user                  |
| GET    | `/`                     | —     | List users                     |
| GET    | `/:nickName`            | —     | Single user by nickname        |
| PUT    | `/update-profile-photo` | —     | Upload profile photo (Multer)  |
| PUT    | `/:id`                  | —     | Update follow / follower lists |
| DELETE | `/:id`                  | ADMIN | Delete user                    |

### Comments — `/comments`

| Method | Path   | Auth | Description         |
| ------ | ------ | ---- | ------------------- |
| POST   | `/`    | USER | Create comment      |
| GET    | `/`    | —    | Comments for a post |
| PUT    | `/`    | USER | Update comment      |
| DELETE | `/`    | USER | Delete comment      |
| GET    | `/:id` | —    | Single comment      |

### Stories — `/stories`

| Method | Path            | Auth        | Description     |
| ------ | --------------- | ----------- | --------------- |
| POST   | `/`             | —           | Create story    |
| GET    | `/`             | USER, ADMIN | All stories     |
| GET    | `/user/:userId` | —           | Stories by user |
| DELETE | `/:id`          | USER, ADMIN | Delete story    |

### Friends, Search, Payments, Uploads

| Method | Path                    | Auth | Description                   |
| ------ | ----------------------- | ---- | ----------------------------- |
| GET    | `/friends`              | USER | List friends                  |
| GET    | `/search-posts`         | —    | Search posts via Meilisearch  |
| POST   | `/payment`              | —    | Create AamarPay session       |
| GET    | `/payment`              | —    | List payments                 |
| POST   | `/payment/confirmation` | —    | Gateway success callback      |
| POST   | `/payment/failed`       | —    | Gateway failure callback      |
| POST   | `/image-upload`         | —    | Upload an image to Cloudinary |

`GET /` on the server returns a health-check payload.

---

## Socket.IO Events

Defined in `apps/api/src/app/socket/socket.ts`.

**Client → server:** `join-user-room`, `join-post-room`, `leave-post-room`, `typing-start`,
`typing-stop`, `chat-message`, `get-chat-history`, `mark-message-read`, `typing-chat-start`,
`typing-chat-stop`, `view-story`, `get-story-views`, `mark-notification-read`,
`mark-all-notifications-read`, `clear-notifications`

**Server → client:** `online-users`, `user-online`, `user-offline`, `user-typing`,
`user-typing-chat`, `chat-message`, `chat-history`, `notifications-history`, `notification`,
`story-view-update`, `story-views-response`

Rooms use the `user:<userId>` and `post:<postId>` naming convention.

---

## Deployment

Both apps deploy independently. In a monorepo, set **Root Directory** on each platform.

**Client (Vercel)**

- Root Directory: `apps/web`
- Build Command: `pnpm build`
- Install Command: `pnpm install`
- Environment: the `apps/web` variables above

**Server (Railway / Render / Fly.io)**

- Root Directory: `apps/api`
- Build Command: `pnpm build`
- Start Command: `pnpm start:prod`
- Environment: the `apps/api` variables above
- Requires a hosted MongoDB

> `apps/api/vercel.json` targets `@vercel/node` with `dist/server.js`. Long-lived Socket.IO
> connections need a host that supports WebSockets; a plain serverless function will drop them.

---

## Repository History

This project was originally two independent repositories. Both histories were merged into this
monorepo with `git subtree add`, so all prior commits are preserved:

```bash
git log --oneline                      # 108 commits
git log --oneline -- apps/web       # 81 legacy client commits
git log --oneline -- apps/api       # 24 legacy server commits
```

Legacy remotes, kept for reference:

- `https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend.git`
- `https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-backend.git`

---

## Known Issues

- **Deprecation warnings.** `@nextui-org/*` is deprecated in favour of `@heroui/*`, and the
  pinned Next.js 14.2.14 has a published security advisory. Both are pre-existing and were left
  as-is; upgrading is a separate change.
- **Edge runtime warnings.** `apps/web/src/utils/jwt.decode.ts` imports `jsonwebtoken`, which
  uses Node APIs. The build warns but succeeds.
- **Blocked install scripts.** npm skipped postinstall scripts for `sharp`, `core-js`, and
  `unrs-resolver`. Run `npm install-scripts approve <pkg>` if you hit native-module errors.
- **`pnpm lint` fails on the API.** `apps/api` has 41 pre-existing ESLint errors
  (`no-explicit-any`, `no-unused-vars`, `prefer-const`, `no-unsafe-optional-chaining`) plus 26
  `no-console` warnings. These are inherited from the original codebase, not introduced here.
  `pnpm lint:web` is clean. Use `pnpm lint:api` / `pnpm lint:web` to target one package.
- **No tests.** Neither package has a test suite configured.

### Changes made during the monorepo migration

These were required to get `pnpm build` passing; all are pre-existing issues that the old
per-package lockfiles were hiding.

- Added `export const dynamic = "force-dynamic"` to the admin `author-transactions` and
  `user-transactions` pages. Both are async Server Components that fetch live payment data, so
  without it `next build` tried to prerender them and failed with `ECONNREFUSED`.
- Narrowed `expiresIn` in `apps/api/src/app/utils/verifyJWT.ts`. `@types/jsonwebtoken` 9.0.10
  (previously pinned to 9.0.7) tightened the type to the `ms` `StringValue` union.
- Narrowed the `pdfmake/build/vfs_fonts` import in `DownloadPdf.tsx`. `@types/pdfmake` 0.2.13
  (previously 0.2.9) types it as a flat string map, but it exports `{ pdfMake: { vfs } }` at runtime.

---

## Contributing

```bash
git checkout -b feature/my-change
pnpm type-check && pnpm lint
pnpm build
```

Use conventional commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

---

## License

No `LICENSE` file exists in this repository. The earlier per-app READMEs referenced MIT and linked
to a file that was never committed — add a `LICENSE` file before distributing this code.
