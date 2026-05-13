import { createSeo, jsonLd } from '@/lib/seo';
import { absoluteUrl, siteConfig, whatsappUrl } from '@/lib/site';

export const metadata = createSeo({ title: 'Dealer Honda dan Area Layanan', description: 'Informasi dealer, alamat, jam operasional, area layanan, dan kontak WhatsApp.', path: '/dealer-honda' });

export default function DealerHondaPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: siteConfig.name, address: siteConfig.address, telephone: siteConfig.phone, areaServed: siteConfig.areaServed, url: absoluteUrl('/dealer-honda') };
  return <main className="min-h-screen bg-white px-6 py-16"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} /><section className="max-w-5xl mx-auto"><h1 className="text-4xl md:text-5xl font-bold">Dealer Honda & Area Layanan</h1><p className="text-gray-600 mt-4">Kelola alamat, cabang, maps, dan kontak dari admin halaman Dealer.</p><div className="mt-8 rounded-2xl border p-6"><h2 className="font-bold text-xl">{siteConfig.name}</h2><p className="text-gray-600 mt-2">{siteConfig.address}</p><p className="text-gray-600">Area: {siteConfig.areaServed.join(', ')}</p><a href={whatsappUrl('Halo, saya mau tanya lokasi dealer Honda.')} className="inline-block mt-5 rounded-xl bg-[#CC0000] px-5 py-3 text-white font-semibold">Chat WhatsApp</a></div></section></main>;
}
