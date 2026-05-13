'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTestimonials } from '@/lib/supabase';
import SectionHeader from '@/components/ui/SectionHeader';

const staticTestimonials = [
  { id: 1, nama: 'Budi Santoso', komentar: 'PCX 160 saya sudah 2 tahun, mesin masih prima dan irit banget! Servis di AHASS juga ramah dan profesional.', rating: 5, produk: 'PCX 160', kota: 'Jakarta' },
  { id: 2, nama: 'Dewi Rahayu', komentar: 'CBR250RR adalah motor terbaik yang pernah saya miliki. Performa luar biasa, handling mantap, dan desain selalu bikin kagum!', rating: 5, produk: 'CBR250RR', kota: 'Bandung' },
  { id: 3, nama: 'Agus Firmansyah', komentar: 'ADV 160 cocok banget buat saya yang sering touring. Ground clearance tinggi, fitur lengkap, dan nyaman jarak jauh.', rating: 5, produk: 'ADV 160', kota: 'Surabaya' },
  { id: 4, nama: 'Siti Nurhaliza', komentar: 'Beli BeAT Street lewat promo DP ringan, prosesnya cepat dan mudah. Motor nyaman dan irit untuk harian.', rating: 4, produk: 'BeAT Street', kota: 'Depok' },
];

interface Testimonial { id: string | number; nama: string; komentar: string; rating: number; foto?: string; produk?: string; kota?: string; }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchTestimonials().then(({ data }) => {
      if (data && data.length > 0) setTestimonials(data as Testimonial[]);
    });
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % testimonials.length), [testimonials.length]);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  const visible = [0, 1, 2].map((i) => testimonials[(current + i) % testimonials.length]).filter(Boolean);

  return (
    <section id="testimoni" className="py-20 md:py-28 bg-honda-black relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-honda-red opacity-5 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader badge="Testimoni" title="Kata Mereka" subtitle="Ribuan pelanggan telah merasakan pengalaman berkendara Honda yang luar biasa" dark />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <motion.div key={`${t.id}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 ${i === 0 ? 'md:border-honda-red/30 md:bg-honda-red/5' : ''}`}>
                <StarRating rating={t.rating} />
                <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{t.komentar}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-honda-red/20">
                    {t.foto ? <img src={t.foto} alt={t.nama} className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-honda-red font-bold text-sm">
                        {t.nama.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.nama}</div>
                    <div className="text-white/40 text-xs">
                      {t.produk && <span className="text-honda-red">{t.produk}</span>}
                      {t.produk && t.kota && ' · '}{t.kota}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-honda-red hover:text-honda-red transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-honda-red w-6' : 'bg-white/20 w-1.5'}`} />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-honda-red hover:text-honda-red transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
