import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/articles';
import { ArticleView } from '@/components/ArticleView';

export const revalidate = 3600;

type Props = { params: Promise<{slug: string}> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return { title: article?.title ?? 'Haber bulunamadı', description: article?.summary };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
