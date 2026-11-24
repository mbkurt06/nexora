'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { BotMessageSquare, Check, Copy, ExternalLink, X } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getChatGPTProjectUrl } from '@/lib/chatgpt-project';
import { formatArticleForChatGPT } from '@/lib/chatgpt-handoff';

type Placement = 'featured' | 'card' | 'header';
type Problem = 'project' | 'copy' | 'popup';
type Fallback = { problem: Problem; context: string; url: string | null };

async function copyContext(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* Try the older selection-based copy for Safari / PWA restrictions. */ }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;font-size:16px';
  document.body.appendChild(input);
  input.focus();
  input.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  input.remove();
  return copied;
}

export function ChatGPTAction({
  article, placement, onStart
}: {
  article: Article;
  placement: Placement;
  onStart?: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [fallback, setFallback] = useState<Fallback | null>(null);

  const openChatGPT = async () => {
    onStart?.();
    const context = formatArticleForChatGPT(article);
    const url = getChatGPTProjectUrl();

    if (!url) {
      setFallback({ problem: 'project', context, url: null });
      return;
    }

    setStatus('copying');
    // Keep the Nexora PWA in its original window: opening _blank on iOS
    // creates an empty Safari sheet when ChatGPT is handed off to its app.
    const copied = await copyContext(context);
    setStatus(copied ? 'copied' : 'idle');
    if (!copied) {
      setFallback({ problem: 'copy', context, url });
      return;
    }
    window.location.assign(url);
  };

  return <>
    <button type="button"
      className={'chatgpt-action chatgpt-action--' + placement}
      aria-label={article.title + ' — haber metnini kopyala ve ChatGPT News projesini aç'}
      title="Haberi kopyala ve ChatGPT News projesini aç"
      disabled={status === 'copying'}
      onClick={event => { event.preventDefault(); event.stopPropagation(); void openChatGPT(); }}>
      {status === 'copied' ? <Check size={18} aria-hidden="true"/> : <BotMessageSquare size={18} aria-hidden="true"/>}
      <span>ChatGPT</span>
    </button>

    {fallback && typeof document !== 'undefined' && createPortal(
      <div className="dialog-scrim" onMouseDown={event => {
        if (event.target === event.currentTarget) setFallback(null);
      }}>
        <div className="dialog chatgpt-fallback-dialog" role="dialog" aria-modal="true" aria-label="ChatGPT haber aktarımı">
          <div className="dialog-title-row">
            <h2>ChatGPT'ye haber aktarımı</h2>
            <button type="button" className="dialog-close" aria-label="Kapat" onClick={() => setFallback(null)}>
              <X size={20}/>
            </button>
          </div>
          {fallback.problem === 'project' ? <>
            <p>News proje bağlantısı ayarlı değil. Ayarlar'dan proje adresini kaydettikten sonra aynı haberin ChatGPT düğmesine yeniden bas.</p>
            <Link className="open-chatgpt" href="/settings">Proje ayarlarını aç <ExternalLink size={16}/></Link>
          </> : <>
            <p>{fallback.problem === 'copy'
              ? 'Tarayıcı haber metnini otomatik kopyalamaya izin vermedi. Aşağıdan metni seçip kopyalayabilirsin.'
              : 'Haber metni kopyalandı, fakat tarayıcı ChatGPT penceresini açmayı engelledi.'}</p>
            <label className="context-label" htmlFor={'chatgpt-context-' + article.id}>Haber başlığı, açıklama, metin ve kaynak</label>
            <textarea id={'chatgpt-context-' + article.id} className="context-preview" readOnly
              onFocus={event => event.currentTarget.select()} value={fallback.context}/>
            <button type="button" className="copy-button" onClick={async () => {
              const copied = await copyContext(fallback.context);
              if (copied) {
                setStatus('copied');
                setFallback({ ...fallback, problem: 'popup' });
              }
            }}><Copy size={17}/> Metni tekrar kopyala</button>
            {fallback.url && <a className="open-chatgpt" href={fallback.url}
              target="_blank" rel="noopener noreferrer">News projesini aç <ExternalLink size={16}/></a>}
          </>}
          <p className="dialog-limit">ChatGPT'de News projesinin içinde <strong>Yeni sohbet</strong> aç, kopyalanmış haberi yapıştır ve gönder. Nexora, kişisel ChatGPT projesine otomatik mesaj gönderemez.</p>
        </div>
      </div>, document.body)
    }
  </>;
}
