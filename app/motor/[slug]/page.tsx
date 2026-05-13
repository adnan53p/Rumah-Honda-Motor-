import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createSeo, jsonLd } from '@/lib/seo';
import { absoluteUrl, whatsappUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

type PageProps = { params: { slug: string } };

async function getProduct(slug: string) {
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  return data as any;
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) return createSeo({ title: 'Produk Motor Honda', description: 'Detail produk motor Honda.', path: `/motor/${params.slug}` });
  return createSeo({
    title: `${product.nama} - Harga, Promo, dan Kredit`,
    description: product.deskripsi || `Lihat harga, spesifikasi, promo, dan simulasi kredit ${product.nama}.`,
    path: `/motor/${product.slug}`,
    image: product.gambar,
    keywords: [product.nama, `harga ${product.nama}`, `kredit ${product.nama}`],
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nama,
    description: product.deskripsi,
    image: product.gambar,
    url: absoluteUrl(`/motor/${product.slug}`),
    offers: { '@type': 'Offer', priceCurrency: 'IDR', price: product.harga || 0, availability: 'https://schema.org/InStock' },
  };
  return <main className="min-h-screen bg-white"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} /><section className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-2"><div>{product.gambar && <img src={product.gambar} alt={product.nama} className="w-full rounded-3xl object-cover shadow" />}</div><div><p className="text-[#CC0000] font-semibold uppercase tracking-widest">Detail Motor</p><h1 className="text-4xl md:text-6xl font-bold mt-3">{product.nama}</h1><p className="text-gray-600 mt-5">{product.deskripsi}</p><div className="mt-6 text-3xl font-bold text-[#CC0000]">{product.harga_display || `Rp ${Number(product.harga || 0).toLocaleString('id-ID')}`}</div>{product.promo && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-red-700 font-semibold">{product.promo}</div>}<a href={whatsappUrl(`Halo, saya tertarik dengan ${product.nama}. Mohon info harga dan kreditnya.`)} className="inline-block mt-8 rounded-xl bg-[#CC0000] px-6 py-4 font-semibold text-white">Tanya Produk via WhatsApp</a></div></section></main>;
}
