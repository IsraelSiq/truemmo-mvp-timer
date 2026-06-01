# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────┐
│              VERCEL (CDN)               │
│        React + Vite SPA (static)        │
└────────────────┬────────────────────────┘
                 │ HTTPS
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌──────────────┐
│Supabase│  │Supabase│  │ Google Gemini│
│  Auth  │  │  DB +  │  │  1.5 Flash   │
│        │  │Realtime│  │  (AI API)    │
└────────┘  └────────┘  └──────────────┘
```

## Key Design Decisions

### Why Supabase?
- Free tier: 500MB DB, unlimited auth, 2GB bandwidth
- Built-in Realtime (WebSockets) — perfect for group timer sync
- Row Level Security — groups can only see their own data
- No server needed: direct SDK from frontend

### Why Gemini 1.5 Flash?
- Free tier: 1,500 requests/day, 1M tokens/day
- Fast response time (~1s for our use case)
- Simple REST API / official JS SDK
- No credit card required to start

### Why Vercel?
- Free tier for personal projects
- Israel already uses Vercel for other projects
- Zero-config React/Vite deployment
- Environment variables managed in dashboard

## Data Flow — Kill Registration

1. User selects MVP + clicks "Matei agora"
2. App calculates `windowStart` and `windowEnd`
3. INSERT into `kill_log` via Supabase SDK
4. Supabase Realtime broadcasts INSERT to all group members
5. All clients update their timer list in real-time

## Data Flow — AI Suggestion

1. User clicks "Sugestão IA"
2. App reads current `timers` state (local)
3. Builds structured prompt with timer data
4. POST to Gemini API (client-side, API key in env)
5. Response rendered in UI

> **Security note:** Gemini API key is exposed client-side (VITE_ prefix).
> This is acceptable for this use case since:
> - Free tier has rate limits that prevent abuse
> - App is for personal/group use, not public
> - Can move to a serverless function (Vercel Functions) if needed later
