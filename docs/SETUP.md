# Nexora — Setup Guide

## 1. Local development

- Node.js 20 or newer
- Run `npm install`
- Run `npm run dev`
- Open http://localhost:3000

Without environment variables, the app displays **clearly labeled demo explainers**, not real-time news.

## 2. Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy the project URL and publishable/anon key into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

4. Restart Next.js.

If Supabase variables are set, the app reads **only published** articles from the database. An empty database shows an empty feed; no misleading demo news is inserted. Never expose a service role key in a browser or commit secrets to GitHub.

## 3. Vercel

- Import `mbkurt06/nexora` into a new Vercel project.
- Framework: Next.js, root directory: project root.
- Set the two `NEXT_PUBLIC_...` environment variables if using Supabase.
- Deploy over HTTPS.
- On an iPhone, open the site with Safari → Share → Add to Home Screen.

The PWA installs with a generated application icon and caches visited pages for limited offline use. This does not mean future news updates will be available offline.

## 4. ChatGPT handoff

On an article, tap **Yazılı değerlendir** or **Sesli konuş**. A modal prepares the complete article context, source and a tailored prompt. Tap **Haber metnini kopyala**, then **ChatGPT'yi aç**. Paste the text into a new ChatGPT conversation.

For voice, send the pasted context first, then open voice mode manually. With ChatGPT's **Background Conversations** setting enabled, voice may continue while Nexora is in the foreground on iPhone, depending on iOS app behavior and permissions.

Limitations:
- There is no supported guarantee that a website can prepopulate and submit a private ChatGPT conversation automatically.
- A PWA cannot reliably force the ChatGPT native app into live voice mode.
- ChatGPT and Nexora do not automatically synchronize conversation histories.
- User's ChatGPT subscription is distinct from any future OpenAI API billing for automated article summarization.

## 5. Future news ingestion (not implemented)

Recommended architecture: scheduled trusted worker → source discovery → deduplication → original-source verification → importance/category assignment → AI-assisted Turkish summary with review → store drafts → publish verified stories. Never treat a viral social post as verified news without corroboration.

Suggested fields for future improvements: `canonical_url`, `fact_check_status`, `event_at`, `tags`, `updated_at`, `language`, multiple sources and collection audit logs.

The starter app intentionally ships without unreviewed scraping, RSS ingestion, API secrets, automated publishing or live X integrations.
