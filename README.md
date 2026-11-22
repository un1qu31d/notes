# Learning Notes System

A personal web app for writing, organizing, finding and reviewing learning notes — built as a practice project, step by step, with engineering best practices.

## Approach

- **Design-first API contract** — the contract is written and reviewed before code; the API must prove it matches it, and clients are generated from it.
- **Test-first** for domain logic and API behaviour; UI tests added after.
- **Small, reviewed steps** — one story per pull request, CI must pass, decisions recorded as ADRs.

## Status

Phase 1 — domain model and architecture decisions, now in review. No application code yet; Phase 2 (walking skeleton) comes next.

## Links

- Work tracking: [Jira project NOTES](https://chlvrt-notes.atlassian.net/jira/software/projects/NOTES/boards/2)
- Documentation: [Confluence space Notes](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/overview)
  - [Domain model](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/1048586/Domain+model) — what the system is for and its rules
  - [Decisions](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/753673/Decisions) — architecture decision records (ADRs)
  - [Glossary](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/1146937/Glossary) — the words of the domain
  - [Data model](https://chlvrt-notes.atlassian.net/wiki/spaces/NOTES/pages/1146958/Data+model) — the database tables
