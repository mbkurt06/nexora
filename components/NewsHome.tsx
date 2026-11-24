'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookOpen, CalendarDays, Clock3, Search, Settings, X } from 'lucide-react';
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
  const demoMode = articles.length > 0 && articles.every(a=>a.isDemo);
  const currentIndex = dates.indexOf(issueDate);
  const rememberScroll = () => sessionStorage.setItem('nexora:scroll',String(window.scrollY));

  return <div className="app-shell">
    <header className="site-header">
      <div className="masthead">
        <SiteMenu/>
        <Link href="/" className="brand" aria-label="Nexora ana sayfa">NEXORA<span className="brand-dot">.</span></Link>
        <span className="masthead-caption">Nexora Günlük</span>
        <Link href="/settings" className="settings-button" aria-label="Ayarlar"><Settings size={19}/></Link>
        <button className="saved-button" onClick={()=>selectCategory('saved')} aria-label="Kaydedilen haberler">
          <Bookmark size={19}/><span>{saved.size}</span>
        </button>
      </div>
      <div className="publication-nav"><span className="publication-current"><BookOpen size={16}/> NEXORA GÜNLÜK</span><span>Haber • Bilgi • Arşiv</span></div>
    </header>

    <main className="main-content">
      <section className="daily-intro">
        <div className="intro-overline"><span className="pulsedot"/> NEXORA GÜNLÜK / KİŞİSEL HABER DERGİSİ</div>
        <h1>Bugünü anla.<br/><em>Dünü keşfet.</em></h1>
        <p>Teknoloji, bilim, ekonomi, kitaplar ve dünyadaki önemli gelişmeler. Kaynaklı Türkçe özetler, her haber için ChatGPT değerlendirmesi.</p>
        {demoMode && <div className="demo-banner">Henüz doğrulanmış haber eklenmedi. Bu görünüm yalnızca örnek içerik gösteriyor.</div>}
      </section>

      <section className="edition-selector" aria-label="Tarihe göre yayın seç">
        <div className="edition-heading">
          <div><span className="eyebrow">GÜNLÜK ARŞİV</span><h2>{issueDate === 'all' ? 'Son 30 gün' : prettyDate(issueDate,true)}</h2></div>
          <div className="edition-tools">
            <button className="edition-today" onClick={()=>selectIssue('all')}>Son 30 gün</button>
            <label className="edition-calendar"><CalendarDays size={17}/><span className="sr-only">Arşiv tarihi seç</span>
              <input type="date" aria-label="Arşivden tarih seç" value={issueDate === 'all'?'':issueDate}
                min={minDate} max={maxDate} onChange={event => event.target.value && selectIssue(event.target.value)}/>
            </label>
          </div>
        </div>
        <div className="issue-strip" role="group" aria-label="Haber bulunan günler">
          <button className={'issue-tab issue-all '+(issueDate === 'all'?'selected':'')} onClick={()=>selectIssue('all')} aria-pressed={issueDate === 'all'}>
            <span>ARŞİV</span><strong>30 gün</strong><small>{articles.length} haber</small>
          </button>
          {dates.map(date=><button key={date} className={'issue-tab '+(date === issueDate?'selected':'')}
            aria-pressed={date === issueDate} onClick={()=>selectIssue(date)}>
            <span>{datePart(date,'month')}</span><strong>{datePart(date,'day')}</strong><small>{articles.filter(a=>issueOf(a)===date).length} haber</small>
          </button>)}
        </div>
        <div className="edition-explainer">
          <span>{issueDate === 'all' ? 'Son bir ayın seçilmiş kaynaklı gelişmeleri' : 'Seçilen günün haberleri'}</span>
          {issueDate !== 'all' && <div className="edition-arrows">
            <button disabled={currentIndex <= 0} aria-label="Sonraki haberli gün" onClick={()=>currentIndex>0 && selectIssue(dates[currentIndex-1])}><ArrowRight size={16}/></button>
            <button disabled={currentIndex < 0 || currentIndex >= dates.length-1} aria-label="Önceki haberli gün" onClick={()=>selectIssue(dates[currentIndex+1])}><ArrowLeft size={16}/></button>
          </div>}
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
