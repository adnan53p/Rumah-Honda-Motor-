'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { heroSlides } from '@/data';
import { fetchBanners } from '@/lib/supabase';

interface SlideData {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  badge: string;
  image: string;
  accent: string;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<SlideData[]>(
    heroSlides.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      cta: s.cta,
      ctaLink: s.ctaLink,
      badge: s.badge,
      image: s.image,
      accent: s.accent,
    }))
  );
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Fetch banners from Supabase — override static data if available
  useEffect(() => {
    fetchBanners().then(({ data }) => {
      if (data && data.length > 0) {
        setSlides(
          data.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            description: b.description || '',
            cta: b.cta_text || 'Jelajahi Sekarang',
            ctaLink: b.cta_link || '#products',
            badge: b.badge || '',
            image: b.image,
            accent: b.accent_color || '#CC0000',
          }))
        );
      }
    });
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, isAutoplay]);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-honda-black">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient z-10" />
      <div
        className="absolute inset-0 z-10 opacity-30"
        style={{ background: `radial-gradient(ellipse at 80% 50%, ${slide.accent}22 0%, transparent 60%)` }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-10 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                {slide.badge && (
                  <>
                    <span className="w-6 h-px bg-honda-red" />
                    <span
                      className="text-xs font-mono tracking-[0.25em] uppercase px-3 py-1.5 border rounded-full"
                      style={{ color: slide.accent, borderColor: `${slide.accent}40`, background: `${slide.accent}10` }}
                    >
                      {slide.badge}
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-display font-bold text-6xl md:text-8xl lg:text-[7rem] text-white leading-none mb-3"
              >
                {slide.title}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl md:text-2xl font-display font-semibold mb-4"
                style={{ color: slide.accent }}
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={slide.ctaLink}
                  className="group flex items-center gap-3 bg-honda-red hover:bg-honda-red-dark text-white font-semibold px-7 py-4 rounded-lg transition-all duration-300 hover:shadow-red-glow hover:gap-4"
                >
                  {slide.cta}
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="#konsultasi"
                  className="flex items-center gap-2 border border-white/30 hover:border-white text-white/80 hover:text-white font-medium px-7 py-4 rounded-lg transition-all duration-300 backdrop-blur-sm"
                >
                  Konsultasi Gratis
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute z-20 inset-y-0 left-4 md:left-6 flex items-center">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-honda-red hover:bg-honda-red/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute z-20 inset-y-0 right-4 md:right-6 flex items-center">
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-honda-red hover:bg-honda-red/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute z-20 bottom-8 left-6 right-6 flex items-end justify-between">
        <div className="hidden md:flex items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrent(i); setIsAutoplay(false); }}
              className="group flex flex-col gap-1"
            >
              <div
                className="text-xs font-mono transition-colors"
                style={{ color: i === current ? slide.accent : 'rgba(255,255,255,0.3)' }}
              >
                0{i + 1}
              </div>
              <div
                className={`h-0.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-honda-red' : 'w-4 bg-white/20 group-hover:bg-white/40'}`}
              />
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="hidden md:flex flex-col items-center gap-2 text-white/40">
          <div className="text-xs font-mono tracking-widest rotate-90">SCROLL</div>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-bounce-subtle" />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="relative h-0.5 rounded-full overflow-hidden"
              style={{ width: i === current ? 28 : 8 }}
            >
              <div className="absolute inset-0 bg-white/20" />
              {i === current && (
                <motion.div
                  key={`prog-${current}`}
                  className="absolute inset-y-0 left-0 bg-honda-red rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
