'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerChildren, fadeUp } from '@/utils';
import SectionHeader from '@/components/ui/SectionHeader';

const promos = [
  {
    id: 1,
    title: 'DP Mulai Rp 2 Juta',
    subtitle: 'Honda BeAT Series',
    desc: 'Promo spesial akhir tahun. Angsuran ringan mulai Rp 700.000/bulan',
    badge: 'Terbatas',
    expires: '31 Des 2024',
    gradient: 'from-honda-red-dark to-honda-black',
    accent: '#CC0000',
  },
  {
    id: 2,
    title: 'Angsuran 0%',
    subtitle: 'Honda PCX 160',
    desc: 'Bunga 0% untuk tenor 12 bulan dengan uang muka minimum',
    badge: 'Eksklusif',
    expires: '28 Nov 2024',
    gradient: 'from-blue-900 to-honda-black',
    accent: '#1A6ABA',
  },
  {
    id: 3,
    title: 'Free Aksesori',
    subtitle: 'Honda CBR Series',
    desc: 'Dapatkan aksesori senilai Rp 3 juta gratis untuk setiap pembelian',
    badge: 'Promo Spesial',
    expires: '15 Des 2024',
    gradient: 'from-zinc-800 to-honda-black',
    accent: '#C9A84C',
  },
];

export default function PromoSection() {
  return (
    <section id="promo" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Promo & Penawaran"
          title="Penawaran Terbaik Untuk Anda"
          subtitle="Jangan lewatkan promo dan penawaran eksklusif Honda yang terbatas waktu"
        />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {promos.map((promo) => (
            <motion.div
              key={promo.id}
              variants={fadeUp}
              className={`group relative bg-gradient-to-br ${promo.gradient} rounded-2xl overflow-hidden p-6 cursor-pointer hover:scale-[1.02] transition-all duration-400 card-shine`}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-4 border"
                style={{ color: promo.accent, borderColor: `${promo.accent}40`, background: `${promo.accent}15` }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: promo.accent }} />
                {promo.badge}
              </div>

              <h3 className="font-display font-bold text-3xl text-white mb-1">{promo.title}</h3>
              <p className="font-display font-semibold text-lg mb-3" style={{ color: promo.accent }}>
                {promo.subtitle}
              </p>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">{promo.desc}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Berlaku s/d {promo.expires}
                </div>
                <Link
                  href="#"
                  className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  style={{ background: `${promo.accent}20`, color: promo.accent }}
                >
                  Klaim →
                </Link>
              </div>

              {/* Decorative circle */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: promo.accent }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
