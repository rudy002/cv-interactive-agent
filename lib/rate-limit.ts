/**
 * Fixed-window in-memory rate limiter.
 *
 * `/api/chat` is a public proxy in front of an n8n workflow that spends real
 * OpenAI/Pinecone credits, so an unthrottled endpoint is a billing incident
 * waiting to happen. This keeps the cost of a naive flood bounded without
 * adding infrastructure.
 *
 * Caveat worth knowing: serverless instances do not share memory, so the
 * effective limit is per instance. That is enough to stop casual abuse; move to
 * a shared store (Upstash Redis) if the site ever gets seriously targeted.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix ms timestamp at which the current window resets. */
  resetAt: number;
  /** Seconds the caller should wait before retrying. Only set when blocked. */
  retryAfter: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Injectable clock, so tests do not have to sleep. */
  now?: () => number;
}

export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>();

  /** Drop expired buckets so a long-lived instance cannot grow unbounded. */
  function sweep(currentTime: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= currentTime) buckets.delete(key);
    }
  }

  return function check(key: string): RateLimitResult {
    const currentTime = now();

    // Cheap amortised cleanup; the map only ever holds active clients.
    if (buckets.size > 512) sweep(currentTime);

    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= currentTime) {
      const resetAt = currentTime + windowMs;
      buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt, retryAfter: 0 };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: existing.resetAt,
        retryAfter: Math.max(1, Math.ceil((existing.resetAt - currentTime) / 1000)),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: limit - existing.count,
      resetAt: existing.resetAt,
      retryAfter: 0,
    };
  };
}

/**
 * Best-effort client identity. Behind Vercel, `x-forwarded-for` is set by the
 * platform; the first entry is the real client.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip") ?? "unknown";
}
