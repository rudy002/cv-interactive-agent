import { NextResponse, type NextRequest } from "next/server";
import { buildKnowledgeDocument, knowledgeFingerprint } from "@/lib/knowledge";
import { isAuthorised } from "@/lib/knowledge-auth";

/**
 * Serves the agent's entire knowledge base as plain text.
 *
 * n8n fetches this at the start of every conversation turn and puts the result
 * in the system prompt. That makes `data/` the single source of truth for both
 * the site and the assistant: editing one file updates both, and there is no
 * vector store left holding an outdated copy of the CV.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Read at request time, not module scope, so the value is never baked in.
  if (!isAuthorised(req.headers, process.env.KNOWLEDGE_API_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = buildKnowledgeDocument();
  const etag = `"${knowledgeFingerprint(document)}"`;

  // Let n8n skip the payload when nothing changed since its last call.
  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  return new NextResponse(document, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ETag: etag,
      // Short window: a redeploy should reach the assistant quickly, but a
      // burst of questions must not rebuild the document every time.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
