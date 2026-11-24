'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Bookmark, Check, Clock3, Copy, ExternalLink, Headphones, MessageCircle, Share2, X } from 'lucide-react';
import type { Article } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

type Mode = 'text' | 'voice';

function getSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('nexora:saved') || '[]') as string[]); }
  catch { return new Set(); }
}

function contextForArticle(article: Article, mode: Mode): string {
  return [
    'Nexora adlı haber uygulamasından bu içeriği değerlendiriyorum.',
    'Konu: ' + article.title,
    'Kategori: ' + CATEGORY_LABELS[article.category] + ' / ' + article.subcategory,
    'Yayın tarihi: ' + (article.publishedAt || 'Belirtilmemiş'),
    article.isDemo ? 'NOT: Bu güncel haber değil, uygulama için örnek bilgilendirme içeriğidir.' : '',
    'Özet: ' + article.summary,
    'Metin:\n' + article.body.join('\n\n'),
    'Kaynak: ' + (article.sourceUrl || 'Doğrudan kaynak bağlantısı bulunmuyor.'),
    mode === 'voice'
      ? 'Bu metni sohbetimizin bağlamı olarak kullan. Birazdan sesli konuşacağım. Önce konuyu kısa açıkla; sonra sorularımı dinle. Bilmediğin veya doğrulamadığın güncel gelişmeleri kesin ifade etme.'
      : 'Bu metni sohbetimizin bağlamı olarak kullan. Sorularımı açık, analitik ve kaynakları eleştirel değerlendirerek yanıtla. Bu içeriğin güncelliğini gerektiğinde ayrıca doğrula.'
  ].filter(Boolean).join('\n\n');
}

async function copyText(text: string, input: HTMLTextAreaElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (!input) return false;
    input.focus(); input.select();
    return document.execCommand('copy');
  }
}

export function ArticleView({ article }: {article: Article}) {
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const set = new Set(JSON.parse(localStorage.getItem('nexora:read') || '[]') as string[]);
      set.add(article.id);
      localStorage.setItem('nexora:read', JSON.stringify([...set]));
    } catch { /* Storage is optional */ }
    setSaved(getSaved().has(article.id));
  }, [article.id]);

  useEffect(() => {
    if (!mode) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMode(null); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [mode]);

  const toggleSaved = () => {
    try {
      const set = getSaved();
      if (set.has(article.id)) set.delete(article.id);
      else set.add(article.id);
      localStorage.setItem('nexora:saved', JSON.stringify([...set]));
      setSaved(set.has(article.id));
    } catch { setShareNotice('Bu tarayıcı kayıt özelliğini engelliyor.'); }
  };
  const share = async () => {
    const payload = { title: article.title, text: article.summary, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else { await navigator.clipboard.writeText(window.location.href); setShareNotice('Bağlantı kopyalandı.'); }
    } catch { /* Share dialog may be cancelled */ }
  };
  const openMode = (selected: Mode) => { setCopied(false); setMode(selected); };
  const prepared = mode ? contextForArticle(article, mode) : '';

  return (
    <div className="app-shell article-shell">
      <header className="article-header">
        <Link href="/" className="back-link"><ArrowLeft size={19}/> <span>Gazeteye dön</span></Link>
        <Link href="/" className="brand small-brand">NEXORA<span className="brand-dot">.</span></Link>
        <button className="icon-action" onClick={toggleSaved} aria-label={saved ? 'Kaydı kaldır' : 'Haberi kaydet'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'}/></button>
      </header>

      <main className="story-layout">
        <div className="story-head">
          <div className="story-eyebrow">{CATEGORY_LABELS[article.category]} <span>/</span> {article.subcategory}</div>
          <h1>{article.title}</h1>
          <p className="story-deck">{article.summary}</p>
          <div className="story-metadata"><span><Clock3 size={15}/>{article.readTime} dk okuma</span><span>{article.isDemo ? 'Örnek içerik • Güncel haber değil' : article.publishedAt ? new Intl.DateTimeFormat('tr-TR',{dateStyle:'long'}).format(new Date(article.publishedAt)) : 'Tarih belirtilmedi'}</span></div>
          {article.isDemo && <div className="demo-banner">Bu yazı arayüzü denemek içindir. Son 24 saatin doğrulanmış haberi olarak sunulmuyor.</div>}
        </div>
        <div className={'story-hero tone-'+article.coverTone} aria-hidden="true"><span>{article.category === 'science' ? '✳' : article.category === 'world' ? '◎' : article.category === 'social' ? '◉' : '◈'}</span></div>
        <div className="story-body">
          {article.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <div className="sources-block">
          <h2>Kaynak ve doğrulama</h2>
          {article.sourceUrl ? <a target="_blank" rel="noopener noreferrer" href={article.sourceUrl}>{article.sourceName || 'Orijinal kaynak'} <ExternalLink size={15}/></a> : <p>Bu örnek içerik için doğrudan haber kaynağı verilmedi. Günlük haberlerde orijinal bağlantılar yer alacak.</p>}
        </div>
        <section className="discussion-panel">
          <div className="discussion-head"><span className="discussion-spark">✦</span><div><span className="eyebrow">DAHA DERİNE İN</span><h2>Bu haberi birlikte değerlendirelim.</h2></div></div>
          <p>Haberin metnini ChatGPT'ye aktar, sorularını yaz veya sesli konuş. Ayrı bir API aboneliği gerekmiyor.</p>
          <div className="discussion-actions">
            <button onClick={() => openMode('text')}><MessageCircle size={20}/><span>Yazılı değerlendir</span><ArrowUpRight size={17}/></button>
            <button onClick={() => openMode('voice')}><Headphones size={20}/><span>Sesli konuş</span><ArrowUpRight size={17}/></button>
          </div>
          <small>ChatGPT ayrı açılır. Otomatik mesaj gönderme veya sesli modu otomatik başlatma garantisi yoktur.</small>
        </section>
        <div className="story-bottom"><button onClick={toggleSaved}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Kaydedildi' : 'Sonra okumak için kaydet'}</button><button onClick={share}><Share2 size={18}/>Paylaş</button></div>
        {shareNotice && <p className="toast-inline">{shareNotice}</p>}
      </main>
      <footer className="footer"><span>NEXORA<span className="brand-dot">.</span></span><small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small></footer>

      {mode && <div className="dialog-scrim" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setMode(null); }}>
        <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="dialog-title-row"><div><span className="eyebrow">{mode === 'voice' ? 'SESLİ SOHBET' : 'YAZILI SOHBET'}</span><h2 id="dialog-title">ChatGPT'de devam et</h2></div><button className="dialog-close" aria-label="Kapat" onClick={() => setMode(null)}><X size={21}/></button></div>
          <p>Önce haber bağlamını kopyala. Sonra ChatGPT'yi açıp yeni bir sohbete yapıştır.</p>
          <label htmlFor="prepared-context" className="context-label">Hazır haber bağlamı</label>
          <textarea id="prepared-context" ref={textRef} className="context-preview" readOnly value={prepared} onFocus={e=>e.currentTarget.select()} />
          <button className="copy-button" onClick={async () => setCopied(await copyText(prepared, textRef.current))}>{copied ? <Check size={19}/> : <Copy size={19}/>} {copied ? "Kopyalandı — şimdi ChatGPT'yi aç" : 'Haber metnini kopyala'}</button>
          <a className="open-chatgpt" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT'yi aç <ExternalLink size={17}/></a>
          {mode === 'voice' ? <p className="dialog-tip"><strong>Sesli konuşma:</strong> Metni sohbete yapıştırıp gönder, ChatGPT'de sesli modu başlat. iPhone'da arka planda konuşmaya devam etmek için ChatGPT'nin Voice → Background Conversations ayarını açman gerekebilir. Ardından Nexora'ya dönebilirsin.</p> : <p className="dialog-tip">ChatGPT sayfası açıldığında kopyaladığın metni yeni sohbete yapıştır. Sonra o haberi istediğin kadar tartışabilirsin.</p>}
        </div>
      </div>}
    </div>
  );
}
