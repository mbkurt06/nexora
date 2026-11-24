'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, LockKeyhole, Moon, Monitor, Sun } from 'lucide-react';
import { getThemePreference, saveThemePreference, type ThemePreference } from '@/lib/theme';

const options: { value: ThemePreference; label: string; description: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Açık', description: 'Her zaman açık renk görünüm', Icon: Sun },
  { value: 'dark', label: 'Gece modu', description: 'Her zaman koyu renk görünüm', Icon: Moon },
  { value: 'system', label: 'Otomatik', description: 'iPhone veya bilgisayarın ayarını takip et', Icon: Monitor },
];

export function SettingsView() {
  const [selected, setSelected] = useState<ThemePreference>('system');

  useEffect(() => { setSelected(getThemePreference()); }, []);

  const change = (value: ThemePreference) => {
    saveThemePreference(value);
    setSelected(value);
  };

  return (
    <div className="app-shell">
      <header className="article-header">
        <Link className="back-link" href="/"><ArrowLeft size={19}/> <span>Gazeteye dön</span></Link>
        <Link href="/" className="brand small-brand">NEXORA<span className="brand-dot">.</span></Link>
        <span className="header-placeholder" aria-hidden="true"/>
      </header>
      <main className="settings-layout">
        <span className="eyebrow">KİŞİSELLEŞTİR</span>
        <h1>Ayarlar</h1>
        <p className="settings-description">Nexora'yı kendi okuma alışkanlıklarına göre düzenle.</p>
        <section className="settings-section" aria-labelledby="appearance-heading">
          <div className="settings-section-heading">
            <Moon size={22} aria-hidden="true" />
            <div><h2 id="appearance-heading">Görünüm</h2><p>Açık, koyu veya otomatik renk seç.</p></div>
          </div>
          <div className="appearance-options" role="radiogroup" aria-label="Renk teması">
            {options.map(({ value, label, description, Icon }) => (
              <button key={value} type="button"
                role="radio" aria-checked={selected === value}
                onClick={() => change(value)}
                className={'appearance-option ' + (selected === value ? 'selected' : '')}>
                <span className="appearance-option-icon"><Icon size={22}/></span>
                <span className="appearance-option-text"><strong>{label}</strong><small>{description}</small></span>
                <span className="theme-radio" aria-hidden="true">{selected === value && <Check size={16}/>}</span>
              </button>
            ))}
          </div>
          <p className="settings-hint">Tercihin bu cihazda saklanır. Başka bir cihazda farklı görünüm seçebilirsin.</p>
        </section>
        <section className="settings-section" aria-labelledby="privacy-heading">
          <div className="settings-section-heading">
            <LockKeyhole size={22} aria-hidden="true"/>
            <div><h2 id="privacy-heading">Özel erişim</h2><p>Yalnızca izinli Vercel hesapları giriş yapabilir.</p></div>
          </div>
          <div className="privacy-note">Nexora'nın erişim koruması Vercel üzerinden yönetilir. Bu ekrandaki görünüm ayarı güvenlik izinlerini değiştirmez.</div>
        </section>
      </main>
      <footer className="footer"><span>NEXORA<span className="brand-dot">.</span></span><small>Merakla oku. Kaynağı kontrol et. Birlikte düşün.</small></footer>
    </div>
  );
}
