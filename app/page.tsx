import { getArticles } from '@/lib/articles';
import { NewsHome } from '@/components/NewsHome';

// A manual refresh must fetch the latest published news immediately.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await getArticles();
  return <NewsHome articles={articles} build={process.env.VERCEL_GIT_COMMIT_SHA ?? 'development'} />;
}
