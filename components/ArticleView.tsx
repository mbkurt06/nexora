'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Clock3, ExternalLink, Share2 } from 'lucide-react';
import type { Article } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { SiteMenu } from '@/components/SiteMenu';
import { ChatGPTAction } from '@/components/ChatGPTAction';

function getSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('nexora:saved') || '[]') as string[]); }
  catch { return new Set(); }
}

export function ArticleView({ article }: {article: Article}) {
  const [saved, setSaved] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  useEffect(() => {
    try {
      const read = new Set(JSON.parse(localStorage.getItem('nexora:read') || '[]') as string[]);
      read.add(article.id);
      localStorage.setItem('nexora:read', JSON.stringify([...read]));
    } catch { /* Storage is optional */ }
    setSaved(getSaved().has(article.id));
  }, [article.id]);

  const toggleSaved = () => {
    try {
      const next = getSaved();
      if (next.has(article.id)) next.delete(article.id);
      else next.add(article.id);
      localStorage.setItem('nexora:saved', JSON.stringify([...next]));
      setSaved(next.has(article.id));
    } catch {
      setShareNotice('Bu tarayıcı kaydetme özelliğini engelliyor.');
    }
  };

  const share = async () => {
    const payload = { title: article.title, text: article.summary, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareNotice('Haber bağlantısı kopyalandı.');
      }
    } catch { /* Share dialog may be cancelled */ }
  };

  return (
    <div className="app-shell article-shell">
      <header className="article-header">
        <SiteMenu/>
        <Link href="/" className="back-link"><ArrowLeft size={19}/> <span>Gazeteye dön</span></Link>
        <Link href="/" className="brand small-brand">NEXORA<span className="brand-dot">.</span></Link>
        <div className="article-header-actions">
          <ChatGPTAction article={article} placement="header"/>
        </div>
      </header>

      <main className="story-layout">
        <div className="story-head">
          <div className="story-eyebrow">NEXORA GÜNLÜK / {CATEGORY_LABELS[article.category]} <span>/</span> {article.subcategory}</div>
          <h1>{article.title}</h1>
          <p className="story-deck">{article.summary}</p>
          <div className="story-metadata">
            <span><Clock3 size={15}/>{article.readTime} dk okuma</span>
            <span>{article.isDemo ? 'Örnek içerik • Güncel haber değil'
              : article.publishedAt
              ? new Intl.DateTimeFormat('tr-TR', {dateStyle:'long'}).format(new Date(article.publishedAt))
              : 'Tarih belirtilmedi'}</span>
          </div>
          {article.isDemo && <div className="demo-banner">Bu yazı arayüzü denemek içindir. Güncel haber olarak sunulmuyor.</div>}
        </div>
        <div className={'story-hero tone-'+article.coverTone} aria-hidden="true">
          <span>{CATEGORIES.find(c => c.id === article.category)?.icon || '✦'}</span>
        </div>
        <div className="story-body">
          {article.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <div className="sources-block">
          <h2>Kaynak ve doğrulama</h2>
          {article.sourceUrl
            ? <a target="_blank" rel="noopener noreferrer" href={article.sourceUrl}>
                {article.sourceName || 'Orijinal kaynak'} <ExternalLink size={15}/>
              </a>
            : <p>Bu içerik için doğrudan haber kaynağı verilmedi.</p>}
        </div>
        <div className="story-bottom">
          <button onClick={toggleSaved}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Kaydedildi' : 'Sonra okumak için kaydet'}</button>
          <button onClick={share}><Share2 size={18}/>Paylaş</button>
        </div>
        {shareNotice && <p className="toast-inline">{shareNotice}</p>}
      </main>
      <footer className="footer">
        <span>NEXORA<span className="brand-dot">.</span></span>
        <small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small>
      </footer>
    </div>
  );
}
