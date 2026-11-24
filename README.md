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

## Private access and low-usage mode

- Nexora production, preview and historical deployment URLs are protected with **Vercel Authentication → All Deployments**. Only accounts permitted in the Nexora Vercel team can access the app. This protection is configured in Vercel, not in application source code; don't turn it off when redeploying.
- On iPhone, open the Nexora address and sign in with your Vercel account. A standalone Home Screen PWA may require a fresh Vercel sign-in because iOS can isolate web-app cookies.
- Appearance: open **Ayarlar** (gear icon) to choose **Açık**, **Gece modu**, or **Otomatik**. The choice is kept in the current device's local storage.
- The home and story pages use a **1-hour revalidation interval** to avoid unnecessary Supabase reads and server work. Story updates may therefore take up to an hour to become visible without a redeploy/revalidation.
- News reading doesn't call paid AI APIs. ChatGPT discussions happen in the user's own ChatGPT application.
- There is currently **no scheduled background ingestion or polling**. Future ingestion should run only once or a few times per day with a strict article limit, source deduplication, and usage budgets.
- Vercel Authentication blocks unauthorized visitors before the app executes, but this does not guarantee zero usage from other traffic or deployments; monitor actual quota in Vercel's Usage dashboard.

## Nexora Günlük — daily editions

- Main app section: **Nexora Günlük**, opened from the global hamburger menu.
- Includes ten topics: Technology, Science, Economy, World, Books, Health, Digital Life, Culture, Education, and Environment.
- Date strip and native calendar select a **specific publication day**; only stories assigned to that day appear. Dates without curated stories explicitly show an empty state. **Son 30 gün** shows the collection as a whole.
- Archive selection is stored in the browser's session and URL query parameter (`?date=YYYY-MM-DD`). Opening an article preserves list/scroll state on the same device.
- The initial archive contains **26 editorial summaries across 20 distinct dates, October 27–November 24, 2026**, with a primary-source URL for each. See [the reviewed content data](content/curated-2026-10-27-to-11-24.json).
- Each summary is written anew in Turkish; full copyrighted source articles are never imported or reproduced. Announcements and proposals are explicitly distinguished from enacted rules or completed results.
- Apply [the issue schema change](supabase/2026-11-24_daily_editions.sql) to the Supabase project before deploying the new app version. Content was seeded using the connected Supabase project; a separate SQL import is not required for the initial database.
- The initial archive is a **one-time curated content release**. There is no automatic daily scraping, publishing, scheduled news ingestion or background AI summarization. Keep that distinction clear until a verified pipeline is implemented.
- The site remains secured by Vercel Authentication (All Deployments), with preview deployments disabled to conserve free-tier build usage.


## One-tap ChatGPT News Project handoff (November 2026)

- **ChatGPT** buttons replace the bookmark controls on all home-page article cards, including the featured story. Each story's **top-right header** also contains a ChatGPT button instead of the previous bottom discussion section.
- One tap prepares the **full Nexora article context** (title, date, summary, Nexora's original paragraphs, source URL), starts a clipboard write, and opens the user's chosen ChatGPT Project in a new tab.
- **Important limitation:** ChatGPT personal Projects do not expose an external API to create a new Project chat or submit a message. The user still must choose **Yeni sohbet**, then **Yapıştır → Gönder** inside the Project. iPhone may open Safari instead of the native ChatGPT app.
- If clipboard permissions fail or a browser blocks popups, the app shows a selectable-text fallback, retry-copy button and direct project link. It never silently claims that the article was sent.
- The Project URL is shared across devices through Vercel `NEXT_PUBLIC_CHATGPT_PROJECT_URL`; the user's Project ID is not hardcoded in the **public GitHub repository**. This is a **public client configuration value, not a secret**; do not put credentials here. The site itself remains protected with Vercel Authentication.
- Optional per-device override: hamburger menu → **Ayarlar → ChatGPT haber projesi**. The new localStorage key is `nexora:chatgpt-project:v2` so older saved project links do not override the latest shared News project.
- Bookmarking remains accessible in the article detail's bottom actions, and saved-story filtering remains on the homepage. No separate OpenAI API billing.
- Preview deployments stay disabled, and the existing one-hour revalidation strategy remains in place.
