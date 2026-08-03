/**
 * Streaming plumbing between n8n and the browser.
 *
 * The agent takes 5–10s to produce a full answer, and none of it is visible
 * until the very end. If the n8n workflow is switched to a streaming response,
 * these helpers turn its newline-delimited JSON into Server-Sent Events the
 * chat can append token by token. When n8n answers with plain JSON — today's
 * setup — nothing here runs and the buffered path is used unchanged.
 */

/** Content types we treat as an incremental upstream response. */
const STREAMING_CONTENT_TYPES = [
  "text/event-stream",
  "application/x-ndjson",
  "application/stream+json",
  "application/jsonl",
];

export function isStreamingContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const normalized = contentType.toLowerCase();
  return STREAMING_CONTENT_TYPES.some((type) => normalized.includes(type));
}

/**
 * Pull the text out of one upstream line.
 *
 * n8n emits `{"type":"begin"|"item"|"end", "content":"…"}`; other setups use
 * `delta`, `output` or `text`. Envelope-only lines yield nothing.
 */
export function extractDelta(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Tolerate an SSE-style "data: " prefix from upstreams that already speak SSE.
  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
  if (!payload || payload === "[DONE]") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    // A bare text chunk is valid too.
    return payload;
  }

  if (typeof parsed === "string") return parsed || null;
  if (typeof parsed !== "object" || parsed === null) return null;

  const record = parsed as Record<string, unknown>;
  if (record.type === "begin" || record.type === "end") return null;

  for (const key of ["content", "delta", "output", "text", "chunk"]) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }

  return null;
}

export interface ChunkParseResult {
  deltas: string[];
  /** Incomplete trailing line, to be prepended to the next chunk. */
  rest: string;
}

/**
 * Split a network chunk into complete lines, keeping the partial tail.
 * Network boundaries do not respect line boundaries, so buffering is required.
 */
export function parseChunk(buffered: string, chunk: string): ChunkParseResult {
  const combined = buffered + chunk;
  const lines = combined.split(/\r?\n/);
  const rest = lines.pop() ?? "";

  const deltas: string[] = [];
  for (const line of lines) {
    const delta = extractDelta(line);
    if (delta !== null) deltas.push(delta);
  }

  return { deltas, rest };
}

/** Encode one delta as an SSE frame for our own `/api/chat` response. */
export function encodeSseDelta(delta: string): string {
  return `data: ${JSON.stringify({ delta })}\n\n`;
}

export function encodeSseDone(sessionId: string): string {
  return `data: ${JSON.stringify({ done: true, sessionId })}\n\n`;
}

export function encodeSseError(error: string): string {
  return `data: ${JSON.stringify({ error })}\n\n`;
}

/** Decode one frame received by the browser. */
export type SseEvent =
  | { kind: "delta"; delta: string }
  | { kind: "done"; sessionId: string }
  | { kind: "error"; error: string };

export function decodeSseFrame(frame: string): SseEvent | null {
  const line = frame.split(/\r?\n/).find((candidate) => candidate.startsWith("data:"));
  if (!line) return null;

  try {
    const payload = JSON.parse(line.slice(5).trim()) as Record<string, unknown>;

    if (typeof payload.error === "string") return { kind: "error", error: payload.error };
    if (payload.done === true) {
      return { kind: "done", sessionId: String(payload.sessionId ?? "") };
    }
    if (typeof payload.delta === "string") return { kind: "delta", delta: payload.delta };
  } catch {
    return null;
  }

  return null;
}
