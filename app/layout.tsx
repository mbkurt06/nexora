import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PWARegister } from '@/components/PWARegister';

export const metadata: Metadata = {
  title: { default: 'Nexora | Güncel Bilgiler', template: '%s | Nexora' },
  description: 'Teknoloji, bilim, dünya ve sosyal medya gündeminin kişisel dijital gazetesi.',
  applicationName: 'Nexora',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Nexora' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#151e30' };

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="tr"><body><PWARegister />{children}</body></html>;
}
