'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Bookmark, BookOpen, Clock3, Search, Sparkles, X } from 'lucide-react';
import type { Article, Category } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

type Section = Category | 'all' | 'saved';

function getStoredSet(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]') as string[]); }
  catch { return new Set(); }
}

function sectionName(section: Section): string {
  if (section === 'all') return 'Öne çıkanlar';
  if (section === 'saved') return 'Kaydedilenler';
  return CATEGORY_LABELS[section];
}

const categoryGlyph: Record<Category, string> = { technology: '◈', science: '✳', world: '◎', social: '◉' };

function formatDate(article: Article): string {
  if (article.isDemo) return 'Örnek içerik';
  if (!article.publishedAt) return 'Tarih belirtilmedi';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }).format(new Date(article.publishedAt));
}

export function NewsHome({ articles }: {articles: Article[]}) {
  const [section, setSection] = useState<Section>('all');
  const [query, setQuery] = useState('');
  const [subcategory, setSubcategory] = useState('Tümü');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [read, setRead] = useState<Set<string>>(new Set());
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem('nexora:section') as Section | null;
    if (s && ['all', 'saved', ...CATEGORIES.map(c => c.id)].includes(s)) setSection(s);
    setSaved(getStoredSet('nexora:saved'));
    setRead(getStoredSet('nexora:read'));
    setBooted(true);
    const y = Number(sessionStorage.getItem('nexora:scroll') || '0');
    if (y > 0) requestAnimationFrame(() => setTimeout(() => window.scrollTo(0, y), 60));
  }, []);

  useEffect(() => {
    if (!booted) return;
    sessionStorage.setItem('nexora:section', section);
  }, [section, booted]);

  const filteredBySection = articles.filter(a => section === 'all' || section === 'saved' && saved.has(a.id) || a.category === section);
  const subcategories = ['Tümü', ...Array.from(new Set(filteredBySection.map(a => a.subcategory)))];
  const filtered = useMemo(() => filteredBySection.filter(a => {
    const matchesSubcategory = subcategory === 'Tümü' || a.subcategory === subcategory;
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return matchesSubcategory && (!q || (a.title + ' ' + a.summary + ' ' + a.subcategory).toLocaleLowerCase('tr-TR').includes(q));
  }), [filteredBySection, query, subcategory]);
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const demoMode = articles.length > 0 && articles.every(a => a.isDemo);

  const chooseSection = (newSection: Section) => {
    setSection(newSection);
    setSubcategory('Tümü');
    sessionStorage.setItem('nexora:scroll', '0');
  };
  const toggleSaved = (id: string) => {
    const updated = new Set(saved);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSaved(updated);
    localStorage.setItem('nexora:saved', JSON.stringify([...updated]));
  };
  const rememberScroll = () => sessionStorage.setItem('nexora:scroll', String(window.scrollY));

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="masthead">
          <Link href="/" className="brand" aria-label="Nexora ana sayfa">NEXORA<span className="brand-dot">.</span></Link>
          <span className="masthead-caption">Dünyayı anlamanın yeni yolu</span>
          <button className="saved-button" onClick={() => chooseSection('saved')} aria-label="Kaydedilen haberleri göster">
            <Bookmark size={19} /> <span>{saved.size}</span>
          </button>
        </div>
        <nav className="top-nav" aria-label="Haber bölümleri">
          <button className={section === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => chooseSection('all')}>Tümü</button>
          {CATEGORIES.map(c => <button key={c.id} className={section === c.id ? 'nav-item active' : 'nav-item'} onClick={() => chooseSection(c.id)}>{c.name}</button>)}
        </nav>
      </header>

      <main className="main-content">
        <section className="intro">
          <div className="intro-overline"><span className="pulsedot" /> KİŞİSEL HABER GAZETEN</div>
          <h1>Merak ettiğin dünya,<br /><em>tek bir yerde.</em></h1>
          <p>Teknolojiden bilime, dünya gündeminden sosyal medyaya. Önemli gelişmeleri anlaşılır özetlerle oku, ChatGPT ile derinleştir.</p>
          {demoMode && <div className="demo-banner"><Sparkles size={17}/><span>Bu sürüm arayüzü denemek içindir. Aşağıdaki yazılar güncel haber değil, <strong>örnek içeriktir.</strong></span></div>}
        </section>

        <section className="category-grid" aria-label="Kategoriler">
          {CATEGORIES.map(c => (
            <button key={c.id} className={'category-tile category-'+c.id} onClick={() => chooseSection(c.id)}>
              <div className="category-row"><span className="category-mark">{categoryGlyph[c.id]}</span><ArrowUpRight size={18}/></div>
              <strong>{c.name}</strong><span>{c.description}</span>
            </button>
          ))}
        </section>

        <section className="feed-section" aria-live="polite">
          <div className="section-top">
            <div><span className="eyebrow">KEŞFET</span><h2>{sectionName(section)}</h2></div>
            <span className="story-count">{filtered.length} içerik</span>
          </div>
          <div className="filter-area">
            <label className="search-box"><Search size={18} aria-hidden="true"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Haberlerde ara..." aria-label="Haberlerde ara" />{query && <button onClick={() => setQuery('')} aria-label="Aramayı temizle"><X size={17}/></button>}</label>
            <div className="chips" aria-label="Alt kategoriler">
              {subcategories.map(s => <button key={s} className={subcategory === s ? 'chip active' : 'chip'} onClick={() => setSubcategory(s)}>{s}</button>)}
            </div>
          </div>
          {featured ? <>
            <div className={'featured-card tone-'+featured.coverTone}>
              <Link href={'/story/'+featured.slug} onClick={rememberScroll} className="featured-link">
                <div className="feature-decor" aria-hidden="true">{categoryGlyph[featured.category]}</div>
                <span className="featured-kicker">{CATEGORY_LABELS[featured.category]} / {featured.subcategory}</span>
                <h3>{featured.title}</h3>
                <p>{featured.summary}</p>
                <div className="featured-meta"><span><Clock3 size={15}/>{featured.readTime} dk okuma</span><span>{formatDate(featured)}</span><ArrowRight size={21}/></div>
              </Link>
              <button className="feature-save" aria-label={saved.has(featured.id) ? 'Kaydedilenlerden çıkar' : 'Haberi kaydet'} onClick={() => toggleSaved(featured.id)}><Bookmark size={19} fill={saved.has(featured.id) ? 'currentColor' : 'none'}/></button>
            </div>
            <div className="article-grid">
              {rest.map(a => <article key={a.id} className={'news-card '+(read.has(a.id) ? 'has-read' : '')}>
                <div className={'card-art tone-'+a.coverTone} aria-hidden="true"><span>{categoryGlyph[a.category]}</span></div>
                <div className="card-content">
                  <div className="card-top"><span>{CATEGORY_LABELS[a.category]} / {a.subcategory}</span><button onClick={() => toggleSaved(a.id)} aria-label={saved.has(a.id) ? 'Kaydedilenlerden çıkar' : 'Haberi kaydet'}><Bookmark size={18} fill={saved.has(a.id) ? 'currentColor' : 'none'}/></button></div>
                  <Link href={'/story/'+a.slug} onClick={rememberScroll} className="card-title"><h3>{a.title}</h3></Link>
                  <p>{a.summary}</p>
                  <div className="card-footer"><span><Clock3 size={14}/>{a.readTime} dk</span><span>{read.has(a.id) ? '✓ Okundu' : formatDate(a)}</span><Link href={'/story/'+a.slug} onClick={rememberScroll} aria-label={a.title+' haberini oku'}><ArrowRight size={19}/></Link></div>
                </div>
              </article>)}
            </div>
          </> : <div className="empty-state"><BookOpen size={32}/><h3>Bu bölümde içerik yok</h3><p>Başka bir kategori seçebilir veya aramanı değiştirebilirsin.</p></div>}
        </section>
      </main>
      <footer className="footer"><span>NEXORA<span className="brand-dot">.</span></span><small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small><span>© Nexora</span></footer>
    </div>
  );
}
