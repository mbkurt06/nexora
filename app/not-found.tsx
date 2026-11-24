import Link from 'next/link';

export default function NotFound() {
  return <main className="empty-page"><div className="brand">NEXORA<span className="brand-dot">.</span></div><h1>Haber bulunamadı</h1><p>Bu bağlantı kaldırılmış veya henüz yayımlanmamış olabilir.</p><Link className="primary-link" href="/">Gazeteye dön</Link></main>;
}
