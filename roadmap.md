# Full-Stack / AI-Era Roadmap — Eduardo Fuentes

*Based on a knowledge assessment conducted on 2026-07-18. 5 years of backend experience, target: well-rounded full-stack developer with AI-era skills, 6-month timeframe.*

---

## 1. Skill Map

### Strengths
- **Distributed systems / architecture instinct** — strong Saga-pattern reasoning (event-driven flow, status tracking per step, retries) without having studied it formally. Close to how this is actually done in production.
- **Practical API/auth experience** — real experience with login flows, token handling, idempotency concepts, and HTTP headers, even where formal terminology was fuzzy.
- **Security judgment** — correctly identified authn vs authz and XSS from description alone. Instinct is there; needs vocabulary and breadth.
- **Fast real-time learner** — during the CORS discussion, went from unsure to self-deriving the right answer ("curl doesn't run JavaScript, so CORS never applies") within one follow-up. This adaptability matters more than any single fact below.

### Confirmed Gaps
| Area | Gap |
|---|---|
| Database internals | Isolation levels (Read Committed, Repeatable Read, Serializable) and the bugs they prevent/allow |
| Frontend | React re-render mechanics — when/why components re-render, how to control it |
| API design at scale | Cursor/keyset pagination vs. offset-based pagination |
| Rate limiting | Strategies (token bucket, sliding window) and where to enforce them (gateway vs. app code) |
| Concurrency vocabulary | Race conditions, concurrency vs. parallelism as formal concepts (the underlying intuition already exists — this is a naming/formalization gap, not a reasoning gap) |
| AI-era tooling | Untested in this assessment — needs deliberate practice, not just organic exposure |

**Pattern**: architecture/systems thinking is ahead of vocabulary and frontend exposure. This should make the roadmap move faster than a typical 6-month plan — most of it is attaching correct names and specifics to instincts that already exist, not learning from zero.

---

## 2. Six-Month Roadmap

### Month 1 — Frontend Foundations
- Learn React fundamentals: component lifecycle, state, props, and **why/when re-renders happen**.
- Tools to practice with: `React.memo`, `useMemo`, `useCallback`. Use React DevTools Profiler to *see* re-renders happen, don't just read about it.
- Build: a small CRUD app (e.g., a todo list) hitting a real backend you write. Forces connecting frontend state to API calls — the usual stumbling block for backend devs.
- Side quest (1-2 hrs): reproduce a lost-update race condition locally (two concurrent scripts hitting the same DB row) to turn the isolation-levels explanation below into muscle memory.

### Month 2 — API & Security Hardening
- Implement (not just read about): rate limiting with token bucket on one of your own endpoints, cursor-based pagination on a large dataset, an idempotency-key flow for a POST endpoint.
- Work through the OWASP Top 10 deliberately — you already have XSS and authorization; build out SQL injection, CSRF, insecure deserialization, etc.
- Add proper CORS config + JWT auth (httpOnly cookies) to the app from Month 1.

### Month 3 — Concurrency & Performance
- Deepen existing strength: optimistic vs. pessimistic locking, `SELECT ... FOR UPDATE`, revisit the Saga/outbox pattern with proper vocabulary attached.
- Learn to profile: pick a slow endpoint and diagnose it for real — `EXPLAIN ANALYZE`, N+1 queries, caching with Redis.
- Frontend performance pass on the Month 1 app: Lighthouse audit, fix render waste identified there.

### Month 4 — AI-Era Skills, Part 1: Using AI Tools Well
- Get deliberate with AI coding tools (Claude Code, Copilot-style workflows): practice prompting for debugging, code review, and planning — not just autocomplete.
- The real skill here is judgment: knowing when to trust AI output vs. verify it. That's the actual differentiator employers care about.

### Month 5 — AI-Era Skills, Part 2: Building AI-Powered Features
- Integrate an LLM API into the app built in Months 1-3 (e.g., AI-assisted search, summarization, a support chatbot).
- Learn at a working level: prompting, basic RAG (retrieval-augmented generation), tool use / function calling. Goal isn't becoming an ML engineer — it's shipping an AI feature end-to-end using skills already strong (API integration, rate limiting the LLM calls, caching, failure handling), applied to a new domain.

### Month 6 — System Design + Capstone
- Study fundamentals: scalability trade-offs, load balancing, caching strategies, when to shard/replicate a database.
- **Capstone project**: a full-stack app (React frontend) with proper auth/CORS, rate limiting, an AI-powered feature, and a short system design doc explaining the trade-offs made. This becomes the portfolio piece and interview talking point.

### Ongoing, All 6 Months — English Practice
- Write a short technical summary (in English) of what you build each week — like a mini design doc. Woven into the work, not a separate track.
- Near the end, do 1-2 mock technical interviews in English — this is where the vocabulary from this roadmap gets tested under real pressure.

---

## 3. Knowledge Reference (from the assessment)

### 3.1 Saga Pattern & Reliable Messaging
A **Saga** is a sequence of local transactions coordinated via events, where each step has a **compensating action** to undo it if a later step fails (e.g., refund a charge if inventory decrement fails afterward).

Two supporting concepts that make this reliable in practice:
- **Idempotency**: consumers must handle the same message being delivered twice (message brokers like Kafka don't guarantee exactly-once by default) without double-applying the effect — typically via an idempotency key stored with the operation.
- **Outbox pattern**: writing to your DB and publishing an event aren't atomic by default. If the process crashes between the two, the message is lost. Fix: write the event to an `outbox` table in the *same* DB transaction as the business change, then a separate process publishes it from the outbox to the broker.

### 3.2 Database Isolation Levels
Isolation levels control what "weirdness" from concurrent transactions is allowed, trading consistency for performance:
- **Read Uncommitted**: can read another transaction's uncommitted changes ("dirty read"). Rarely used.
- **Read Committed** (Postgres default): only reads committed data, but the same query run twice in one transaction can return different results ("non-repeatable read").
- **Repeatable Read** (MySQL default): same query returns the same rows for the whole transaction, but new rows can still appear ("phantom read").
- **Serializable**: strictest — transactions behave as if run one at a time. Safest, slowest, more retry/conflict errors under load.

**Lost update bug example**: two concurrent requests both read `inventory = 5`, both decide "ok to sell," both decrement → ends at `inventory = 3` instead of `4`, oversold by one unit. Prevented with row locking (`SELECT ... FOR UPDATE`) or an atomic update (`UPDATE ... SET qty = qty - 1 WHERE qty > 0`).

### 3.3 React Re-Renders
A component re-renders when: its **state** changes, its **props** change, its **parent re-renders** (children re-render by default too, even with unrelated props), or a **context value** it subscribes to changes.

Over-rendering (not "stale data") is the actual performance problem. First things to check on a sluggish page:
- Is a parent re-rendering on every keystroke/scroll and dragging all children down with it?
- Are new objects/functions being created inline in JSX (`onClick={() => ...}`), breaking memoization?
- Would `React.memo`, `useMemo`, or `useCallback` stop unnecessary re-renders of expensive children?

### 3.4 Frontend Auth & Token Storage
Standard flow: credentials → backend returns `access_token` (+ `refresh_token`) → token attached via `Authorization` header on subsequent requests.

Storage trade-off:
- `localStorage` / JS-readable cookies → vulnerable to **XSS** (injected script can read and exfiltrate the token).
- **httpOnly cookies** → JS can't read them (mitigates XSS), but the browser auto-sends them on every request to that domain, opening up **CSRF** unless mitigated with CSRF tokens or `SameSite` cookie attributes.

There is no storage method free of trade-offs — pick based on which risk matters more for the app.

### 3.5 API Idempotency
An idempotent request produces the **same result no matter how many times it's called** — the side effect happens once.

POST isn't idempotent by default (unlike GET/PUT), so for something like `POST /payments`, you engineer it: the client generates a unique **idempotency key** (e.g., UUID) per logical attempt and sends it in a header. The server remembers "I've seen this key, here's the result" — so a client retry after a timeout returns the original result instead of charging twice (this is how Stripe's API works).

### 3.6 Pagination at Scale
`LIMIT/OFFSET` breaks down at scale:
1. **Performance**: `OFFSET 1000000 LIMIT 20` still forces the DB to scan and discard a million rows first — gets slower the deeper you paginate.
2. **Data drift**: rows inserted/deleted between page loads can cause skipped rows or duplicates.

Fix: **cursor-based (keyset) pagination** — "give me the next 20 rows *after* the row with `id = X`" instead of "rows 1,000,020–1,000,040." The DB jumps straight there via an index: `WHERE id > :last_seen_id ORDER BY id LIMIT 20`. Stable even as data changes.

### 3.7 Authentication vs. Authorization, and IDOR
- **Authentication**: are you logged in / who are you?
- **Authorization**: what are you allowed to do / access?

Classic bug that mixes them up: **IDOR (Insecure Direct Object Reference)** — an endpoint checks "is this user authenticated?" but forgets to check "does this user own *this specific* resource?" e.g., `GET /invoices/1234` confirms login but never verifies invoice `1234` belongs to the caller. Change the ID in the URL, read anyone's invoice.

### 3.8 XSS (Cross-Site Scripting)
User-submitted content (e.g., `<script>alert('hacked')</script>` as a display name) gets rendered and executes in other users' browsers — this instance specifically is **stored XSS** (saved, then served to others later).

Primary defense: **output encoding/escaping**, not just "cleaning" input. When rendering user content into HTML, encode it so `<script>` becomes literal text. React does this automatically for `{value}` in JSX — XSS usually creeps back in via `dangerouslySetInnerHTML` or manual raw HTML injection. Input sanitization (e.g., DOMPurify) is still useful defense-in-depth, especially if some HTML must be allowed (rich text editors), but output encoding is the primary guarantee.

### 3.9 CORS
Enforced by the **browser**, not the server. Solves the problem created by the **Same-Origin Policy**: JS on `siteA.com` shouldn't silently read responses from `bankB.com` using the user's session there. CORS is the relaxation mechanism — the server explicitly allows certain origins via `Access-Control-Allow-Origin` and related headers.

Key nuance: CORS doesn't block the request from being *sent* — it blocks the browser's JS from *reading the response*. This is why `curl` (no JS engine, no CORS enforcement) can hit an endpoint successfully while the exact same endpoint throws a CORS error in the browser console. The request reached the server fine in both cases; the browser just refused to hand the response to the frontend JS because the right CORS headers weren't present. Fix is always server-side.

### 3.10 Rate Limiting
Two common strategies:
- **Token bucket**: a bucket holds N tokens, refilling at a fixed rate (e.g., 1/sec). Each request consumes a token; empty bucket = reject/delay. Allows short bursts while capping the average rate. Used by AWS, Stripe, etc.
- **Sliding window**: counts requests in a rolling time window (e.g., "last 60 seconds") rather than a fixed clock-aligned window — avoids the **fixed window** edge case where 100 requests at `11:59:59` + 100 at `12:00:01` count as two separate "windows" but are 200 requests in 2 seconds.

**Where to enforce**: usually at the **API gateway / load balancer / reverse proxy** layer (Kong, Nginx, Cloudflare, AWS API Gateway), because it rejects abusive traffic before it reaches app servers, centralizes config across services, and distributed rate limiting needs shared state (usually Redis) anyway. App-level rate limiting still matters for business-logic-specific limits (e.g., "free tier = 100 calls/day" tied to your own DB).

### 3.11 Concurrency
- **Race condition**: outcome depends on uncontrolled timing/ordering of competing events. Example: two requests both read `inventory = 1`, both check "> 0? yes," both decrement → ends at `-1` or a double-sale, because neither read accounted for the other's write. Often invisible in low-traffic dev/testing, appears only under real concurrent load.
- **Concurrency vs. parallelism**:
  - **Concurrency** = dealing with multiple things at once (structure) — e.g., Node.js's single-threaded event loop juggling many connections via async I/O, never truly running two things simultaneously.
  - **Parallelism** = actually executing multiple things at the exact same instant (requires multiple cores/machines).
  - You can have concurrency without parallelism — a frequent point of confusion.

---

## 4. Notes
- This roadmap should flex based on what actually comes up while building — treat the timeline as a guide, not a contract.
- Revisit the skill map after Month 3 to see which gaps closed and re-prioritize Months 4-6 if needed.
