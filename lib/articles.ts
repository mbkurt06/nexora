import { createClient } from '@supabase/supabase-js';
import { demoArticles } from './demo-articles';
import type { Article, Category, Importance } from './types';

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  category: string;
  subcategory: string;
  published_at: string | null;
  source_name: string | null;
  source_url: string | null;
  importance: string;
  read_time: number;
  cover_tone: string;
}

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    category: row.category as Category,
    subcategory: row.subcategory,
    publishedAt: row.published_at,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    importance: row.importance as Importance,
    readTime: row.read_time,
    coverTone: row.cover_tone,
    isDemo: false,
  };
}

export async function getArticles(): Promise<Article[]> {
  const supabase = database();
  if (!supabase) return demoArticles;
  const { data, error } = await supabase.from('articles')
    .select('id,slug,title,summary,body,category,subcategory,published_at,source_name,source_url,importance,read_time,cover_tone')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);
  if (error) { console.error('Could not load published news:', error.message); return []; }
  return data?.length ? (data as ArticleRow[]).map(toArticle) : demoArticles;
}

export async function getArticle(slug: string): Promise<Article | null> {
  const supabase = database();
  if (!supabase) return demoArticles.find(article => article.slug === slug) ?? null;
  const { data, error } = await supabase.from('articles')
    .select('id,slug,title,summary,body,category,subcategory,published_at,source_name,source_url,importance,read_time,cover_tone')
    .eq('status', 'published').eq('slug', slug).maybeSingle();
  if (error) { console.error('Could not load article:', error.message); return null; }
  return data ? toArticle(data as ArticleRow) : (demoArticles.find(a => a.slug === slug) ?? null);
}
