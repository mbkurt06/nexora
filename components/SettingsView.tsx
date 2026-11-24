'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, ExternalLink, Link2, LockKeyhole, MessageCircle, Moon, Monitor, Sun, X } from 'lucide-react';
import { SiteMenu } from '@/components/SiteMenu';
import { getThemePreference, saveThemePreference, type ThemePreference } from '@/lib/theme';
import { CHATGPT_PROJECT_INSTRUCTIONS, clearChatGPTProjectUrl, getChatGPTProjectUrl, saveChatGPTProjectUrl } from '@/lib/chatgpt-project';

const options: { value: ThemePreference; label: string; description: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Açık', description: 'Her zaman açık renk görünüm', Icon: Sun },
  { value: 'dark', label: 'Gece modu', description: 'Her zaman koyu renk görünüm', Icon: Moon },
  { value: 'system', label: 'Otomatik', description: 'iPhone veya bilgisayarın ayarını takip et', Icon: Monitor },
];

export function SettingsView() {
  const [selected, setSelected] = useState<ThemePreference>('system');
  const [projectInput, setProjectInput] = useState('');
  const [projectUrl, setProjectUrl] = useState<string | null>(null);
  const [projectError, setProjectError] = useState('');
  const [instructionsCopied, setInstructionsCopied] = useState(false);

  useEffect(() => {
    setSelected(getThemePreference());
    const saved = getChatGPTProjectUrl();
    setProjectUrl(saved);
    setProjectInput(saved || '');
  }, []);

  const saveProject = () => {
    const valid = saveChatGPTProjectUrl(projectInput);
    if (!valid) {
      setProjectError('ChatGPT projesinin adresini gir. Adres https://chatgpt.com/g/g-p-.../project biçiminde olmalı.');
      return;
    }
    setProjectError('');
    setProjectUrl(valid);
    setProjectInput(valid);
  };

  const removeProject = () => {
    clearChatGPTProjectUrl();
    setProjectInput('');
    setProjectUrl(null);
    setProjectError('');
  };

  const copyInstructions = async () => {
    try { await navigator.clipboard.writeText(CHATGPT_PROJECT_INSTRUCTIONS); setInstructionsCopied(true); }
    catch { setInstructionsCopied(false); }
  };

  const change = (value: ThemePreference) => {
    saveThemePreference(value);
    setSelected(value);
  };

  return (
    <div className="app-shell">
      <header className="article-header">
        <SiteMenu/><Link className="back-link" href="/"><ArrowLeft size={19}/> <span>Gazeteye dön</span></Link>
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
        <section className="settings-section" aria-labelledby="chatgpt-project-heading">
          <div className="settings-section-heading">
            <MessageCircle size={22} aria-hidden="true"/>
            <div><h2 id="chatgpt-project-heading">ChatGPT haber projesi</h2>
              <p>Her haberi ayrı bir sohbet olarak aynı ChatGPT projesinde değerlendir.</p>
            </div>
          </div>
          <div className="project-setup-steps">
            <p><strong>1.</strong> ChatGPT'de <strong>Nexora Haber Analizleri</strong> adında özel bir proje oluştur.</p>
            <p><strong>2.</strong> Proje açıkken tarayıcı adresini kopyala ve aşağıdaki alana yapıştır.</p>
          </div>
          <label className="project-url-label" htmlFor="chatgpt-project-url">Proje bağlantısı</label>
          <div className="project-url-field">
            <Link2 size={19} aria-hidden="true" />
            <input id="chatgpt-project-url" type="url" value={projectInput}
              placeholder="https://chatgpt.com/g/g-p-.../project"
              autoComplete="off" spellCheck={false}
              onChange={event => { setProjectInput(event.target.value); setProjectError(''); }}
              aria-invalid={Boolean(projectError)} aria-describedby={projectError ? 'project-error' : undefined}/>
          </div>
          {projectError && <p id="project-error" className="project-input-error" role="alert">{projectError}</p>}
          <div className="project-setup-actions">
            <button type="button" className="project-save-button" onClick={saveProject}><Check size={17}/> Projeyi kaydet</button>
            {projectUrl && <button type="button" className="project-remove-button" onClick={removeProject}><X size={16}/> Bağlantıyı kaldır</button>}
          </div>
          {projectUrl && <div className="project-linked-note"><Check size={18}/> Proje bağlantısı bu cihazda kayıtlı.
            <a href={projectUrl} target="_blank" rel="noopener noreferrer">Projeyi aç <ExternalLink size={14}/></a>
          </div>}
          <p className="settings-hint">Bu bağlantı yalnızca cihazında saklanır. ChatGPT'deki özel projenin sohbetlerine erişim yetkisi vermez veya otomatik sohbet oluşturmaz.</p>
          <div className="project-instructions">
            <h3>Proje talimatı (isteğe bağlı)</h3>
            <p>ChatGPT'de Proje ayarları → Talimatlar bölümüne bu metni ekleyebilirsin.</p>
            <button type="button" onClick={copyInstructions}><Copy size={15}/>{instructionsCopied ? 'Talimat kopyalandı' : 'Proje talimatını kopyala'}</button>
          </div>
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
