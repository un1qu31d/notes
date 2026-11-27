# Requirements — Learning Notes System

The starting point for the project. These files replace the old Jira/Confluence pages and live in the repo, next to the code, so they change with it in pull requests.

| File | What it holds |
| --- | --- |
| [01-vision-and-scope.md](01-vision-and-scope.md) | Why the product exists, goals, non-goals, anti-goals, constraints |
| [02-glossary.md](02-glossary.md) | The words of the domain, used as-is in code, API and UI |
| [03-functional-requirements.md](03-functional-requirements.md) | What the system does, as numbered requirements with acceptance criteria |
| [04-non-functional-requirements.md](04-non-functional-requirements.md) | Quality, security, engineering and process requirements |
| [05-roadmap.md](05-roadmap.md) | Phases and vertical slices, in build order: the backlog |
| [06-open-questions.md](06-open-questions.md) | Deliberately undecided things, to settle in a plan or ADR |

## Conventions

- **IDs are stable.** `FR-xxx` (functional), `NFR-xxx` (non-functional). IDs are never reused or renumbered; a dropped requirement is marked *Withdrawn*.
- **Priority** uses MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (now).
- **"Decided"** marks a choice the owner has already made; changing it needs a deliberate decision, not a quiet edit.
- **Traceability.** A commit or PR names the requirement or roadmap item it implements, e.g. `feat(FR-020): paste a table of contents`.
- **Decisions** that are costly to reverse go in `docs/adr/` as ADRs (see NFR-030).
