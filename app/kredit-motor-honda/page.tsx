import { createSeo, jsonLd } from '@/lib/seo';
import { absoluteUrl, whatsappUrl } from '@/lib/site';

export const metadata = createSeo({
  title: 'Kredit Motor Honda DP Ringan',
  description: 'Ajukan kredit motor Honda dengan DP fleksibel, tenor pilihan, dan konsultasi cepat via WhatsApp.',
  path: '/kredit-motor-honda',
  keywords: ['kredit motor Honda', 'DP motor Honda', 'angsuran Honda'],
});

export default function KreditMotorHondaPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'FinancialProduct', name: 'Kredit Motor Honda', url: absoluteUrl('/kredit-motor-honda') };
  return <main className="min-h-screen bg-white"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} /><section className="px-6 py-20 max-w-5xl mx-auto"><h1 className="text-4xl md:text-5xl font-bold">Kredit Motor Honda DP Ringan</h1><p className="mt-4 text-gray-600 max-w-2xl">Halaman landing untuk menangkap calon customer yang mencari kredit motor Honda. Hubungkan konten dengan admin promo, produk, dan leads.</p><a href={whatsappUrl('Halo, saya mau konsultasi kredit motor Honda.')} className="inline-block mt-8 rounded-xl bg-[#CC0000] px-6 py-4 font-semibold text-white">Konsultasi Kredit</a></section></main>;
}
