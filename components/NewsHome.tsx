'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookOpen, CalendarDays, Clock3, Search, X } from 'lucide-react';
import type { Article, Category } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { SiteMenu } from '@/components/SiteMenu';

type Section = Category | 'all' | 'saved';
const issueOf = (article: Article) => article.issueDate || article.publishedAt?.slice(0,10) || null;

function stored(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]') as string[]); }
  catch { return new Set<string>(); }
}
function articleDate(article: Article) {
  if (article.isDemo) return 'Örnek içerik';
  const date = issueOf(article);
  if (!date) return 'Tarih belirtilmedi';
  return new Intl.DateTimeFormat('tr-TR', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(date + 'T12:00:00Z'));
}
function prettyDate(value: string, weekday = false): string {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric',
    ...(weekday ? {weekday:'long' as const} : {}), timeZone:'UTC'
  }).format(new Date(value + 'T12:00:00Z'));
}
function datePart(value: string, what: 'day' | 'month') {
  const date = new Date(value + 'T12:00:00Z');
  if (what === 'day') return String(date.getUTCDate());
  return new Intl.DateTimeFormat('tr-TR', {month:'short', timeZone:'UTC'}).format(date);
}

export function NewsHome({ articles }: { articles: Article[] }) {
  const [section,setSection] = useState<Section>('all');
  const [issueDate,setIssueDate] = useState('all');
  const [subcategory,setSubcategory] = useState('Tümü');
  const [search,setSearch] = useState('');
  const [saved,setSaved] = useState<Set<string>>(new Set());
  const [read,setRead] = useState<Set<string>>(new Set());
  const [ready,setReady] = useState(false);

  const dates = useMemo(() =>
    Array.from(new Set(articles.map(issueOf).filter((s):s is string => Boolean(s)))).sort((a,b) => b.localeCompare(a)),
    [articles]);
  const minDate = dates[dates.length - 1] || '';
  const maxDate = dates[0] || '';

  useEffect(() => {
    const sectionValue = sessionStorage.getItem('nexora:section') as Section | null;
    if (sectionValue && ['all','saved', ...CATEGORIES.map(c=>c.id)].includes(sectionValue)) setSection(sectionValue);
    const queryDate = new URL(window.location.href).searchParams.get('date');
    const savedDate = sessionStorage.getItem('nexora:issue-date');
    const value = queryDate || savedDate || 'all';
    if (value === 'all' || /^\d{4}-\d{2}-\d{2}$/.test(value)) setIssueDate(value);
    setSaved(stored('nexora:saved'));
    setRead(stored('nexora:read'));
    setReady(true);
    const previousScroll = Number(sessionStorage.getItem('nexora:scroll') || '0');
    if (previousScroll > 0) requestAnimationFrame(() => {
      setTimeout(() => window.scrollTo({top:previousScroll,behavior:'instant'}),70);
    });
  }, []);

  useEffect(() => {
    if (ready) sessionStorage.setItem('nexora:section',section);
  },[section,ready]);

  const selectIssue = (date: string) => {
    setIssueDate(date);
    setSubcategory('Tümü');
    sessionStorage.setItem('nexora:issue-date',date);
    sessionStorage.setItem('nexora:scroll','0');
    const target = new URL(window.location.href);
    if (date === 'all') target.searchParams.delete('date');
    else target.searchParams.set('date',date);
    window.history.replaceState({},'',target.pathname + target.search);
  };

  const selectCategory = (category: Section) => {
    setSection(category);
    setSubcategory('Tümü');
    sessionStorage.setItem('nexora:scroll','0');
  };

  const toggleSaved = (id:string) => {
    const next = new Set(saved);
    if(next.has(id)) next.delete(id); else next.add(id);
    setSaved(next);
    try { localStorage.setItem('nexora:saved',JSON.stringify([...next])); } catch {}
  };

  const candidates = articles.filter(a =>
    (issueDate === 'all' || issueOf(a) === issueDate)
    && (section === 'all' || (section === 'saved' ? saved.has(a.id) : a.category === section)));
  const subcategories = ['Tümü', ...Array.from(new Set(candidates.map(a=>a.subcategory)))];
  const filtered = candidates.filter(a => {
    const q = search.trim().toLocaleLowerCase('tr-TR');
    return (subcategory === 'Tümü' || subcategory === a.subcategory)
      && (!q || [a.title,a.summary,a.subcategory].join(' ').toLocaleLowerCase('tr-TR').includes(q));
  });
  const categoryName = section === 'all' ? 'Tüm başlıklar' : section === 'saved' ? 'Kaydedilenler' : CATEGORY_LABELS[section];
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const rememberScroll = () => sessionStorage.setItem('nexora:scroll',String(window.scrollY));

  return <div className="app-shell">
    <header className="site-header">
      <div className="masthead">
        <SiteMenu/>
        <Link href="/" className="brand" aria-label="Nexora ana sayfa">NEXORA<span className="brand-dot">.</span></Link>
        <span className="masthead-caption">Nexora Günlük</span>
        <button className="saved-button" onClick={()=>selectCategory('saved')} aria-label="Kaydedilen haberler">
          <Bookmark size={19}/><span>{saved.size}</span>
        </button>
      </div>
    </header>

    <main className="main-content">
      <section className="edition-selector" aria-label="Tarihe göre yayın seç">
        <div className="edition-compact-toolbar">
          <span className="edition-compact-current">{issueDate === 'all' ? 'Son 30 gün' : prettyDate(issueDate)}</span>
          <label className="edition-calendar"><CalendarDays size={16}/><span className="sr-only">Yayın tarihi seç</span>
            <input type="date" aria-label="Arşivden tarih seç" value={issueDate === 'all' ? '' : issueDate}
              min={minDate} max={maxDate} onChange={event => event.target.value && selectIssue(event.target.value)}/>
          </label>
        </div>
        <div className="issue-strip" role="group" aria-label="Haber bulunan günler">
          <button className={'issue-tab issue-all '+(issueDate === 'all'?'selected':'')} onClick={()=>selectIssue('all')} aria-pressed={issueDate === 'all'}>
            <strong>30 gün</strong>
          </button>
          {dates.map(date=><button key={date} className={'issue-tab '+(date === issueDate?'selected':'')}
            aria-pressed={date === issueDate} onClick={()=>selectIssue(date)}>
            <strong>{datePart(date,'day')}</strong><span>{datePart(date,'month')}</span>
          </button>)}
        </div>
      </section>

      <section className="topic-section">
        <div className="section-top topic-heading"><div><span className="eyebrow">KONULAR</span><h2>İlgi alanları</h2></div><span className="story-count">{CATEGORIES.length} bölüm</span></div>
        <div className="topic-grid">
          <button className={'topic-tile '+(section==='all'?'active':'')} onClick={()=>selectCategory('all')}>
            <span className="topic-icon">✦</span><strong>Tümü</strong><small>{candidates.length} haber</small>
          </button>
          {CATEGORIES.map(c=><button key={c.id} className={'topic-tile '+(section===c.id?'active':'')} onClick={()=>selectCategory(c.id)}>
            <span className="topic-icon">{c.icon}</span><strong>{c.name}</strong><small>{articles.filter(a=>(issueDate==='all'||issueOf(a)===issueDate)&&a.category===c.id).length} haber</small>
          </button>)}
        </div>
      </section>

      <section className="feed-section" aria-live="polite">
        <div className="section-top"><div><span className="eyebrow">OKUMA LİSTESİ</span><h2>{categoryName}</h2></div><span className="story-count">{filtered.length} haber</span></div>
        <div className="filter-area">
          <label className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Haberlerde ara" placeholder="Başlık veya konu ara..."/>{search && <button onClick={()=>setSearch('')} aria-label="Aramayı temizle"><X size={16}/></button>}</label>
          <div className="chips">
            {subcategories.map(s=><button key={s} className={'chip '+(subcategory===s?'active':'')} onClick={()=>setSubcategory(s)}>{s}</button>)}
          </div>
        </div>
        {featured ? <>
          <div className={'featured-card tone-'+featured.coverTone}>
            <Link href={'/story/'+featured.slug} onClick={rememberScroll} className="featured-link">
              <div className="feature-decor" aria-hidden="true">{CATEGORIES.find(c=>c.id===featured.category)?.icon}</div>
              <span className="featured-kicker">{CATEGORY_LABELS[featured.category]} / {featured.subcategory}</span>
              <h3>{featured.title}</h3><p>{featured.summary}</p>
              <div className="featured-meta"><span><Clock3 size={15}/>{featured.readTime} dk</span><span>{articleDate(featured)}</span><ArrowRight size={21}/></div>
            </Link>
            <button className="feature-save" aria-label={saved.has(featured.id)?'Kaydı kaldır':'Haberi kaydet'} onClick={()=>toggleSaved(featured.id)}><Bookmark size={18} fill={saved.has(featured.id)?'currentColor':'none'}/></button>
          </div>
          <div className="article-grid">{rest.map(article=><article key={article.id} className={'news-card '+(read.has(article.id)?'has-read':'')}>
            <div className={'card-art tone-'+article.coverTone} aria-hidden="true"><span>{CATEGORIES.find(c=>c.id===article.category)?.icon}</span></div>
            <div className="card-content">
              <div className="card-top"><span>{CATEGORY_LABELS[article.category]} / {article.subcategory}</span><button aria-label={saved.has(article.id)?'Kaydı kaldır':'Haberi kaydet'} onClick={()=>toggleSaved(article.id)}><Bookmark size={18} fill={saved.has(article.id)?'currentColor':'none'}/></button></div>
              <Link className="card-title" href={'/story/'+article.slug} onClick={rememberScroll}><h3>{article.title}</h3></Link>
              <p>{article.summary}</p>
              <div className="card-footer"><span><Clock3 size={14}/>{article.readTime} dk</span><span>{read.has(article.id)?'✓ Okundu':articleDate(article)}</span><Link href={'/story/'+article.slug} onClick={rememberScroll} aria-label={'Haberi oku: '+article.title}><ArrowRight size={19}/></Link></div>
            </div>
          </article>)}</div>
        </> : <div className="empty-state"><BookOpen size={30}/><h3>Bu seçim için haber bulunamadı</h3><p>Her gün aynı sayıda haber yayımlanmıyor. Tarihi değiştirebilir veya son 30 gün arşivine dönebilirsin.</p><button className="empty-reset" onClick={()=>{selectIssue('all');selectCategory('all');setSearch('');}}>Son 30 günü göster</button></div>}
      </section>
    </main>
    <footer className="footer"><span>NEXORA<span className="brand-dot">.</span></span><small>Kaynağı kontrol et. Merakla oku. Birlikte düşün.</small><span>© Nexora Günlük</span></footer>
  </div>;
}
