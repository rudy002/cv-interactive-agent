/**
 * Session-scoped cache of answers already produced by the agent.
 *
 * The n8n round trip measures 5–10s, so re-asking the same thing — which is
 * exactly what the suggestion chips invite people to do — should not pay that
 * cost twice. Scoped to `sessionStorage` so a visit stays consistent while a
 * new visit always gets fresh answers.
 */

const STORAGE_KEY = "cv-chat-answers";
const MAX_ENTRIES = 40;
/** Long enough for one visit, short enough that edits to the CV land quickly. */
const TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  answer: string;
  storedAt: number;
}

type CacheShape = Record<string, CacheEntry>;

/** Same question modulo case, accents, punctuation and spacing. */
export function cacheKey(question: string): string {
  return question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function read(): CacheShape {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as CacheShape) : {};
  } catch {
    return {};
  }
}

function write(cache: CacheShape): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Quota exceeded or storage disabled: the cache is an optimisation only.
  }
}

export function getCachedAnswer(question: string, now = Date.now()): string | null {
  const key = cacheKey(question);
  if (!key) return null;

  const entry = read()[key];
  if (!entry || now - entry.storedAt > TTL_MS) return null;

  return entry.answer;
}

export function setCachedAnswer(question: string, answer: string, now = Date.now()): void {
  const key = cacheKey(question);
  if (!key || !answer.trim()) return;

  const cache = read();
  cache[key] = { answer, storedAt: now };

  // Evict the oldest entries rather than letting the store grow forever.
  const keys = Object.keys(cache);
  if (keys.length > MAX_ENTRIES) {
    keys
      .sort((a, b) => cache[a].storedAt - cache[b].storedAt)
      .slice(0, keys.length - MAX_ENTRIES)
      .forEach((stale) => delete cache[stale]);
  }

  write(cache);
}

export function clearAnswerCache(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}
