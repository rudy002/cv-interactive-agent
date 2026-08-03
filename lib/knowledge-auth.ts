/**
 * Access control for `/api/knowledge`, kept pure so it can be tested without
 * mutating `process.env` or booting Next.
 *
 * When no token is configured the endpoint is public. That is a deliberate
 * default: the content is the CV, which the pages already display. Configuring
 * a token stops casual bulk harvesting — it does not make the content secret,
 * because the assistant repeats all of it to anyone who asks.
 */
export function isAuthorised(headers: Headers, token: string | undefined): boolean {
  if (!token) return true;

  const authorization = headers.get("authorization") ?? "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  return bearer === token || headers.get("x-knowledge-token") === token;
}
