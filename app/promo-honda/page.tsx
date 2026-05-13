import Link from 'next/link';
import { createSeo, jsonLd } from '@/lib/seo';
import { siteConfig, absoluteUrl, whatsappUrl } from '@/lib/site';

export const metadata = createSeo({
  title: 'Promo Motor Honda Terbaru',
  description: 'Lihat promo motor Honda terbaru, paket kredit ringan, DP fleksibel, dan konsultasi pembelian via WhatsApp.',
  path: '/promo-honda',
  keywords: ['promo Honda terbaru', 'promo motor Honda bulan ini'],
});

export default function PromoHondaPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Promo Motor Honda',
    url: absoluteUrl('/promo-honda'),
  };
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <section className="bg-[#0A0A0A] text-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#CC0000] font-semibold uppercase tracking-widest">Promo Honda</p>
          <h1 className="text-4xl md:text-6xl font-bold mt-4">Promo Motor Honda Terbaru</h1>
          <p className="text-white/70 mt-5 max-w-2xl">Dapatkan informasi promo, paket kredit, dan konsultasi pembelian motor Honda sesuai kebutuhan Anda.</p>
          <a href={whatsappUrl('Halo, saya mau tanya promo motor Honda terbaru.')} className="inline-block mt-8 rounded-xl bg-[#CC0000] px-6 py-4 font-semibold">Tanya Promo via WhatsApp</a>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-14 grid gap-6 md:grid-cols-3">
        {['DP Fleksibel', 'Angsuran Ringan', 'Proses Cepat'].map((item) => <div key={item} className="rounded-2xl border p-6 shadow-sm"><h2 className="font-bold text-xl">{item}</h2><p className="text-gray-600 mt-2">Konten promo ini bisa dibuat dinamis dari admin pada tahap integrasi CMS lanjutan.</p></div>)}
      </section>
      <div className="max-w-5xl mx-auto px-6 pb-16"><Link href="/" className="text-[#CC0000] font-semibold">← Kembali ke beranda</Link></div>
    </main>
  );
}
