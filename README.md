# Agent Git Lab — Week 4 Learning App

**Joshua Scotland (@raven-dubgub)** · Hult Cohort Developer Program · Summer 2026 · Phase 2 Learning App

Production listing URL: **https://learning-raven-dubgub.vercel.app** (set after deploy)

## Topic

Git & GitHub for agent-first developers — five lessons with quizzes.

## Ludwitt integration

| Route | Status |
|-------|--------|
| PitchRise documented API (`https://pitchrise.ludwitt.com/api/`) | Firebase ID token → `/api/auth/me`, `/api/integrations`, `/api/webhooks` |
| Cohort reference API (embedded) | JWT launch + events + metrics (developer portal blocked; **no ALC $10k bypass**) |

See [INTEGRATION.md](./INTEGRATION.md).

## Stack

Next.js 16 · TypeScript · Tailwind 4 · Prisma · Neon · Firebase Auth (PitchRise project) · Vercel

## Local

```powershell
cd learning-raven-dubgub
copy .env.example .env
# fill DATABASE_URL
npm install
npx.cmd prisma migrate dev
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run db:migrate`

Deploy: [DEPLOY.md](./DEPLOY.md)
