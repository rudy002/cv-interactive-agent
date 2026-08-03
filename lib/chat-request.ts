/**
 * Pure request/response helpers for `/api/chat`, kept out of the route handler
 * so they can be unit-tested without spinning up Next.
 */

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_SESSION_ID_LENGTH = 128;

/** Only what we generate client-side: `session-<ms>-<uuid|base36>`. */
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export interface ParsedChatRequest {
  message: string;
  sessionId: string;
}

export type ParseResult =
  | { ok: true; value: ParsedChatRequest }
  | { ok: false; error: string };

/**
 * Validate an untrusted JSON body.
 *
 * The previous handler forwarded `message` straight to n8n whatever its type,
 * so an object or a megabyte-long string went through untouched.
 */
export function parseChatRequest(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const { message, sessionId } = body as Record<string, unknown>;

  if (typeof message !== "string") {
    return { ok: false, error: "`message` must be a string." };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "`message` must not be empty." };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `\`message\` must be at most ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  if (sessionId !== undefined && typeof sessionId !== "string") {
    return { ok: false, error: "`sessionId` must be a string." };
  }

  if (
    typeof sessionId === "string" &&
    sessionId.length > 0 &&
    !SESSION_ID_PATTERN.test(sessionId)
  ) {
    return { ok: false, error: "`sessionId` has an invalid format." };
  }

  return {
    ok: true,
    value: {
      message: trimmed,
      sessionId: sessionId && sessionId.length > 0 ? sessionId : "",
    },
  };
}

/**
 * n8n's "Respond to Webhook" node shape depends on how the workflow is wired,
 * so accept the handful of shapes it realistically returns.
 */
export function extractAssistantMessage(data: unknown): string | null {
  if (typeof data === "string") {
    return data.trim() || null;
  }

  if (Array.isArray(data)) {
    for (const entry of data) {
      const found = extractAssistantMessage(entry);
      if (found) return found;
    }
    return null;
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    for (const key of ["output", "response", "message", "text", "answer"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  return null;
}
