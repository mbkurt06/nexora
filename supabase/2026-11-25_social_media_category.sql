-- Nexora: a distinct Social Media editorial category, preserving Digital Life.
-- This only extends accepted article categories; it changes no read/write permissions.
alter table public.articles drop constraint if exists articles_category_check;
alter table public.articles add constraint articles_category_check check (category in (
  'technology', 'science', 'economy', 'world', 'books', 'health',
  'social', 'social_media', 'culture', 'education', 'environment'
));

-- Reclassify two existing platform announcements, keeping general daily-life stories unchanged.
update public.articles set category='social_media', updated_at=now()
where slug in ('meta-genclerin-yasini-yapay-zekayla-tahmin','x-lite-yeni-web-altyapi') and category='social';
