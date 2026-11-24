import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexora — Güncel Bilgiler',
    short_name: 'Nexora',
    description: 'Teknoloji, bilim ve dünya gündemini keşfet.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f3ed',
    theme_color: '#151e30',
    lang: 'tr',
    icons: [{ src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
  };
}
