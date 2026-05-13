'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { fetchPromos } from '@/lib/supabase';

const staticPromos = [
  { id: 1, title: 'DP Mulai Rp 2 Juta', subtitle: 'Honda BeAT Series', description: 'Angsuran ringan mulai Rp 700.000/bulan. Proses cepat!', badge: '🔥 Terbatas', gradient: 'from-[#990000] via-[#CC0000] to-[#8B0000]', expires_at: '2024-12-31T23:59:59Z' },
  { id: 2, title: 'Angsuran 0%', subtitle: 'Honda PCX 160', description: 'Bunga 0% tenor 12 bulan. Bawa pulang hari ini.', badge: '⚡ Eksklusif', gradient: 'from-[#1A3A5C] via-[#1A6ABA] to-[#0A2A4C]', expires_at: '2024-11-28T23:59:59Z' },
  { id: 3, title: 'Cashback Rp 3 Juta', subtitle: 'Honda CBR Series', description: 'Bonus aksesori original Honda senilai Rp 3 juta.', badge: '🎁 Spesial', gradient: 'from-[#2D2D00] via-[#8B7A00] to-[#4A3A00]', expires_at: '2024-12-15T23:59:59Z' },
];

interface PromoItem { id: string | number; title: string; subtitle: string; description: string; badge?: string; gradient?: string; expires_at?: string; }

function countdown(dateStr?: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}h ${h}j ${m}m lagi`;
}

export default function PromoBannerSlider() {
  const [promos, setPromos] = useState<PromoItem[]>(staticPromos);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos().then(({ data }) => {
      if (data && data.length > 0) setPromos(data as PromoItem[]);
    });
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % promos.length), [promos.length]);
  const prev = () => setCurrent((p) => (p - 1 + promos.length) % promos.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(countdown(promos[current]?.expires_at)), 1000);
    return () => clearInterval(t);
  }, [current, promos]);

  const promo = promos[current];
  if (!promo) return null;

  return (
    <div className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }}
          className={`bg-gradient-to-r ${promo.gradient || 'from-[#CC0000] to-[#0A0A0A]'} py-5 px-6`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
            {promo.badge && <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 border border-white/20">{promo.badge}</span>}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                <span className="font-display font-bold text-2xl md:text-3xl text-white">{promo.title}</span>
                <span className="text-white/70 text-sm font-medium">— {promo.subtitle}</span>
              </div>
              <p className="text-white/70 text-sm mt-0.5">{promo.description}</p>
            </div>
            {timeLeft && (
              <div className="hidden lg:flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2 flex-shrink-0 border border-white/10">
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="text-white text-xs font-mono font-semibold">{timeLeft}</span>
              </div>
            )}
            <Link href="#konsultasi" className="flex-shrink-0 bg-white text-[#CC0000] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-sm">
              Klaim Sekarang →
            </Link>
            <div className="hidden md:flex gap-2 flex-shrink-0">
              <button onClick={prev} className="w-8 h-8 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={next} className="w-8 h-8 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {promos.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/30 w-1'}`} />
        ))}
      </div>
    </div>
  );
}
