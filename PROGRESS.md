# Progress — Eduardo's Full-Stack / AI-Era Upgrade

> See `CLAUDE.md` for how this file relates to `roadmap.md` and `CONCEPTOS-CLAVE.md`, and the session workflow.

---

## Checklist

### Month 1 — Frontend Foundations
- [x] Backend API scaffolded (Express, in-memory) + frontend scaffolded (Vite + React) — `month-01-frontend-foundations/`
- [x] Fetch + display applications list (`useState`/`useEffect`), understood initial render vs. re-render sequencing
- [x] Add-application form with controlled inputs — resets state after submit, `STATUS_OPTIONS` matches backend (`applied`/`interviewing`)
- [x] React fundamentals: state, props, re-render mechanics
- [x] Practiced `React.memo` / `useCallback`, used DevTools Profiler (`useMemo` specifically not yet exercised)
- [x] Edit / delete an application — both working: `handleDelete`, and `handleEdit` reusing the add form via an `editingId` state (branches POST vs. PUT in `handleSubmit`, replaces the item in place with `.map()`)
- [x] Filter by status — `filterStatus` state + `useMemo`-derived `filteredApplications`, passed to `ApplicationList`
- [x] Built a small CRUD app connected to a real backend
- [ ] Side quest: reproduced a lost-update race condition locally

**Pick up here next time:**
1. Month 1's remaining item is the race-condition side quest (two concurrent scripts hitting the same DB row) — good bridge into Month 2's concurrency/API work.
2. Otherwise Month 1 core build is done — ready to move into Month 2 (API & Security Hardening) whenever Eduardo wants, or do the side quest first.

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
- Set up git repo, initial commit (`433a11e`).
- Started Month 1 build: scaffolded Express backend + Vite/React frontend for a **Job Application Tracker** (`month-01-frontend-foundations/`).
- Built fetch-and-display of applications together; Eduardo correctly reasoned through the initial-render-vs-re-render sequence after one correction (had cause/effect slightly inverted at first).
- Eduardo wrote the add-application form (controlled inputs + POST) independently — solid first attempt: correct controlled-input pattern, correct use of server response to update state. Two open fixes logged above, plus a pending DevTools Profiler exercise on re-render cascades.
- English note: flagged "charged" vs. "loaded" as a false-friend mistake (cargado → loaded, not charged).

## 2026-07-19
- Eduardo independently fixed both open items from last session: form now resets `company`/`role`/`status` after successful submit, and `STATUS_OPTIONS` trimmed to match backend exactly (`applied`/`interviewing`).
- Eduardo independently implemented `handleDelete` (filters by id, updates state correctly) and stubbed out `handleEdit` with a button already wired up.
- Declined the DevTools Profiler exercise cold — doesn't understand it yet. Deferred; next time introduce it as a guided walkthrough rather than a "go try it" task.
- Implemented `handleEdit` via Socratic guidance (explained the reuse-the-form + `editingId` design, then Eduardo wrote it himself). Two real bugs he found and fixed after targeted hints: (1) `setApplications(data)` in the PUT branch replaced the whole array with a single object instead of updating one item; (2) `editingId` never reset to `null` after a successful edit, which would've silently PUT'd on the next "Add". Also swapped `.filter()[0]` for `.find()` in `handleEdit`, and switched the PUT-branch replacement from `filter` + spread (which reordered the list) to `.map()` (preserves position) after a walkthrough of how `.map()` works.
- Next up: guided DevTools Profiler walkthrough, then "Filter by status".

## 2026-08-01
- Guided, live DevTools Profiler walkthrough (per the deferral above): opened Profiler tab, explained flame graph/commit/color semantics, recorded a keystroke in the Company field. Confirmed prediction: with all state in one `App` component, every keystroke re-rendered the entire component tree, including the untouched applications list.
- Eduardo correctly reasoned (unprompted) that the fix is componentization — extracting the list so it can be isolated from re-renders.
- Eduardo extracted `ApplicationList` into `src/components/ApplicationListComponent.jsx` himself. Introduced 4 bugs in the first pass, found via targeted hints (not direct fixes): (1) `handleEdit={handleEdit()}` / `handleDelete={handleDelete()}` called the functions during render instead of passing references — this was the actual cause of the blank-page symptom; (2) `({ props }) => { const { applications } = props }` — wrong props signature, should destructure the single props object directly; (3) `retrn` typo; (4) `handleEdit`/`handleDelete` referenced inside the child without being destructured from props.
- Demonstrated the full memo/useCallback chain live via the Profiler, one variable isolated at a time: extracted-but-no-memo still re-renders child → memo alone still re-renders (handlers are new references each render) → memo + `useCallback` on both `handleEdit`/`handleDelete` (deps: `[applications]`) → Profiler shows "Did not render" on `ApplicationList`.
- Asked a good architecture question mid-exercise: should the handlers live in `App` or move into `ApplicationList`? Talked through why state-owning component should keep the logic (handlers need `App`'s setters), child stays presentational — no code change needed, design was already correct.
- Correctly identified `[applications]` as the right `useCallback` dependency, though his stated reasoning conflated "prevents re-render" with the real mechanism (stale closures) — corrected and logged in `CONCEPTOS-CLAVE.md`.
- Split concept notes out of this file into a new **`CONCEPTOS-CLAVE.md`** (study glossary, organized by topic/month, not chronological) per Eduardo's request — keeps this file focused purely on roadmap tracking. Also added `CLAUDE.md` to formalize the three-file workflow (`PROGRESS.md` / `roadmap.md` / `CONCEPTOS-CLAVE.md`) so it's not dependent on session memory.
- Verified edit/delete still work correctly after the refactor.
- Marked "React fundamentals" and "React.memo/useCallback + Profiler" checklist items done (`useMemo` specifically not yet exercised — noted as a future pickup, natural fit once "Filter by status" adds a derived/filtered list).
- Next up: "Filter by status".

## 2026-08-02
- Implemented "Filter by status". Before coding, talked through server-side vs. client-side filtering as a design choice — Eduardo initially defaulted to filtering via the backend request, then correctly reasoned his way to client-side once prompted to weigh data volume (small in-memory list, already fetched) against round-trip cost per filter change.
- First implementation attempt filtered inside the existing `useEffect` (empty dep array) and overwrote `applications` itself with the filtered subset — found via targeted questions: (1) effect with `[]` never re-runs on `filterStatus` change, (2) overwriting the source-of-truth list loses the original data needed to show "ALL" again.
- Briefly reached for `useCallback` instead of `useMemo` to fix it — corrected the distinction (function memoization vs. value memoization) before he rewrote it correctly: `useEffect` now only fetches/stores the raw list; a new `filteredApplications = useMemo(...)` derives the filtered view, passed to `ApplicationList`.
- Second bug, found independently after one hint: `useMemo` deps array only had `[filterStatus]`, missing `applications` — same stale-closure pattern as the `useCallback` lesson from 2026-08-01, just recognized instantly this time once pointed at the dependency array. Result: list stayed empty after initial fetch until the filter was touched. Fixed by adding `applications` to deps.
- Verified working in the browser: list populates on load, filter dropdown works, and add/edit/delete correctly update the filtered view.
- Marked "Filter by status" and "Built a small CRUD app connected to a real backend" done. Month 1 core build complete; only the race-condition side quest remains open.
- Next up: race-condition side quest, or move into Month 2 (API & Security Hardening) — Eduardo's call next session.
