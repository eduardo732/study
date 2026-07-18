# Month 1 — Frontend Foundations

See full details in [`../roadmap.md`](../roadmap.md#month-1--frontend-foundations).

## Goal
Learn React fundamentals (state, props, re-render mechanics) and build a small CRUD app hitting a real backend, to connect frontend state to API calls.

## This month's build
**Job Application Tracker** — track companies/roles you're applying to (status, notes, dates). Real CRUD against a real backend, with enough natural complexity (filtering by status, editing, deleting) to expose real re-render and state-management questions.

### Stack
- `backend/` — Node/Express, in-memory data (resets on restart — deliberate, keeps focus on the frontend), REST API on `http://localhost:3001`.
- `frontend/` — Vite + React scaffold, dev server on `http://localhost:5173`.

### Backend API
| Method | Route | Description |
|---|---|---|
| GET | `/api/applications` | List all applications |
| GET | `/api/applications/:id` | Get one |
| POST | `/api/applications` | Create (`company`, `role` required; `status`, `appliedDate`, `notes` optional) |
| PUT | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |

### Running it
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

### Progress
- [x] Backend API scaffolded and smoke-tested
- [x] Frontend scaffolded (Vite + React)
- [x] Fetch and display applications list
- [ ] Add new application form
- [ ] Edit / delete an application
- [ ] Filter by status
- [ ] Re-render investigation with DevTools Profiler
