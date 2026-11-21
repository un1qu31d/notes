# Learning Notes System

A personal web app for writing, organizing, finding and reviewing learning notes.

| What | Where |
|------|-------|
| Requirements | [Confluence › Requirements](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/65803/Requirements) |
| Specifications | [Confluence › Specifications](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/491539/Specifications) |
| Work tracking | [Jira project NOTES](https://chlvrt-notes.atlassian.net/jira/software/projects/NOTES/boards) — one story per requirement, releases v1 / v1.1 / v2 |
| Code | this repository |

## Stack

TypeScript everywhere · **NestJS** API · **Next.js** (App Router) web app · **PostgreSQL** via **Prisma** · Tailwind CSS · npm workspaces.

```
notes/
├── apps/
│   ├── api/        # NestJS — REST API under /api/v1, OpenAPI docs at /api/docs
│   │   ├── prisma/ # schema.prisma, migrations, seed.ts (owner account)
│   │   └── src/
│   └── web/        # Next.js — UI; proxies /api/* to the API
├── packages/
│   └── shared/     # types shared by api and web
├── docker-compose.yml  # PostgreSQL 16 for local development
└── .env.example
```

## Run it locally

Prerequisites: **Node.js 22+** and **Docker**.

```bash
# 1. Install dependencies (creates package-lock.json — commit it)
npm install

# 2. Configure: copy the example and fill in OWNER_EMAIL / OWNER_PASSWORD
cp .env.example .env

# 3. Start PostgreSQL
npm run db:up

# 4. Create the database tables
npm run db:migrate          # name the first migration e.g. "init"

# 5. Create your owner account (there is no sign-up page)
npm run db:seed

# 6. Start the API and the web app together
npm run dev
```

Then open:

- Web app: <http://localhost:3000> — the home page shows whether the API and database are reachable
- API health: <http://localhost:4000/api/v1/health>
- API docs: <http://localhost:4000/api/docs>

## Scripts (from the repository root)

| Script | What it does |
|--------|--------------|
| `npm run dev` | Builds `shared`, then runs the API (port 4000) and web app (port 3000) with `.env` loaded |
| `npm run build` | Production build of shared, api and web |
| `npm test` | API unit tests (Jest) |
| `npm run db:up` / `db:down` | Start / stop PostgreSQL in Docker |
| `npm run db:migrate` | Apply schema changes (`prisma migrate dev`) |
| `npm run db:seed` | Create or update the owner account from `OWNER_EMAIL` / `OWNER_PASSWORD` |

## Working conventions

- Pick a story from Jira and branch from `main` as `NOTES-<n>-short-description`.
- Start commit messages and PR titles with the Jira key, e.g. `NOTES-16: add create-note endpoint`. With the GitHub for Jira app installed, the work then shows up on the story.
- Keep the [Specifications](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/491539/Specifications) page in step when a change affects the API, data model or screens.
- All configuration comes from environment variables (`.env`); never commit `.env`.
