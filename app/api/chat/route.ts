import { NextResponse, type NextRequest } from "next/server";
import { extractAssistantMessage, parseChatRequest } from "@/lib/chat-request";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/rate-limit";
import {
  encodeSseDelta,
  encodeSseDone,
  encodeSseError,
  isStreamingContentType,
  parseChunk,
} from "@/lib/stream";

/**
 * A RAG round-trip (embed → Pinecone → LLM) measures 5–10s in practice, well
 * past the 10s default, which surfaced as a silent 504 the UI reported as "the
 * assistant is down".
 */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** Upstream budget, kept below `maxDuration` so we can answer with a real error. */
const UPSTREAM_TIMEOUT_MS = 45_000;

const checkRateLimit = createRateLimiter({
  limit: 12,
  windowMs: 60_000,
});

function jsonError(status: number, error: string, extraHeaders?: HeadersInit) {
  return NextResponse.json({ success: false, error }, { status, headers: extraHeaders });
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-store, no-transform",
  Connection: "keep-alive",
  // Tells proxies (and Vercel's edge) not to buffer, which would defeat the point.
  "X-Accel-Buffering": "no",
};

/**
 * Re-emit n8n's newline-delimited stream as SSE frames the browser understands.
 * Nothing is buffered end-to-end, so the first token reaches the UI as soon as
 * the model produces it instead of 10 seconds later.
 */
function streamResponse(upstream: ReadableStream<Uint8Array>, sessionId: string) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffered = "";
  let produced = false;

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          const { deltas, rest } = parseChunk(
            buffered,
            decoder.decode(value, { stream: true }),
          );
          buffered = rest;

          for (const delta of deltas) {
            produced = true;
            controller.enqueue(encoder.encode(encodeSseDelta(delta)));
          }
        }

        // Flush whatever the upstream left without a trailing newline.
        const { deltas } = parseChunk(buffered, "\n");
        for (const delta of deltas) {
          produced = true;
          controller.enqueue(encoder.encode(encodeSseDelta(delta)));
        }

        if (!produced) {
          controller.enqueue(
            encoder.encode(encodeSseError("The assistant returned an empty answer.")),
          );
        }

        controller.enqueue(encoder.encode(encodeSseDone(sessionId)));
      } catch (error) {
        console.error("[chat] stream interrupted:", error);
        controller.enqueue(
          encoder.encode(encodeSseError("The answer was interrupted. Please try again.")),
        );
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(body, { headers: SSE_HEADERS });
}

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    // Configuration problem: log it server-side, stay vague with the client.
    console.error("[chat] N8N_WEBHOOK_URL is not configured");
    return jsonError(503, "The assistant is not available right now.");
  }

  const limit = checkRateLimit(clientKeyFromHeaders(req.headers));
  if (!limit.allowed) {
    return jsonError(429, "Too many requests. Please slow down.", {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  const parsed = parseChatRequest(body);
  if (!parsed.ok) {
    return jsonError(400, parsed.error);
  }

  const sessionId = parsed.value.sessionId || `session-${Date.now()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let streaming = false;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Advertise that we can consume an incremental response; harmless when
        // the workflow only knows how to answer with buffered JSON.
        Accept: "application/x-ndjson, text/event-stream, application/json",
      },
      body: JSON.stringify({ sessionId, chatInput: parsed.value.message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error("[chat] n8n responded with", response.status, details.slice(0, 500));
      return jsonError(502, "The assistant could not be reached.");
    }

    if (isStreamingContentType(response.headers.get("content-type")) && response.body) {
      streaming = true;
      return streamResponse(response.body, sessionId);
    }

    const data = await response.json().catch(() => null);
    const message = extractAssistantMessage(data);

    if (!message) {
      console.error("[chat] unexpected n8n payload shape:", JSON.stringify(data)?.slice(0, 500));
      return jsonError(502, "The assistant returned an unreadable answer.");
    }

    return NextResponse.json(
      { success: true, message, sessionId },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    // Never echo the upstream error back: its text can contain the webhook URL.
    console.error("[chat] upstream call failed:", error);
    return jsonError(
      aborted ? 504 : 502,
      aborted ? "The assistant took too long to answer." : "The assistant could not be reached.",
    );
  } finally {
    // A streaming response outlives this handler; cancelling its timeout here
    // would let a stalled upstream hang forever, so leave it armed.
    if (!streaming) clearTimeout(timeout);
  }
}
