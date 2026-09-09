# XMUM Navigate

Web-based campus companion directory for Xiamen University Malaysia — navigation, venue recommendation, and canteen directory.

FYP by Erawan Gregorius Felix Caton (SWE2309430), supervised by Dr. Subashini Raghavan.

## Structure

```
xmum-navigate/
├── frontend/   React (Vite) — deployed on Vercel
├── backend/    Node + Express — deployed on Railway/Render
└── docs/       schema notes, ethics docs, etc.
```

## Local setup

**Frontend**
```
cd frontend
npm install
npm run dev
```

**Backend**
```
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL after Supabase is set up
npm run dev
```

## Deployment

**Frontend (Vercel)**
1. Push this repo to GitHub.
2. In Vercel, "New Project" → import the repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.

**Backend (Railway or Render)**
1. New project → import the same repo.
2. Set **Root Directory** to `backend`.
3. Start command: `npm start`.
4. Add environment variable `DATABASE_URL` (from Supabase, once set up).

## Status

Day 0 skeleton — no features built yet. See project instructions for the full research plan.
