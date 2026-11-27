# 2. Glossary

These words are used exactly as written in the code, the API contract and the UI.

| Term | Meaning | Not to be confused with |
| --- | --- | --- |
| **Owner** | The one person who uses the system. There are no other users. | User, account |
| **Subject** | A field the owner is learning, e.g. "Distributed Systems". Holds an ordered list of sources. | Tag: a subject is a container, a tag is a label inside text. |
| **Source** | One piece of material within a subject, or the owner's own synthesis. Holds one outline. | Reference, resource |
| **External source** | A source that is real material: a book, course, video or article. Has a title, a kind, and optional author(s) and URL. | Own source |
| **Own source** | The owner's own synthesis, e.g. "My Mental Model". Has only a title. Its notes usually link back to external sources. | External source |
| **Note** | One node of a source's outline, with a title and a body. A chapter and a section are both notes. Belongs to exactly one source. | Section, page, file: there is no separate section concept. |
| **Outline** | The ordered tree of notes in one source, mirroring the material's structure. | Table of contents |
| **Table of contents paste** | Pasted text (an indented list or Markdown headings) that creates or extends an outline in one step, as empty notes. | Import from another tool |
| **Top-level note** | A note with no parent; it sits directly under its source. | Root: the source is the root. |
| **Parent** | The note a note sits under, in the same source. | Source |
| **Position** | A note's place among its siblings, stored as a sort key that never needs renumbering. | Source location |
| **Container note** | A note with child notes, such as a chapter. Not counted in progress. | Leaf note |
| **Leaf note** | A note with no child notes, such as a section. Progress counts only leaf notes. | Container note |
| **Title** | A note's name, shown as its heading and used when typing a link. Need not be unique. | Body |
| **Body** | A note's text, in Obsidian-like Markdown. The single source of truth for links, embeds and tags. | Title |
| **Source location** | Where in the material a note's part lives: a page range, a time range, or an article anchor. Optional; a child without one shows its parent's. | Outline path |
| **Outline path** | Where a note sits in the system: subject › source › parent chain. | Source location |
| **Link** | `[[Title]]` in a body, stored against the target note's ID. | Embed; web link |
| **Linked** | Link state: the target exists and is not in the Trash. | |
| **Unlinked** | Link state: no target chosen yet (pasted text, or no match). Visibly marked; never creates a note. | Broken |
| **Broken** | Link state: the target is in the Trash or purged. Shown, never hidden; can be re-pointed. | Unlinked |
| **Embed** | `![[Title]]` in a body: shows the target note's body in place. Child notes are not included. | Link |
| **Tag** | `#tag` in a body (nested as `#a/b`). Derived from the body on save. | Subject |
| **Backlinks ("referenced by")** | The notes whose bodies link to a given note. Derived, never edited. | Outgoing links |
| **Status** | *Not started* (empty or whitespace-only body) or *filled*. Derived; no manual status. | Progress |
| **Progress** | For a source, filled leaf notes out of all leaf notes ("14 of 32 sections filled"). For a subject, summed over its sources. | Status |
| **Reading view** | The review: a subject or one source rendered as one continuous document in outline order, with a table-of-contents sidebar. | Spaced repetition (a non-goal) |
| **Trash** | Where a deleted note, source or subject goes for 30 days. Read-only; nothing is restored. | Archive |
| **Use as draft** | Creating a new note, with a new identity, from a trashed note's title and body. | Restore, which does not exist |
| **Purge** | Scheduled permanent deletion of items trashed more than 30 days ago. | Delete, which moves to the Trash |
| **Export** | Writing notes out as Markdown: one source as one document, or everything as an Obsidian vault. | Sync (a non-goal) |
| **Search** | Finding notes by title, body text or tag across all subjects; each result shows its outline path. | Filter, which narrows a list on screen |
