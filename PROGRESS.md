# Progress — Eduardo's Full-Stack / AI-Era Upgrade

> **For Claude, at the start of any future tutoring session in this repo**: read this file + `roadmap.md` first to pick up context before continuing. Update the checklist and append a session log entry at the end of each session. Do not commit to git unless Eduardo explicitly asks.

---

## Checklist

### Month 1 — Frontend Foundations
- [ ] React fundamentals: state, props, re-render mechanics
- [ ] Practiced `React.memo` / `useMemo` / `useCallback`, used DevTools Profiler
- [ ] Built a small CRUD app connected to a real backend
- [ ] Side quest: reproduced a lost-update race condition locally

### Month 2 — API & Security Hardening
- [ ] Implemented token-bucket rate limiting on an endpoint
- [ ] Implemented cursor-based pagination
- [ ] Implemented an idempotency-key flow for a POST endpoint
- [ ] Worked through OWASP Top 10 beyond XSS/authz
- [ ] Added CORS + JWT (httpOnly cookies) auth to Month 1 app

### Month 3 — Concurrency & Performance
- [ ] Studied optimistic vs. pessimistic locking, `SELECT ... FOR UPDATE`
- [ ] Profiled a slow endpoint (`EXPLAIN ANALYZE`, N+1 queries)
- [ ] Added caching with Redis
- [ ] Frontend performance pass (Lighthouse) on Month 1 app

### Month 4 — AI-Era Skills, Part 1: Using AI Tools Well
- [ ] Deliberate practice with AI coding tools for debugging/review/planning
- [ ] Reflected on when to trust vs. verify AI output

### Month 5 — AI-Era Skills, Part 2: Building AI-Powered Features
- [ ] Integrated an LLM API into an existing app
- [ ] Learned basic RAG concepts
- [ ] Learned tool use / function calling

### Month 6 — System Design + Capstone
- [ ] Studied scalability, load balancing, caching, sharding/replication
- [ ] Built capstone project (auth/CORS + rate limiting + AI feature)
- [ ] Wrote system design doc for the capstone

### Ongoing — English Practice
- [ ] Weekly written technical summaries in English
- [ ] Mock technical interview(s) in English

---

## Session Log

## 2026-07-18
- Ran a conversational knowledge assessment across backend, frontend, APIs, security, CORS, rate limiting, and concurrency.
- Strengths confirmed: distributed systems/Saga-pattern instinct, practical API/auth experience, security judgment (authn/authz, XSS), fast real-time learner (self-corrected on CORS reasoning).
- Gaps confirmed: DB isolation levels, React re-render mechanics, cursor pagination, rate limiting strategies, race condition/concurrency-vs-parallelism vocabulary. AI tooling untested.
- Produced `roadmap.md` (6-month plan) and set up this repo structure (month folders + progress tracking).
