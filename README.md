# Learning Notes System

A personal web app for writing, organizing, finding and reviewing learning notes.

| What | Where |
|------|-------|
| Requirements | [Confluence › Requirements](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/65803/Requirements) |
| Specifications | [Confluence › Specifications](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/491539/Specifications) |
| Work tracking | [Jira project NOTES](https://chlvrt-notes.atlassian.net/jira/software/projects/NOTES/boards) — one story per requirement, releases v1 / v1.1 / v2 |
| Code | this repository |

## Stack

TypeScript everywhere · **NestJS** API (+ Swagger) · `@notes/api-client` SDK (orval) · **Next.js** (App Router) web app · **PostgreSQL** via **Prisma** · TanStack Query · Tailwind CSS · npm workspaces.

```
notes/
├── apps/
│   ├── api/                 # NestJS — source of truth for the API; serves its contract at /api/docs-json
│   │   ├── prisma/          # schema.prisma, migrations, seed.ts (owner account)
│   │   └── src/
│   └── web/                 # Next.js — UI; uses @notes/api-client; proxies /api/* to the API
├── packages/
│   └── api-client/          # @notes/api-client — SDK generated from the API contract
│       ├── openapi.json     # contract snapshot (downloaded, committed)
│       └── src/generated/   # client, React Query hooks, Zod schemas (committed)
├── .dependency-cruiser.cjs  # workspace boundary rules (see below)
├── docker-compose.yml       # PostgreSQL 16 for local development (port 5433)
└── .env.example
```

## Run it locally

Prerequisites: **Node.js 22+** and **Docker**.

```bash
# 1. Install dependencies (creates package-lock.json — commit it)
npm install

# 2. Configure: copy the example, then set SESSION_SECRET (openssl rand -hex 32),
#    OWNER_EMAIL and OWNER_PASSWORD (at least 10 characters)
cp .env.example .env

# 3. Start PostgreSQL
npm run db:up

# 4. Create the database tables (applies the migrations in apps/api/prisma/migrations)
npm run db:migrate

# 5. Create your owner account (there is no sign-up page)
npm run db:seed

# 6. Start the API and the web app together
npm run dev
```

Then open:

- Web app: <http://localhost:3000> — sign in with your owner account
- API health: <http://localhost:4000/api/v1/health>
- API docs: <http://localhost:4000/api/docs>

## Scripts (from the repository root)

| Script | What it does |
|--------|--------------|
| `npm run dev` | Runs the API (port 4000) and web app (port 3000) with `.env` loaded |
| `npm run generate:api-client` | Downloads the API contract (API must be running) and regenerates `@notes/api-client` |
| `npm run check:boundaries` | Fails if any workspace breaks the boundary rules (dependency-cruiser) |
| `npm run typecheck` | Type-checks the SDK, the web app and the API |
| `npm test` | API unit tests (Jest) |
| `npm run build` | Production build of api and web |
| `npm run db:up` / `db:down` | Start / stop PostgreSQL in Docker (on port **5433**) |
| `npm run db:migrate` | Apply migrations; after editing `schema.prisma` it also creates a new one (`prisma migrate dev`) |
| `npm run db:seed` | Create or update the owner account from `OWNER_EMAIL` / `OWNER_PASSWORD` |

## API contract

The API is the single source of truth for what it accepts and returns, and the pieces only meet over HTTP or as packages:

1. **`apps/api`** — controllers and DTOs (with `class-validator` rules) define every endpoint, request and response. Swagger turns them into the OpenAPI contract, served at <http://localhost:4000/api/docs-json> (interactive docs at `/api/docs`; neither is served in production).
2. **`packages/api-client`** (`@notes/api-client`) — downloads the contract over HTTP into its own `openapi.json` and generates, with orval, typed functions, TanStack Query hooks and Zod schemas into its own `src/generated/`. Both are committed.
3. **`apps/web`** — depends on `@notes/api-client` like any npm package and imports it by name.

After an API change, with `npm run dev` running:

```bash
npm run generate:api-client
```

Commit the API change, `packages/api-client/openapi.json` and `packages/api-client/src/generated/` together — the PR then shows the contract diff and the client diff. Never edit generated files by hand.

## Boundaries

Apps and packages are decoupled: a workspace may depend on another one **only over the network** (the web app calls the API's URL) **or as a package** (declared in `package.json`, imported by name). Each workspace reads and writes files only inside its own folder.

`npm run check:boundaries` enforces the import side of this with [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) (rules in `.dependency-cruiser.cjs`). It runs in CI on every push and pull request and fails on:

| Rule | Catches |
|------|---------|
| `no-relative-escape` | A relative import that leaves the workspace (`../../api/src/...`) |
| `forbidden-dependency` | A dependency between workspaces that isn't in the `ALLOWED` table (e.g. web → api) |
| `undeclared-dependency` | Importing a package that isn't in your workspace's `package.json` |
| `private-entry-point` | An import that can't be resolved — usually one past a package's `exports` (`@notes/api-client/src/...`) |

Allowed today: `apps/web → packages/api-client`; nothing else depends on anything. To allow a new dependency, update `ALLOWED` in `.dependency-cruiser.cjs` in the same PR, so it gets reviewed.

dependency-cruiser checks imports only. Paths in config files and scripts (e.g. `"extends": "../../tsconfig.base.json"`) aren't checked automatically — keep them inside the workspace and watch for them in review.

## Troubleshooting

- **`Authentication failed` / `role "notes" does not exist` on `db:migrate`** — another PostgreSQL is answering instead of the Docker one. The Docker database listens on port 5433; check that `DATABASE_URL` in `.env` uses `localhost:5433` and that `docker compose ps` shows `db` as running (healthy).
- **`Can't reach database server`** — start it first with `npm run db:up`.

## Working conventions

- Pick a story from Jira and branch from `main` as `NOTES-<n>-short-description`.
- Start commit messages and PR titles with the Jira key, e.g. `NOTES-16: add create-note endpoint`. With the GitHub for Jira app installed, the work then shows up on the story.
- Database changes: edit `apps/api/prisma/schema.prisma`, run `npm run db:migrate` and give the migration a short name (e.g. `add-sources`). Commit the new folder under `apps/api/prisma/migrations/` in the same PR. Never edit a migration that has already been applied — add a new one.
- API changes: update the DTOs/controllers, run `npm run generate:api-client` with the API running, and commit the regenerated `packages/api-client` with the change.
- Respect the boundaries: import other workspaces by package name only; run `npm run check:boundaries` if unsure.
- Keep the [Specifications](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/491539/Specifications) page in step when a change affects the API, data model or screens.
- All configuration comes from environment variables (`.env`); never commit `.env`.
