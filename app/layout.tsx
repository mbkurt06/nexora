import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PWARegister } from '@/components/PWARegister';
import { ThemeInitializer } from '@/components/ThemeInitializer';

export const metadata: Metadata = {
  title: { default: 'Nexora | Güncel Bilgiler', template: '%s | Nexora' },
  description: 'Teknoloji, bilim, dünya ve sosyal medya gündeminin kişisel dijital gazetesi.',
  applicationName: 'Nexora',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Nexora' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#151e30' };

const earlyThemeScript = `(function(){try{var t=localStorage.getItem("nexora:theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=t==="light"||t==="dark"?t:(d?"dark":"light");}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: earlyThemeScript }}/></head><body><ThemeInitializer /><PWARegister />{children}</body></html>;
}
