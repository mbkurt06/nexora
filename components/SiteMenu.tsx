'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpenText, Menu, Settings, X } from 'lucide-react';

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', escape);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', escape);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button type="button" className="menu-button" aria-label="Nexora menüsünü aç"
        aria-expanded={open} aria-controls="nexora-drawer" onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>
      {open && <div className="nav-drawer-backdrop" onMouseDown={event => {
        if (event.target === event.currentTarget) setOpen(false);
      }}>
        <aside id="nexora-drawer" className="nav-drawer" role="dialog" aria-modal="true" aria-label="Nexora menüsü">
          <div className="nav-drawer-header">
            <strong>NEXORA<span className="brand-dot">.</span></strong>
            <button type="button" className="nav-drawer-close" aria-label="Menüyü kapat" onClick={() => setOpen(false)}><X size={21}/></button>
          </div>
          <p className="nav-drawer-caption">BÖLÜMLER</p>
          <nav className="nav-drawer-links" aria-label="Ana bölümler">
            <Link href="/" className="nav-drawer-link current" onClick={() => setOpen(false)}>
              <BookOpenText size={23}/><span><strong>Nexora Günlük</strong><small>Güncel haberler ve tarih arşivi</small></span>
            </Link>
          </nav>
          <p className="nav-drawer-soon">Yeni bölümler ve özel dosyalar ileride burada yer alacak.</p>
          <div className="nav-drawer-footer">
            <Link href="/settings" className="nav-drawer-settings" onClick={() => setOpen(false)}><Settings size={19}/> Ayarlar</Link>
            <small>Gündemini seç. Derinlemesine oku.</small>
          </div>
        </aside>
      </div>}
    </>
  );
}
