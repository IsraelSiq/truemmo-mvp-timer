# Setup Guide

## Prerequisites

- Node.js 20+
- npm 9+
- A Supabase account (free): https://supabase.com
- A Google AI Studio account (free): https://aistudio.google.com
- A Vercel account (free): https://vercel.com

## 1. Supabase Setup

1. Create a new project at supabase.com
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Go to **Settings > API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Go to **Authentication > Providers** and enable **Email** (magic link)

## 2. Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key → `VITE_GEMINI_API_KEY`

> Free limits: 1,500 requests/day, 1,000,000 tokens/day

## 3. Local Development (CAUTION)

> ⚠️ **GEPARD WARNING:** Do NOT run `npm run dev` while playing on TRUEMMO.
> Only run it on a separate PC or when the game client is closed.

```bash
cp .env.example .env.local
# fill in your keys
npm install
npm run dev
```

## 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo to Vercel Dashboard and add the env vars there.

## 5. Regenerate TypeScript types (after schema changes)

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```
