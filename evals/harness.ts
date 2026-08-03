/**
 * Test harness for the behavioural evaluation suite.
 *
 * Separate from `npm test` on purpose: every case here spends real OpenAI
 * credits and hits the live n8n workflow. The unit suite must stay free and
 * instant; this one runs when you deliberately want to know whether the agent
 * still behaves.
 */

const TARGET = process.env.EVAL_TARGET ?? "https://rudy-haddad-ai.vercel.app";

/**
 * `/api/chat` allows 12 requests per minute per IP. Pace below that, otherwise
 * the suite reports refusals that are really rate-limit errors.
 */
const DELAY_MS = Number(process.env.EVAL_DELAY_MS ?? 5_500);

const REQUEST_TIMEOUT_MS = 60_000;

export interface AskResult {
  answer: string;
  ms: number;
}

/** Rough token accounting so the run can print what it cost. */
export const usage = { calls: 0, answerChars: 0, totalMs: 0 };

let lastCallAt = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** One conversation turn. Each call is a fresh session: cases stay independent. */
export async function ask(question: string): Promise<AskResult> {
  const since = Date.now() - lastCallAt;
  if (lastCallAt && since < DELAY_MS) await sleep(DELAY_MS - since);
  lastCallAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const response = await fetch(`${TARGET}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: question,
        sessionId: `eval-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new Error("rate limited — raise EVAL_DELAY_MS");
    }

    const contentType = response.headers.get("content-type") ?? "";

    // The route answers with SSE when n8n streams, JSON otherwise.
    if (contentType.includes("text/event-stream") && response.body) {
      const text = await response.text();
      const answer = [...text.matchAll(/data: (\{.*\})/g)]
        .map((match) => {
          try {
            return (JSON.parse(match[1]) as { delta?: string }).delta ?? "";
          } catch {
            return "";
          }
        })
        .join("");
      return record(answer, startedAt);
    }

    const data = (await response.json()) as { success?: boolean; message?: string; error?: string };
    if (!response.ok || !data.success || typeof data.message !== "string") {
      throw new Error(`HTTP ${response.status}: ${data.error ?? "unreadable answer"}`);
    }

    return record(data.message, startedAt);
  } finally {
    clearTimeout(timeout);
  }
}

function record(answer: string, startedAt: number): AskResult {
  const ms = Date.now() - startedAt;
  usage.calls += 1;
  usage.answerChars += answer.length;
  usage.totalMs += ms;
  return { answer, ms };
}

const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** True when the answer contains at least one of the alternatives. */
export function mentionsAny(answer: string, alternatives: string[]): boolean {
  const haystack = normalise(answer);
  return alternatives.some((alternative) => haystack.includes(normalise(alternative)));
}

export function mentionsNone(answer: string, forbidden: string[]): string[] {
  const haystack = normalise(answer);
  return forbidden.filter((term) => haystack.includes(normalise(term)));
}

/** Detects the assistant slipping into Rudy's own voice. */
export function speaksAsRudy(answer: string): boolean {
  return /\b(i am rudy|i'm rudy|as a freelancer i|my name is rudy)\b/i.test(answer);
}

export function looksFrench(answer: string): boolean {
  return /\b(je|il|est|les|des|son|ses|avec|pour|dans|vous|sur)\b/i.test(answer);
}

export function looksHebrew(answer: string): boolean {
  return /[\u0590-\u05ff]/.test(answer);
}

export function preflight(): string {
  return TARGET;
}
