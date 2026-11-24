import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Haber veritabanı kullanılamıyor' }, { status: 503 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from('articles')
    .select('id,updated_at')
    .eq('status', 'published')
    .order('issue_date', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: 'Güncelleme kontrolü yapılamadı' }, { status: 503 });
  }

  const revision = (data ?? [])
    .map(item => item.id + ':' + (item.updated_at ?? ''))
    .sort()
    .join('|');

  return NextResponse.json(
    { build: process.env.VERCEL_GIT_COMMIT_SHA ?? 'development', revision },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
  );
}
