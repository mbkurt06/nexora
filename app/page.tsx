import { getArticles } from '@/lib/articles';
import { NewsHome } from '@/components/NewsHome';

export const revalidate = 3600;

export default async function Home() {
  const articles = await getArticles();
  return <NewsHome articles={articles} />;
}
