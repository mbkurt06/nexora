'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Article } from '@/lib/types';

type UpdateKind = 'version' | 'news' | null;
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function RefreshButton({ articles, build }: { articles: Article[]; build: string }) {
  const [update, setUpdate] = useState<UpdateKind>(null);
  const [reloading, setReloading] = useState(false);
  const lastCheck = useRef(0);
  const checking = useRef(false);

  const currentRevision = useMemo(() => articles
    .map(article => article.id + ':' + (article.updatedAt ?? ''))
    .sort()
    .join('|'), [articles]);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!active || document.visibilityState === 'hidden' || checking.current) return;
      if (Date.now() - lastCheck.current < CHECK_INTERVAL_MS) return;

      checking.current = true;
      lastCheck.current = Date.now();
      try {
        const response = await fetch('/api/updates', { cache: 'no-store', credentials: 'same-origin' });
        if (!response.ok) return;
        const latest = await response.json() as { build?: string; revision?: string };
        if (!active) return;
        if (latest.build && latest.build !== build) setUpdate('version');
        else if (typeof latest.revision === 'string' && latest.revision !== currentRevision) setUpdate('news');
      } catch {
        // A failed check should not show a misleading green status while offline.
      } finally {
        checking.current = false;
      }
    };

    void check();
    const interval = window.setInterval(() => { void check(); }, CHECK_INTERVAL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') void check(); };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [build, currentRevision]);

  const label = update === 'version' ? 'Yeni Nexora sürümü hazır. Yenile'
    : update === 'news' ? 'Yeni haberler var. Yenile'
    : 'Haberleri ve uygulamayı yenile';

  return (
    <button type="button"
      className={'refresh-button' + (update ? ' has-update' : '')}
      aria-label={label}
      title={label}
      disabled={reloading}
      onClick={() => { setReloading(true); window.location.reload(); }}>
      <RefreshCw size={20} aria-hidden="true" className={reloading ? 'refresh-spinning' : ''}/>
      {update && <span className="refresh-dot" aria-hidden="true"/>}
    </button>
  );
}
