# 🐉 TRUEMMO MVP Timer

MVP respawn tracker for the TRUEMMO private server — with clan log, realtime sync and AI-powered target suggestions.

## ✨ Features

- ⏱️ **MVP Timer** — track respawn windows (min/max) for all MVPs
- 👥 **Clan Log** — shared kill log per group (who killed, when, where)
- 🤖 **AI Suggestions** — Gemini AI recommends the best MVP target at any moment
- 🔐 **Auth** — login via Supabase (email or magic link)
- 🌐 **Cloud-only** — runs on Vercel + Supabase, no local server needed

## 🏗️ Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Backend/DB | Supabase (PostgreSQL + Auth + Realtime) |
| AI | Google Gemini 1.5 Flash (free tier) |
| Deploy | Vercel |

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/IsraelSiq/truemmo-mvp-timer.git
cd truemmo-mvp-timer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
# fill in your Supabase and Gemini keys
```

### 4. Run the database migrations
Apply the SQL files in `supabase/migrations/` to your Supabase project.

### 5. Start dev server
```bash
npm run dev
```

## 📁 Project Structure

```
truemmo-mvp-timer/
├── src/
│   ├── components/       # UI components
│   ├── pages/            # Route pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase client, Gemini client
│   ├── data/             # Static MVP data (TRUEMMO specific)
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions (respawn calc, etc.)
├── supabase/
│   └── migrations/       # SQL schema files
├── public/
└── docs/                 # Architecture and ADR docs
```

## 🗺️ Roadmap

See [GitHub Issues](https://github.com/IsraelSiq/truemmo-mvp-timer/issues) organized by milestone.

## ⚠️ Important — Gepard Shield

This app is intentionally cloud-deployed (Vercel). **Do not run a local backend or dev server** while playing on TRUEMMO, as Gepard Shield may detect and block suspicious processes.

## 📄 License

MIT
