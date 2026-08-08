# Deploy — Learning app (Neon + Vercel)

## 1. Neon

Create project `learning-raven-dubgub`, copy pooled `DATABASE_URL`.

## 2. GitHub

```powershell
cd learning-raven-dubgub
git init
git add .
git commit -m "Week 4 learning app — Ludwitt integration"
gh repo create RAVEN-dubgub/learning-raven-dubgub --public --source=. --remote=origin --push
```

## 3. Vercel

```powershell
npx.cmd vercel link
npx.cmd vercel env add DATABASE_URL production
npx.cmd vercel env add NEXT_PUBLIC_SITE_URL production
npx.cmd vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
npx.cmd vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
npx.cmd vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
npx.cmd vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
npx.cmd vercel --prod
```

Build command (Vercel): `prisma generate && prisma migrate deploy && next build`

## Smoke test

1. `GET /` → 200
2. `/learn/why-git-exists` → start lesson → integration log shows events
3. `/dashboard` → metrics JSON with `app_id`
4. `GET /api/metrics` → date-stamped snapshot
