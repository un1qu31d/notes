# 5. Roadmap

The project is built in phases. After the skeleton, each phase is a set of **vertical slices**: contract → API (test-first) → web UI → done. Tick items off here, or turn each one into a GitHub Issue.

## Phase 0 — Foundations

- [ ] P0-1 Requirements in the repo (this folder)
- [ ] P0-2 ADR folder and template; first ADRs: record decisions, one owner, stack, design-first contract, test-first, monorepo boundaries, one definition per boundary
- [ ] P0-3 Domain ADRs: outline made of notes, body as single source of truth, outline storage (adjacency list + fractional sort key), Trash without restore
- [ ] P0-4 Data model document (tables, constraints, key queries)
- [x] P0-5 Nx workspace and CI (lint, test, build, typecheck)

## Phase 1 — Walking skeleton

Thin end-to-end path, deployable locally, with no real features.

- [ ] P1-1 PostgreSQL via Docker Compose; Prisma schema + first migration; CI migration-drift check
- [ ] P1-2 OpenAPI contract package; API conformance test in CI; generated web client
- [ ] P1-3 NestJS API app with a health endpoint
- [ ] P1-4 Next.js web app calling the health endpoint through the generated client
- [ ] P1-5 Owner seed + sign-in / sign-out (FR-001, NFR-020, NFR-021)

## Phase 2 — Structure

- [ ] P2-1 Subjects: create, rename, list (FR-010)
- [ ] P2-2 Sources: create, edit, reorder, move (FR-015, FR-016)
- [ ] P2-3 Outline: add, rename, reorder, indent/outdent (FR-021)
- [ ] P2-4 Table of contents paste with preview (FR-020)
- [ ] P2-5 Move a note or subtree across sources (FR-022)
- [ ] P2-6 Source location (FR-023)

## Phase 3 — Writing

- [ ] P3-1 Shared Markdown package: parse, derive tags, links, embeds and search text (NFR-010)
- [ ] P3-2 Editor with live preview and autosave (FR-030)
- [ ] P3-3 Math, Mermaid, callouts, code highlighting; sanitisation (FR-030, NFR-022)
- [ ] P3-4 Attachments (FR-031, NFR-023)
- [ ] P3-5 Tags (FR-032)
- [ ] P3-6 Status and progress (FR-050, FR-060)

## Phase 4 — Review

- [ ] P4-1 Source reading view (FR-070)
- [ ] P4-2 Subject reading view with TOC sidebar (FR-070)

## Phase 5 — Connections

- [ ] P5-1 `[[` autocomplete, link resolution, pasted links left unlinked (FR-040, FR-041)
- [ ] P5-2 Link states and re-pointing (FR-042)
- [ ] P5-3 Backlinks (FR-043)
- [ ] P5-4 Embeds (FR-044)

## Phase 6 — Find

- [ ] P6-1 Full-text and tag search with outline paths (FR-080)

## Phase 7 — Trash

- [ ] P7-1 Delete to Trash; hide everywhere (FR-090)
- [ ] P7-2 Read-only Trash view (FR-091)
- [ ] P7-3 Use as draft (FR-092)
- [ ] P7-4 Scheduled purge (FR-093)

## Phase 8 — Export

- [ ] P8-1 Source as one Markdown document (FR-100)
- [ ] P8-2 Obsidian vault export (FR-101)

## Later (not planned)

- Block references, hosting, backups automation (NFR-013), concurrent-edit detection (NFR-012).
