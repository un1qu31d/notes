export const MAX_FAILED_ATTEMPTS = 5;
export const THROTTLE_WINDOW_MS = 15 * 60 * 1000;

interface Entry {
  failures: number;
  windowStart: number;
}

/**
 * Limits failed sign-in attempts: 5 per 15 minutes per email and per IP
 * (Specifications §6). In memory, which is enough for a single API instance.
 */
export class LoginThrottle {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly now: () => number = Date.now) {}

  /** True if any of the keys has used up its failed attempts in the current window. */
  isBlocked(keys: string[]): boolean {
    return keys.some((key) => (this.current(key)?.failures ?? 0) >= MAX_FAILED_ATTEMPTS);
  }

  recordFailure(keys: string[]): void {
    for (const key of keys) {
      const entry = this.current(key) ?? { failures: 0, windowStart: this.now() };
      entry.failures += 1;
      this.entries.set(key, entry);
    }
  }

  reset(keys: string[]): void {
    for (const key of keys) this.entries.delete(key);
  }

  private current(key: string): Entry | undefined {
    const entry = this.entries.get(key);
    if (entry && this.now() - entry.windowStart >= THROTTLE_WINDOW_MS) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }
}
