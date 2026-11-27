# 4. Non-functional requirements

## 4.1 Experience and performance

| ID | Requirement | Pri |
| --- | --- | --- |
| NFR-001 | Typing in the editor has no perceptible lag. Saving is asynchronous and never blocks input. | M |
| NFR-002 | With 5,000 notes, opening a note, saving a note and running a search each take < 300 ms at the API (p95, local). | S |
| NFR-003 | A source of 300 notes opens in its reading view in < 1 s (local). | S |
| NFR-004 | Every main action can be done with the keyboard, including outline reorder, indent and outdent. | S |
| NFR-005 | Meets WCAG 2.2 AA for contrast, focus and labels. | S |
| NFR-006 | Works in current Chrome, Firefox and Safari on desktop. Usable in reading view on a phone. | S |

## 4.2 Data integrity

| ID | Requirement | Pri |
| --- | --- | --- |
| NFR-010 | **The body is the single source of truth.** Links, embeds, tags, attachment references and search text are re-derived from the body on every save. | M |
| NFR-011 | Rules the database can enforce, it enforces: a parent is in the same source, sort keys are unique among visible siblings, titles are not blank, location ranges are valid, own sources have no authors or URL. | M |
| NFR-012 | No data loss on concurrent edits of the same note in two tabs. The later save is detected, and the owner is warned instead of the earlier save being silently overwritten. | S |
| NFR-013 | Backups: a documented command produces a database dump plus attachments, and restoring it is tested. | S |

## 4.3 Security (OWASP ASVS level 1)

| ID | Requirement | Pri |
| --- | --- | --- |
| NFR-020 | Passwords hashed with Argon2id. Sessions are server-side, in http-only, secure, same-site cookies. | M |
| NFR-021 | Sign-in is rate-limited. | M |
| NFR-022 | Rendered Markdown is sanitised. No script runs from note content, including Mermaid and SVG. | M |
| NFR-023 | Uploads are checked for type and size, served with safe headers, and never executed. | M |
| NFR-024 | CSRF protection on state-changing requests; security headers (CSP, etc.). | M |
| NFR-025 | No secrets in the repo; configuration comes from the environment. | M |
| NFR-026 | Dependencies are scanned in CI. | S |

## 4.4 Engineering

| ID | Requirement | Pri |
| --- | --- | --- |
| NFR-030 | **ADRs.** Decisions that are costly to reverse are recorded in `docs/adr/NNNN-title.md` (Status, Context, Decision, Alternatives, Consequences). An accepted ADR is never edited, only superseded. | M |
| NFR-031 | **Design-first contract.** An OpenAPI contract is written and reviewed before the endpoint. CI proves the API conforms, and the web client is generated from it. | M |
| NFR-032 | **Test-first** for domain logic and API behaviour. UI tests come after, for key flows. | M |
| NFR-033 | **Monorepo boundaries** (Nx). Apps and packages depend on each other only as packages or over the network, and module boundaries are enforced by lint. | M |
| NFR-034 | **One definition per boundary.** The contract for the API, the Prisma schema for the database. No hand-copied types. CI fails if migrations drift from the schema. | M |
| NFR-035 | **Use established tools before writing our own** (Markdown parser, editor, fractional indexing, auth). | S |
| NFR-036 | Runs locally with one command (e.g. `docker compose up` for PostgreSQL + `pnpm dev`). Nothing assumes a hosting provider. | M |
| NFR-037 | Structured logs; no note content in logs. | S |

## 4.5 Process (replaces Jira)

| ID | Requirement | Pri |
| --- | --- | --- |
| NFR-040 | Work is tracked as GitHub Issues (or the checklist in [05-roadmap.md](05-roadmap.md)). One roadmap item maps to one issue. | M |
| NFR-041 | One item per branch and per pull request. CI (lint, test, build, typecheck) must pass before merge. | M |
| NFR-042 | Conventional Commits, scoped by requirement or issue: `feat(FR-020): …`, `fix(#12): …`. | M |
| NFR-043 | Requirements and ADRs change only through pull requests, in this folder. | M |
