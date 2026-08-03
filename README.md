# 🤖 CV Interactive Agent

An AI-powered interactive CV. Instead of reading a static PDF, visitors chat
with an agent that knows my background, skills and projects — while a fake
browser panel next to the conversation opens the page the answer is about.

🔗 **Live demo:** [rudy-haddad-ai.vercel.app](https://rudy-haddad-ai.vercel.app)

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, lucide-react |
| Theming | next-themes (class strategy) |
| Agent | n8n workflow (Webhook → fetch knowledge → AI Agent → Respond) |
| Knowledge | Full context from `data/`, served by `/api/knowledge` — no vector store |
| Tests | Vitest + Testing Library |
| Hosting | Vercel |

## Architecture

```
Browser
  │  POST /api/chat  { message, sessionId }
  ▼
Next.js route handler          ← validation, rate limiting, 45s timeout
  │  POST $N8N_WEBHOOK_URL  { chatInput, sessionId }
  ▼
n8n workflow
  Webhook → GET /api/knowledge → AI Agent (knowledge in the system prompt)
          → Simple Memory (keyed on sessionId) → Respond to Webhook  { output }
```

The webhook URL stays server-side: the browser only ever talks to `/api/chat`.

### Auto-navigation

Every user message and every agent answer is scored against the keyword sets in
[`data/pages.ts`](data/pages.ts) by [`lib/topic-matcher.ts`](lib/topic-matcher.ts).
Matching is done on **whole tokens**, never substrings, and the highest-scoring
tab wins — multi-word keywords count for more than single words.

- **Desktop:** the browser panel navigates automatically.
- **Mobile:** the chat *is* a tab, so navigating would interrupt the user. The
  relevant tab gets a pulsing dot instead.

### Response time

The agent itself takes **5–10s** (measured); the proxy adds nothing. What the
app does about it:

- **Streaming-ready.** If the n8n workflow answers with `application/x-ndjson`,
  the route re-emits it as SSE and the chat fills in word by word — first token
  in ~60ms instead of a blank 8 seconds. Plain JSON still works unchanged. See
  [N8N_INTEGRATION.md](N8N_INTEGRATION.md).
- **Named progress stages** ("Searching my CV and projects…") so a long wait
  reads as work in progress, not as a broken page.
- **Session answer cache**: asking the same thing twice is instant and costs no
  credits.
- **No invented latency**: the welcome message renders on first paint and tab
  switches are immediate. Both used to sit behind artificial timers.
- **The composer stays usable** while the agent thinks, and a stop button ends
  the wait.

### One source of truth, for the pages *and* the agent

All CV content lives in [`data/`](data/) (`profile.ts`, `projects.ts`,
`skills.ts`, plus `knowledge.ts` for free-form notes the pages never show).

`GET /api/knowledge` serialises all of it into a single plain-text document that
the n8n workflow puts straight in the agent's system prompt. There is no vector
store and no ingestion job: editing one file updates the site and the assistant
together, so they cannot describe different people.

The corpus is ~2k tokens — about 1% of a modern context window — which is why
retrieval was removed. It only ever added failure modes: an ingestion that
appended vectors without deleting the old ones, chunk boundaries that split
related facts, and a second source of truth drifting from the repo.

| To add… | Edit | Appears on |
|---|---|---|
| A project | `data/projects.ts` | site + agent |
| A skill | `data/skills.ts` | site + agent |
| A role, certification, language | `data/profile.ts` | site + agent |
| Anything the CV does not say | `data/knowledge.ts` | agent only |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in N8N_WEBHOOK_URL
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit + structural suite, single run. Free, ~6s. |
| `npm run test:watch` | Same, watch mode |
| `npm run eval` | **Behavioural suite against the live agent.** Spends credits. |

## Environment

| Variable | Required | Description |
|---|---|---|
| `N8N_WEBHOOK_URL` | yes | n8n webhook fronting the agent. Server-side only. |
| `KNOWLEDGE_API_TOKEN` | no | If set, `/api/knowledge` requires this token. Unset leaves it public. |

## Deployment

Deployed on Vercel. If the repository root contains this project in a
subdirectory, set **Root Directory** to `cv-ai-interactive`, and add
`N8N_WEBHOOK_URL` for Production, Preview and Development.

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for the full walkthrough and
[N8N_INTEGRATION.md](N8N_INTEGRATION.md) for the workflow contract.

## Notes on `/api/chat`

The endpoint is public and spends real credits downstream, so it:

- rejects non-string, empty or >1000-character messages;
- rate-limits to 12 requests/minute per IP (in-memory, per instance);
- aborts the upstream call after 45s and answers `504` rather than hanging;
- never echoes the upstream error text back to the client.

For serious traffic, swap the in-memory limiter in
[`lib/rate-limit.ts`](lib/rate-limit.ts) for a shared store (e.g. Upstash Redis).

## Testing the agent

Two suites, deliberately separate.

**`npm test`** — 280 cases, free and instant. Proves the *structure* holds:
every project and skill on the site reaches the agent's knowledge base, the
prompt has no duplicate headings or competing H1s, facts and rules sit in
different tagged blocks, no first-person leakage, the n8n workflow points at a
URL that matches `data/profile.ts`.

**`npm run eval`** — 21 cases against the **live** agent. Proves the *behaviour*
holds: it really refuses the Pythagorean theorem, really answers a Hebrew
question in Hebrew, really declines to quote a salary, really resists "ignore
your previous instructions". Structure and behaviour are different failure
modes; the first suite cannot catch the second.

```bash
npm run eval                                   # against production
EVAL_TARGET=http://localhost:3000 npm run eval # against a local server
EVAL_DELAY_MS=8000 npm run eval                # slower, if rate-limited
```

Costs roughly **$0.01 per run** and takes ~2 minutes — the pacing keeps it
under the 12 requests/minute limit on `/api/chat`. Run it after changing the
prompt, the knowledge base, or the model.
