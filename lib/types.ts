export type Category = 'technology' | 'science' | 'economy' | 'world' | 'books' | 'health' | 'social' | 'culture' | 'education' | 'environment';
export type Importance = 'critical' | 'high' | 'normal';

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  category: Category;
  subcategory: string;
  publishedAt: string | null;
  issueDate?: string | null;
  updatedAt?: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  importance: Importance;
  readTime: number;
  coverTone: string;
  isDemo: boolean;
}

export const CATEGORIES: {id: Category; name: string; icon: string; description: string}[] = [
  { id: 'technology', name: 'Teknoloji', icon: '💻', description: 'Yapay zekâ, cihazlar, yazılım ve güvenlik' },
  { id: 'science', name: 'Bilim', icon: '🔭', description: 'Uzay, fizik, keşifler ve araştırmalar' },
  { id: 'economy', name: 'Ekonomi', icon: '📈', description: 'Faiz, enflasyon, şirketler ve piyasalar' },
  { id: 'world', name: 'Dünya', icon: '🌍', description: 'Ülkeler, kurumlar ve önemli kararlar' },
  { id: 'books', name: 'Kitap & Edebiyat', icon: '📚', description: 'Yeni kitaplar, ödüller ve edebiyat gündemi' },
  { id: 'health', name: 'Sağlık', icon: '🧬', description: 'Tıp araştırmaları, klinik çalışmalar' },
  { id: 'social', name: 'Dijital Yaşam', icon: '💬', description: 'Sosyal medya, X, platform kararları' },
  { id: 'culture', name: 'Kültür & Sanat', icon: '🎨', description: 'Kültürel miras, sanat ve müzeler' },
  { id: 'education', name: 'Eğitim', icon: '🎓', description: 'Eğitim politikaları, araştırmalar ve öğrenme' },
  { id: 'environment', name: 'Çevre & İklim', icon: '🌱', description: 'İklim anlaşmaları ve doğa gündemi' },
];

export const CATEGORY_LABELS: Record<Category,string> = Object.fromEntries(CATEGORIES.map(c => [c.id,c.name])) as Record<Category,string>;
