import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/promo-honda', '/kredit-motor-honda', '/simulasi-kredit', '/dealer-honda', '/faq'].map((path) => ({
    url: absoluteUrl(path || '/'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const { data: products } = await supabase.from('products').select('slug, created_at').eq('active', true);
  const { data: articles } = await supabase.from('articles' as any).select('slug, created_at').eq('active', true);

  const productRoutes = (products || []).map((item: any) => ({ url: absoluteUrl(`/motor/${item.slug}`), lastModified: new Date(item.created_at || Date.now()), changeFrequency: 'weekly' as const, priority: 0.9 }));
  const articleRoutes = (articles || []).map((item: any) => ({ url: absoluteUrl(`/artikel/${item.slug}`), lastModified: new Date(item.created_at || Date.now()), changeFrequency: 'monthly' as const, priority: 0.7 }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
