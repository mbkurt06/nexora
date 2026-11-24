-- Nexora initial read-only news schema.
-- Run this in Supabase SQL Editor.
-- Only published stories are publicly readable. There is NO client-side insert/update policy.
create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text[] not null default '{}',
  category text not null check (category in ('technology','science','world','social')),
  subcategory text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  importance text not null default 'normal' check (importance in ('critical','high','normal')),
  source_name text,
  source_url text,
  published_at timestamptz,
  read_time integer not null default 3 check (read_time between 1 and 60),
  cover_tone text not null default 'blue',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles(status, published_at desc);
alter table public.articles enable row level security;

drop policy if exists "Anyone can read published news" on public.articles;
create policy "Anyone can read published news"
  on public.articles for select to anon, authenticated
  using (status = 'published');

-- For ingestion, use a trusted server-side credential (never NEXT_PUBLIC_...).
-- Add editorial review and source-verification workflows before publishing.
