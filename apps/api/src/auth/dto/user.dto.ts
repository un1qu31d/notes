/** A user as returned by the API — never includes the password hash. */
export class UserDto {
  /** @example "0b5f3c2e-8d1a-4f6b-9c4e-2a7d1e9f0c11" */
  id: string;

  /** @example "me@example.com" */
  email: string;

  /** @example "me" */
  display_name: string;

  /** ISO 8601 UTC timestamp. @example "2026-11-21T18:15:00.000Z" */
  created_at: string;
}
