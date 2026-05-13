import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createSeo, jsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

type PageProps = { params: { slug: string } };

async function getArticle(slug: string) {
  const { data } = await supabase.from('articles' as any).select('*').eq('slug', slug).maybeSingle();
  return data as any;
}

export async function generateMetadata({ params }: PageProps) {
  const article = await getArticle(params.slug);
  if (!article) return createSeo({ title: 'Artikel Honda', description: 'Artikel dan tips seputar motor Honda.', path: `/artikel/${params.slug}` });
  return createSeo({
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || 'Artikel seputar motor Honda, promo, dan kredit.',
    path: `/artikel/${article.slug}`,
    image: article.image,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug);
  if (!article) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, image: article.image, url: absoluteUrl(`/artikel/${article.slug}`) };
  return <main className="min-h-screen bg-white px-6 py-16"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} /><article className="prose prose-lg max-w-3xl mx-auto"><p className="text-[#CC0000] font-semibold">{article.category}</p><h1>{article.title}</h1>{article.image && <img src={article.image} alt={article.title} className="rounded-3xl" />}<p className="lead">{article.excerpt}</p><div className="whitespace-pre-wrap">{article.content}</div></article></main>;
}
