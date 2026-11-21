// API response shapes, as defined in Confluence > Specifications §3.
// Field names are snake_case to match the JSON the API returns.

export type UUID = string;
/** ISO 8601 UTC timestamp, e.g. "2026-11-21T18:15:00Z". */
export type Timestamp = string;

export interface User {
  id: UUID;
  email: string;
  display_name: string;
  created_at: Timestamp;
}

export interface SubjectRef {
  id: UUID;
  name: string;
}

export interface Subject extends SubjectRef {
  color: string | null;
  note_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Tag {
  name: string;
  note_count: number;
}

export interface Note {
  id: UUID;
  title: string;
  /** Markdown. */
  body: string;
  /** null = Inbox (FR-21). */
  subject: SubjectRef | null;
  tags: string[];
  is_pinned: boolean;
  /** Incremented on every save; send it back on PATCH to detect conflicts. */
  version: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** A note in list/search results: `body` is replaced by `excerpt`. */
export type NoteSummary = Omit<Note, 'body'> & { excerpt: string };

export interface Paginated<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface HealthStatus {
  status: 'ok';
}
