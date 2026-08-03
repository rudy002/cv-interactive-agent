import { describe, expect, it } from "vitest";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/rate-limit";

/** Controllable clock so the tests never sleep. */
function fakeClock(start = 1_000_000) {
  let now = start;
  return {
    now: () => now,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

describe("createRateLimiter", () => {
  it("allows requests up to the limit and blocks the next one", () => {
    const clock = fakeClock();
    const check = createRateLimiter({ limit: 3, windowMs: 60_000, now: clock.now });

    expect(check("1.2.3.4").allowed).toBe(true);
    expect(check("1.2.3.4").allowed).toBe(true);
    expect(check("1.2.3.4").allowed).toBe(true);

    const blocked = check("1.2.3.4");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("counts down the remaining quota", () => {
    const check = createRateLimiter({ limit: 3, windowMs: 60_000, now: fakeClock().now });
    expect(check("a").remaining).toBe(2);
    expect(check("a").remaining).toBe(1);
    expect(check("a").remaining).toBe(0);
  });

  it("tracks each client independently", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: fakeClock().now });

    expect(check("client-a").allowed).toBe(true);
    expect(check("client-b").allowed).toBe(true);
    expect(check("client-a").allowed).toBe(false);
  });

  it("opens a fresh window once the old one expires", () => {
    const clock = fakeClock();
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: clock.now });

    expect(check("ip").allowed).toBe(true);
    expect(check("ip").allowed).toBe(false);

    clock.advance(60_001);
    expect(check("ip").allowed).toBe(true);
  });

  it("keeps blocking until the window actually elapses", () => {
    const clock = fakeClock();
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: clock.now });

    check("ip");
    clock.advance(59_000);
    expect(check("ip").allowed).toBe(false);
  });

  it("reports a retryAfter of at least one second", () => {
    const clock = fakeClock();
    const check = createRateLimiter({ limit: 1, windowMs: 1_000, now: clock.now });

    check("ip");
    clock.advance(999);
    expect(check("ip").retryAfter).toBe(1);
  });

  it("evicts expired buckets instead of growing forever", () => {
    const clock = fakeClock();
    const check = createRateLimiter({ limit: 5, windowMs: 1_000, now: clock.now });

    for (let i = 0; i < 600; i += 1) check(`client-${i}`);
    clock.advance(2_000);

    // The sweep runs on the next call; every old client is allowed again.
    expect(check("client-0").allowed).toBe(true);
    expect(check("client-599").allowed).toBe(true);
  });
});

describe("clientKeyFromHeaders", () => {
  it("takes the first hop of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" });
    expect(clientKeyFromHeaders(headers)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip", () => {
    expect(clientKeyFromHeaders(new Headers({ "x-real-ip": "198.51.100.5" }))).toBe(
      "198.51.100.5",
    );
  });

  it("falls back to a constant when no header is present", () => {
    expect(clientKeyFromHeaders(new Headers())).toBe("unknown");
  });

  it("ignores an empty x-forwarded-for", () => {
    expect(clientKeyFromHeaders(new Headers({ "x-forwarded-for": "" }))).toBe("unknown");
  });
});
