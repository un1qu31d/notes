# 6. Open questions

Left open on purpose. Settle each one in the plan for its slice, or in an ADR, then move the answer into the relevant requirement.

| # | Question | Expected default | Settle by |
| --- | --- | --- | --- |
| Q1 | How does the stored body hold link IDs: `[[id\|Title]]` in the Markdown, or a parsed representation? The owner must always type and see titles. | IDs inside the stored Markdown, converted for editing and display | P3-1 / P5-1 |
| Q2 | Which editor library, and how do `[[` autocomplete and live preview work? | CodeMirror 6 with Markdown live preview | P3-2 |
| Q3 | Markdown rendering pipeline and plugin set? | unified / remark / rehype | P3-1 |
| Q4 | Search implementation? | PostgreSQL full-text search, `simple` config, GIN index | P6-1 |
| Q5 | Attachment storage? | Local disk behind a storage interface | P3-4 |
| Q6 | How does the purge run: a scheduled job, or cleanup on access? | Daily scheduled job in the API | P7-4 |
| Q7 | Which fractional-index library? | `fractional-indexing`; sort keys use the `C` collation | P2-3 |
| Q8 | Export file naming and folder layout details? | `Subject/Source/Note.md`, de-duplicated per folder | P8-2 |
| Q9 | Is derived data computed synchronously on save? | Yes (one user) | P3-1 |
| Q10 | Embed depth limit? | 3 levels | P5-4 |
| Q11 | How are concurrent edits detected (NFR-012)? | Version number with optimistic locking | Later |
