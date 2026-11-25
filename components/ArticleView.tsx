'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Clock3, ExternalLink, Info, Share2, X } from 'lucide-react';
import type { Article } from '@/lib/types';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { SiteMenu } from '@/components/SiteMenu';
import { ChatGPTAction } from '@/components/ChatGPTAction';

function getSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('nexora:saved') || '[]') as string[]); }
  catch { return new Set(); }
}


const GLOSSARY: Record<string, { title: string; explanation: string }> = {
  esa: { title: 'ESA — Avrupa Uzay Ajansı', explanation: 'Avrupa ülkelerinin ortak uzay araştırmaları kurumudur. Bilimsel uydular, gezegen keşif araçları ve uzay güvenliği görevleri geliştirir. NASA’dan ayrı bir kuruluştur.' },
  hera: { title: 'Hera uzay görevi', explanation: 'ESA’nın Didymos ve Dimorphos adlı çift asteroit sistemini inceleyen uzay aracıdır. NASA’nın 2022’de gerçekleştirdiği DART çarpışmasının asteroidi nasıl etkilediğini yerinde ölçmek için gönderildi.' },
  dimorphos: { title: 'Dimorphos nedir?', explanation: 'Didymos adlı daha büyük asteroidin çevresinde dolanan yaklaşık 160 metre çapındaki küçük asteroittir. NASA’nın DART uzay aracı 2022’de kasıtlı olarak Dimorphos’a çarptı.' },
  didymos: { title: 'Didymos nedir?', explanation: 'Dimorphos’un çevresinde dolandığı daha büyük asteroittir. İkili sistem, gezegen savunmasında bir asteroidin yörüngesinin değiştirilebilirliğini ölçmek için inceleniyor.' },
  dart: { title: 'DART — Çift Asteroit Yönlendirme Testi', explanation: 'NASA’nın 2022’de bir uzay aracını Dimorphos’a çarptırarak gökcisminin yörüngesini değiştirmeyi sınadığı gezegen savunması görevidir. Açılımı Double Asteroid Redirection Test’tir.' },
  nasa: { title: 'NASA — ABD Uzay Ajansı', explanation: 'Amerika Birleşik Devletleri’nin sivil uzay araştırmaları kurumudur. Uzay araçları, bilimsel görevler ve Dünya gözlemleri yürütür.' },
  cern: { title: 'CERN — Avrupa Nükleer Araştırma Merkezi', explanation: 'Parçacık fiziği araştırmalarının yürütüldüğü uluslararası bilim merkezidir. Büyük Hadron Çarpıştırıcısı da burada bulunur.' },
  who: { title: 'WHO — Dünya Sağlık Örgütü', explanation: 'Birleşmiş Milletler bünyesinde uluslararası halk sağlığını koordine eden kurumdur. Türkçe kısaltması DSÖ’dür.' },
  'dsö': { title: 'DSÖ — Dünya Sağlık Örgütü', explanation: 'Ülkelerin sağlık sistemleri arasında iş birliğini destekleyen ve küresel sağlık rehberleri yayımlayan Birleşmiş Milletler kuruluşudur.' },
  unesco: { title: 'UNESCO', explanation: 'Birleşmiş Milletler Eğitim, Bilim ve Kültür Örgütüdür. Eğitim, bilim, kültürel miras ve bilgiye erişim alanlarında çalışır.' },
  fcc: { title: 'FCC — ABD Federal İletişim Komisyonu', explanation: 'ABD’de radyo, televizyon, telekomünikasyon ve bazı uydu iletişim faaliyetlerini düzenleyen federal kurumdur.' },
  ai: { title: 'AI — Yapay Zekâ', explanation: 'Artificial Intelligence sözcüklerinin kısaltmasıdır. Verilerden örüntü öğrenebilen veya çeşitli görevleri gerçekleştirebilen bilgisayar sistemlerini kapsar.' },
  llm: { title: 'LLM — Büyük Dil Modeli', explanation: 'Large Language Model kısaltmasıdır. Büyük miktarda metinle eğitilmiş, dil anlama ve üretme görevlerinde kullanılan yapay zekâ modelidir.' },
  pfas: { title: 'PFAS — Kalıcı kimyasallar', explanation: 'Per- ve polifloroalkil maddelerdir. Bazıları çevrede çok yavaş parçalandığı için kalıcı kimyasallar olarak anılır.' },
  ab: { title: 'AB — Avrupa Birliği', explanation: 'Avrupa ülkelerinin siyasi ve ekonomik iş birliği topluluğudur. Avrupa Komisyonu, Parlamento ve Konsey gibi kurumları vardır.' },
  fMRI: { title: 'fMRI — İşlevsel manyetik rezonans', explanation: 'Beyindeki kan oksijenlenmesi değişimlerini izleyerek beyin etkinliğiyle ilişkili sinyalleri ölçen görüntüleme yöntemidir.' },
};

const GLOSSARY_REGEX = /(?<![\p{L}\p{N}])(ESA|Hera|Dimorphos|Didymos|DART|NASA|CERN|WHO|DSÖ|UNESCO|FCC|AI|LLM|PFAS|AB|fMRI)(?![\p{L}\p{N}])/giu;
function GlossaryText({ text, onExplain }: { text: string; onExplain: (key: string) => void }) {
  return <>{text.split(GLOSSARY_REGEX).map((part, index) => {
    const term = GLOSSARY[part.toLowerCase()];
    return term ? <button type="button" key={index} className="glossary-term" onClick={() => onExplain(part.toLowerCase())} aria-label={part + ' terimini açıkla'}>{part}<Info size={13} aria-hidden="true"/></button> : part;
  })}</>;
}

export function ArticleView({ article }: {article: Article}) {
  const [saved, setSaved] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTerm) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveTerm(null); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [activeTerm]);

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
              : article.issueDate
              ? new Intl.DateTimeFormat('tr-TR', {dateStyle:'long', timeZone:'UTC'}).format(new Date(article.issueDate + 'T12:00:00Z'))
              : 'Tarih belirtilmedi'}</span>
          </div>
          {article.isDemo && <div className="demo-banner">Bu yazı arayüzü denemek içindir. Güncel haber olarak sunulmuyor.</div>}
        </div>
        <div className={'story-hero tone-'+article.coverTone} aria-hidden="true">
          <span>{CATEGORIES.find(c => c.id === article.category)?.icon || '✦'}</span>
        </div>
        <div className="story-body">
          {article.body.map((paragraph, i) => <p key={i}><GlossaryText text={paragraph} onExplain={setActiveTerm}/></p>)}
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
      {activeTerm && GLOSSARY[activeTerm] && <div className="glossary-backdrop" onClick={() => setActiveTerm(null)}>
        <div className="glossary-dialog" role="dialog" aria-modal="true" aria-labelledby="glossary-title" onClick={event => event.stopPropagation()}>
          <button className="glossary-close" type="button" onClick={() => setActiveTerm(null)} aria-label="Açıklamayı kapat"><X size={22}/></button>
          <span className="glossary-eyebrow"><Info size={16}/> TERİM AÇIKLAMASI</span>
          <h2 id="glossary-title">{GLOSSARY[activeTerm].title}</h2>
          <p>{GLOSSARY[activeTerm].explanation}</p>
          <button className="glossary-done" onClick={() => setActiveTerm(null)}>Okumaya devam et</button>
        </div>
      </div>}
      <footer className="footer">
        <span>NEXORA<span className="brand-dot">.</span></span>
        <small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small>
      </footer>
    </div>
  );
}
