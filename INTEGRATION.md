# Ludwitt / PitchRise integration notes

## Routes used (both count per cohort email)

### 1. PitchRise documented API

- Base: `https://pitchrise.ludwitt.com/api/`
- Auth: Firebase ID token in `Authorization: Bearer <token>`
- Endpoints exercised:
  - `GET /health` — platform health (public)
  - `GET /auth/me` — verify learner identity
  - `GET /integrations` — integration status
  - `POST /webhooks` — learning events (`lesson_started`, `lesson_completed`, `quiz_submitted`)
- Client Firebase project: `pitch-rise` (same as pitchrise.ludwitt.com)

### 2. Cohort reference API (embedded — portal blocked)

The Ludwitt developer portal / ALC OAuth path is **not** used (no $10,000 bypass).

This app embeds the cohort reference pattern from `hult-cohort-program/execution/ludwitt-hult-api`:

- `GET /api/metrics` — app id + qualified user snapshot
- `GET /api/reference/metrics` — bearer `LUDWITT_API_KEY` from app registration row
- `POST /api/events` — dual-writes reference events + PitchRise webhooks when Firebase token present
- `/launch?token=` — JWT validated with per-app `jwt_secret`

## Production listing URL

Per Ludwitt clarification: **this Vercel URL is the listing URL** — not a Ludwitt app directory entry.

## Manual steps for Joshua

1. Sign in at `/login` with PitchRise Firebase (create account or use existing Ludwitt login).
2. Complete at least one lesson while signed in (fires events).
3. Share production URL with external learners (≥25 qualified users pass gate by snapshot date).
4. Optional: call `GET /api/metrics` for date-stamped snapshot in submission PR.
