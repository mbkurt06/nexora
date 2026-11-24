-- Nexora Günlük: dated editions and expanded editorial sections.
-- Existing published article policies remain unchanged (read-only to anon/authenticated).
alter table public.articles drop constraint if exists articles_category_check;
alter table public.articles
  add constraint articles_category_check
  check (category in (
    'technology','science','economy','world','books',
    'health','social','culture','education','environment'
  ));

alter table public.articles add column if not exists issue_date date;
update public.articles
set issue_date = (coalesce(published_at, created_at) at time zone 'Europe/Berlin')::date
where issue_date is null;
alter table public.articles alter column issue_date set not null;
create index if not exists articles_issues_idx
  on public.articles(status, issue_date desc, published_at desc);

-- Public clients may only SELECT rows marked published through the existing RLS policy.
revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;
