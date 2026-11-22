import { LoginThrottle, MAX_FAILED_ATTEMPTS, THROTTLE_WINDOW_MS } from './login-throttle';

describe('LoginThrottle', () => {
  let time: number;
  let throttle: LoginThrottle;
  const keys = ['email:me@example.com', 'ip:127.0.0.1'];

  beforeEach(() => {
    time = 1_000_000;
    throttle = new LoginThrottle(() => time);
  });

  it('allows attempts below the limit', () => {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS - 1; i++) throttle.recordFailure(keys);
    expect(throttle.isBlocked(keys)).toBe(false);
  });

  it('blocks after the limit is reached', () => {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) throttle.recordFailure(keys);
    expect(throttle.isBlocked(keys)).toBe(true);
  });

  it('blocks when only one key (e.g. the IP) is over the limit', () => {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) throttle.recordFailure(['ip:127.0.0.1']);
    expect(throttle.isBlocked(['email:other@example.com', 'ip:127.0.0.1'])).toBe(true);
  });

  it('unblocks once the window has passed', () => {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) throttle.recordFailure(keys);
    time += THROTTLE_WINDOW_MS;
    expect(throttle.isBlocked(keys)).toBe(false);
  });

  it('clears the count after a successful sign-in', () => {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) throttle.recordFailure(keys);
    throttle.reset(keys);
    expect(throttle.isBlocked(keys)).toBe(false);
  });
});
