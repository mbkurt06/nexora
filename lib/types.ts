export type Category = 'technology' | 'science' | 'world' | 'social';
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
  sourceName: string | null;
  sourceUrl: string | null;
  importance: Importance;
  readTime: number;
  coverTone: string;
  isDemo: boolean;
}

export const CATEGORIES: {id: Category; name: string; icon: string; description: string}[] = [
  { id: 'technology', name: 'Teknoloji', icon: '💻', description: 'Yeni ürünler, yapay zekâ, yazılım ve güvenlik' },
  { id: 'science', name: 'Bilim', icon: '🔬', description: 'Uzay, fizik, matematik, biyoloji ve araştırmalar' },
  { id: 'world', name: 'Dünya', icon: '🌍', description: 'Önemli kararlar ve küresel gelişmeler' },
  { id: 'social', name: 'Sosyal gündem', icon: '💬', description: 'X ve diğer platformlardaki önemli tartışmalar' },
];

export const CATEGORY_LABELS: Record<Category,string> = Object.fromEntries(CATEGORIES.map(c => [c.id,c.name])) as Record<Category,string>;
