# 1. Vision and scope

## 1.1 Intent

The owner studies books, courses, videos and articles, and wants notes that work as an **efficient recap**: reading the notes should make re-reading the book or re-watching the course unnecessary.

Two things decide whether the owner keeps using the system:

1. **Expressing ideas effortlessly.** Writing a note must feel as capable and fluid as Obsidian.
2. **Reviewing ideas meaningfully.** All notes for a subject in one place, **in the same order as the material itself**. That is all "review" means here.

Learning material is not flat. A book has parts, chapters and sections, and a course has modules and lessons. The order of the source matters, so the structure of the notes mirrors the structure of each source.

This is also a practice project for engineering best practices, so decisions are recorded with their reasons.

## 1.2 Goals

| # | Goal |
| --- | --- |
| G1 | Capture a source's structure (its table of contents) quickly, usually all at once before studying. |
| G2 | Write rich notes against each part of that structure. |
| G3 | Read a whole subject or a whole source as one continuous, ordered document. |
| G4 | Connect ideas across sources and subjects, including the owner's own synthesis, without breaking on rename or move. |
| G5 | Find any note by text, title or tag. |
| G6 | Leave nothing locked in: export to plain Markdown that opens as an Obsidian vault. |

## 1.3 Non-goals (won't do)

- Spaced repetition, flashcards, quizzes or review scheduling.
- Multiple users, sharing, collaboration or sign-up. There is one owner.
- Offline editing. An offline indicator is required; offline use is not.
- Block-level references (`[[note#^block]]`). Maybe later, not now.
- Sync with Obsidian or any other tool.

## 1.4 Anti-goals (failure even if everything technically works)

- Notes that are pleasant to fill but never read again.
- Review that feels like busywork: forced ratings, streaks, queues.
- Structure maintenance that costs more effort than the notes themselves.

## 1.5 Constraints

| # | Constraint |
| --- | --- |
| C1 | **Single user.** One owner account, created by a seed. No sign-up. |
| C2 | **Stack (decided):** TypeScript; NestJS API; Next.js web app; PostgreSQL; Prisma. Nx + pnpm monorepo. |
| C3 | **Runs locally first.** Hosting is decided later and must not be assumed. |
| C4 | **Design-first API contract.** The contract is written and reviewed before the code. The API proves it conforms, and clients are generated from it. |
| C5 | **Test-first** for domain logic and API behaviour; UI tests come after. |
| C6 | **Decoupled workspaces.** Apps and packages depend on each other only over the network or as packages, never through file paths. |
| C7 | **One definition per boundary** for data shapes: the API contract for the API, the Prisma schema for the database. |
| C8 | **Security:** OWASP ASVS level 1. |

## 1.6 Success looks like

- A new book's table of contents is set up in under two minutes by pasting it.
- The owner reads a subject's reading view instead of reopening the original material.
- An export opens in Obsidian with links, embeds, tags, math, diagrams and images working.
