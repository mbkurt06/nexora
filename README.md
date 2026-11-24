# NEXORA

**Nexora** is a Turkish-language, mobile-first personal digital newspaper. It brings together technology, science, world news and major social conversations, with a deliberate handoff to ChatGPT for deeper discussion.

> **MVP / Demo:** Articles bundled with this repository are clearly marked **örnek içerik**. They are educational examples, not news from the last 24 hours. Real-time ingestion, source verification and automatic editorial publishing will be implemented separately.

## What works in this starter

- Responsive editorial homepage and category/subcategory navigation
- Search, article detail pages and source links
- Read/saved state on the current device (localStorage)
- ChatGPT handoff: prepare full article context, copy it, open ChatGPT and paste it into a new conversation
- Voice-conversation guidance for iPhone, including the background-conversation option
- PWA manifest, app icons and basic offline caching of previously visited pages
- Optional **read-only Supabase** article feed with row-level security
- Ready to deploy on Vercel

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without API keys, the app uses safe demo content.

### Supabase (optional)

1. Create a new Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql) in SQL Editor.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Restart the app. Only rows with `status = 'published'` will be shown.

### Vercel

Import this GitHub repository into Vercel, choose Next.js, and deploy. Add the same environment variables when you are ready to connect Supabase. On an iPhone, open in Safari and use **Share → Add to Home Screen**.

See [detailed setup instructions](docs/SETUP.md).

## Important limitations

A website cannot reliably inject a message into a user's private ChatGPT chat or force the ChatGPT iPhone app to start voice mode. Nexora uses an explicit **Copy context → Open ChatGPT → Paste and send** flow. For voice, the user then starts ChatGPT Voice and can switch back to Nexora if background conversations are enabled.

ChatGPT subscriptions and any future OpenAI API usage for automated news processing have separate billing.

## Architecture

Next.js 15 App Router + TypeScript + CSS + optional Supabase. Deployment: Vercel. Read/save state is local to each device until login/sync is added.

## Next steps

- Curated RSS, official newsroom and security advisory source ingestion
- Dedupe, original-source checks, publish dates, claim verification and human review
- Scheduled Turkish summaries and freshness scoring
- Authentication, cross-device saves, accessibility improvements and notification preferences
- Live deployment and iPhone PWA / ChatGPT voice-handoff test

Never commit API service-role keys or private credentials.
