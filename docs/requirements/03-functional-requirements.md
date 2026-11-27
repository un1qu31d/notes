# 3. Functional requirements

Format: **ID — title** (priority). Each has acceptance criteria (AC) written so they can become tests.

```
Subject ──< Source ──< Note (tree, ordered)
                         ├── links / embeds to other Notes (any source, any subject)
                         └── tags
```

---

## 3.1 Access

### FR-001 — Owner sign-in (M)
The single owner signs in with email and password. The owner account is created by a seed, and there is no sign-up.
- AC1: Correct credentials start a session; wrong ones are rejected with a generic message.
- AC2: Every page and API endpoint except sign-in requires a session.
- AC3: Sign-out ends the session on the server.
- AC4: The password is stored only as a strong one-way hash (e.g. Argon2id).

---

## 3.2 Subjects

### FR-010 — Create, rename, list subjects (M)
- AC1: A subject has a non-blank title. Whitespace alone counts as blank.
- AC2: Subjects are listed by title.
- AC3: Each subject in the list shows its progress (FR-060).

---

## 3.3 Sources

### FR-015 — Create and edit a source (M)
- AC1: An **external source** has a kind (`book`, `course`, `video`, `article`), a non-blank title, and optional authors and URL.
- AC2: An **own source** has only a title; authors and URL are rejected.
- AC3: A new source is added at the end of its subject's list unless a position is given.

### FR-016 — Reorder and move sources (M)
- AC1: Sources can be reordered within a subject by drag and drop or a keyboard alternative.
- AC2: A source can move to another subject, and all its notes go with it.
- AC3: Reordering never renumbers other sources (stable sort keys).

---

## 3.4 Outline set-up

### FR-020 — Table of contents paste (M)
Creating or extending an outline accepts pasted text and creates the empty note tree in one step.
- AC1: Accepts an **indented list** (spaces, tabs, `-`/`*`/`1.` markers) and **Markdown headings** (`#`, `##`, …).
- AC2: Indentation level or heading depth gives nesting, and line order gives position.
- AC3: Blank lines are ignored, and list markers and numbering are stripped from titles.
- AC4: A preview shows the tree that will be created before it is confirmed.
- AC5: The paste can target the source's top level or under an existing note, at a chosen position.
- AC6: All created notes have empty bodies (status *not started*).

### FR-021 — Add, rename, reorder notes individually (M)
- AC1: A note can be added before, after or under any note.
- AC2: Siblings can be reordered with drag and drop and with the keyboard.
- AC3: Indent and outdent are supported (Tab / Shift+Tab in the outline).

### FR-022 — Move a note (M)
- AC1: A note moves anywhere in its outline, or to another source in any subject. Its whole subtree moves with it.
- AC2: A note cannot move into its own subtree.
- AC3: All links to and from moved notes keep working.

### FR-023 — Source location (S)
- AC1: A note may have one location: a page range (books), a time range (videos and courses) or an anchor or heading (articles).
- AC2: In a range, start ≤ end. Only one kind of location is set at a time.
- AC3: A child note with no location of its own shows its parent's (inherited, displayed as such).

---

## 3.5 Writing notes

### FR-030 — Rich Markdown editor (M)
The body is Obsidian-like Markdown, edited with live preview.
- AC1: Supports CommonMark, tables, task lists, footnotes, and fenced code with syntax highlighting.
- AC2: Supports LaTeX math, inline and block.
- AC3: Supports Mermaid diagrams.
- AC4: Supports Obsidian-style callouts (`> [!note]`, `> [!warning]`, …).
- AC5: Typing feels instant; saving does not block typing (see NFR-001).
- AC6: Changes are saved automatically, and a visible indicator shows saved, saving or failed.
- AC7: An offline indicator is shown when the API cannot be reached.

### FR-031 — Attachments (M)
- AC1: Images and files can be pasted, dropped or uploaded into a body.
- AC2: Images render inline; other files render as download links.
- AC3: Attachments are referenced by ID, so a note made with *Use as draft* keeps working images.
- AC4: Attachment storage sits behind an interface (local disk first).

### FR-032 — Tags (M)
- AC1: `#tag` in a body is a tag. Nested tags (`#db/indexing`) are allowed.
- AC2: Tags are derived from the body on save, stored lower-case. There is no separate tag form.
- AC3: `#` inside code, URLs or headings markup is not a tag.

---

## 3.6 Links and embeds

### FR-040 — Typing a link (M)
- AC1: Typing `[[` opens autocomplete over visible notes, showing each candidate's outline path.
- AC2: A typed `[[Title]]` that matches **exactly one** note links to it.
- AC3: A typed `[[Title]]` that matches **several** notes asks the owner to pick one.
- AC4: A typed `[[Title]]` with **no match** is left *unlinked*. It never creates a note.
- AC5: **Pasted** text containing `[[Title]]` is always left *unlinked*, even if it would match.

### FR-041 — Links survive rename and move (M)
- AC1: Links are stored against the target note's ID, not its title.
- AC2: Renaming or moving the target never breaks a link; the link shows the target's current title.

### FR-042 — Link states (M)
- AC1: Every link is *linked*, *unlinked* or *broken*, and each state looks visibly different.
- AC2: An unlinked or broken link can be pointed at a note by picking a target.
- AC3: Broken links are never silently hidden.

### FR-043 — Backlinks (M)
- AC1: Each note shows "referenced by": the visible notes whose bodies link to it, with outline paths.
- AC2: Backlinks are derived, never edited by hand.

### FR-044 — Embeds (S)
`![[Title]]` behaves as in Obsidian.
- AC1: Shows the target's own body in place, in a framed block with its title linking to the note. Child notes are not included.
- AC2: Embeds inside embeds render up to a depth limit.
- AC3: A loop (A embeds B, B embeds A) stops and renders as a link.
- AC4: An embed of a not-started note shows its title with a "not started" mark.
- AC5: Embed resolution follows the same rules as links (FR-040 to FR-042).

---

## 3.7 Status, progress and review

### FR-050 — Note status (M)
- AC1: A note is *not started* when its body is empty or whitespace only, and *filled* otherwise.
- AC2: There is no manual status.

### FR-060 — Progress (M)
- AC1: A source shows filled leaf notes out of all leaf notes, e.g. "14 of 32 sections filled".
- AC2: Container notes don't count. A note whose children are all trashed counts as a leaf.
- AC3: A subject shows the sum over its visible sources.
- AC4: Trashed items are excluded.

### FR-070 — Reading view (M)
The subject page is the review.
- AC1: Renders every visible source of the subject in order, and every note in outline order, as one continuous document.
- AC2: Headings follow tree depth. Markdown, math, diagrams, callouts, images and embeds are fully rendered.
- AC3: A table-of-contents sidebar navigates within the document and highlights the current position.
- AC4: Not-started notes appear as their heading only, so the structure stays visible.
- AC5: A single source can be read the same way on its own.
- AC6: Any heading jumps to editing that note.
- AC7: Source locations are shown next to headings.

---

## 3.8 Search

### FR-080 — Search (M)
- AC1: Searches titles, body text and tags across all subjects.
- AC2: A tag search also matches nested tags (`db` finds `db/indexing`).
- AC3: Each result shows its outline path (subject › source › parent chain) and a snippet.
- AC4: Trashed items never appear.
- AC5: Matching is whole-word and language-neutral, with no stemming ("index" won't match "indexes").
- AC6: Link and embed markers don't count as body text.

---

## 3.9 Delete, Trash and purge

### FR-090 — Delete to Trash (M)
- AC1: Deleting a note (with its subtree), a source (with its notes) or a subject (with its sources) moves it to the Trash.
- AC2: Trashed items are hidden from outlines, reading views, search, progress, pickers and backlinks.
- AC3: Links elsewhere that pointed at a trashed note become *broken* (FR-042).

### FR-091 — Trash is read-only, no restore (M, decided)
- AC1: The Trash lists deleted items with their deletion date and days left.
- AC2: Trashed items can be opened and read, but not edited, moved or linked to.
- AC3: There is no restore, in the UI or in the API.

### FR-092 — Use as draft (M, decided)
- AC1: A trashed note can be used as a draft: this creates a **new** note (new identity) wherever the owner chooses, starting from the trashed note's title and body.
- AC2: Only that one note is copied, not its children. For a trashed source or subject, the owner browses its notes in the Trash and drafts the ones wanted.
- AC3: Links inside the draft's body keep pointing at their targets.
- AC4: Links elsewhere that pointed at the trashed note stay broken. They do not follow the new note.

### FR-093 — Purge after 30 days (M)
- AC1: Items trashed more than 30 days ago are permanently deleted, together with everything under them.
- AC2: Attachments no longer used by any note (trashed or not) are deleted with their files, but never one uploaded within the last day.
- AC3: Nothing is purged before its own 30 days.

---

## 3.10 Export

### FR-100 — Export a source as one document (S)
- AC1: Produces one Markdown file with the notes in outline order and headings by depth.

### FR-101 — Export everything as an Obsidian vault (S)
- AC1: Produces a folder (zip) of Markdown files, one per note, arranged by subject and source, that opens as an Obsidian vault.
- AC2: Links, embeds, tags, callouts, math, Mermaid and attachments work in Obsidian as they do in the app.
- AC3: Links use Obsidian's shortest unique form: `[[Note]]`, or `[[Source/Note]]` when needed. If the file name differs from the title, the title is kept as display text (`[[Source/Note|Title]]`).
- AC4: File names are unique within a folder and safe on all major file systems.
- AC5: Attachments are exported alongside the notes so embedded images resolve.
- AC6: Unlinked and broken links export as plain text with a visible marker.
- AC7: Trashed items are not exported.
