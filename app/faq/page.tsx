import { createSeo, jsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = createSeo({ title: 'FAQ Pembelian Motor Honda', description: 'Pertanyaan umum seputar promo, kredit, DP, angsuran, dan pembelian motor Honda.', path: '/faq' });
const faqs = [
  { question: 'Apakah bisa konsultasi kredit via WhatsApp?', answer: 'Bisa. Customer dapat konsultasi promo, DP, tenor, dan ketersediaan unit melalui WhatsApp.' },
  { question: 'Apakah harga bisa berubah?', answer: 'Harga dan promo dapat berubah mengikuti kebijakan dealer dan leasing.' },
];
export default function FaqPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })), url: absoluteUrl('/faq') };
  return <main className="min-h-screen bg-gray-50 px-6 py-16"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} /><section className="max-w-3xl mx-auto"><h1 className="text-4xl font-bold">FAQ Pembelian Motor Honda</h1><div className="mt-8 space-y-4">{faqs.map(f=><div key={f.question} className="bg-white rounded-2xl p-6 border"><h2 className="font-bold">{f.question}</h2><p className="text-gray-600 mt-2">{f.answer}</p></div>)}</div></section></main>;
}
