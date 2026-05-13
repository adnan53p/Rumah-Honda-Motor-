'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { motorcycles, motorcycleCategories } from '@/data';
import { staggerChildren, scaleIn } from '@/utils';
import SectionHeader from '@/components/ui/SectionHeader';
import { fetchProducts } from '@/lib/supabase';

const badgeColors: Record<string, string> = {
  red: 'bg-honda-red text-white',
  gold: 'bg-honda-gold text-black',
  blue: 'bg-blue-600 text-white',
};

interface DisplayProduct {
  id: string | number;
  name: string;
  category: string;
  tagline: string;
  price: string;
  badge: string;
  badgeColor: string;
  colors: string[];
  specs: Record<string, string>;
  image: string;
  gradient: string;
}

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbProducts, setDbProducts] = useState<DisplayProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbProducts(
            data.map((p) => ({
              id: p.id,
              name: p.nama,
              category: p.kategori,
              tagline: p.deskripsi?.split('.')[0] || p.nama,
              price: p.harga_display,
              badge: p.badge || '',
              badgeColor: p.badge_color || '',
              colors: Array.isArray(p.warna) ? p.warna : ['#CC0000'],
              specs: (p.spesifikasi as Record<string, string>) || {},
              image: p.gambar || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
              gradient: p.gradient || 'from-gray-900 to-black',
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const allProducts: DisplayProduct[] = dbProducts ?? motorcycles.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    tagline: m.tagline,
    price: m.price,
    badge: m.badge,
    badgeColor: m.badgeColor,
    colors: m.colors,
    specs: m.specs as Record<string, string>,
    image: m.image,
    gradient: m.gradient,
  }));

  const filtered =
    activeCategory === 'all' ? allProducts : allProducts.filter((m) => m.category === activeCategory);

  return (
    <section id="products" className="py-20 md:py-28 bg-honda-white-off">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Lineup Terbaru"
          title="Temukan Motor Impian Anda"
          subtitle="Jelajahi seluruh model Honda yang dirancang untuk memenuhi setiap kebutuhan berkendara Anda"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {motorcycleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-honda-red text-white shadow-red-glow'
                  : 'bg-white text-honda-black border border-honda-gray-light hover:border-honda-red hover:text-honda-red'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-honda-gray-light animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((moto) => (
                <motion.div
                  key={moto.id}
                  variants={scaleIn}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="product-card card-shine bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover group border border-honda-gray-light hover:border-honda-red/20"
                >
                  <div className={`relative h-52 bg-gradient-to-br ${moto.gradient} overflow-hidden`}>
                    <Image
                      src={moto.image}
                      alt={moto.name}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {moto.badge && (
                      <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${badgeColors[moto.badgeColor] || 'bg-white/20 text-white'}`}>
                        {moto.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {moto.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border-2 border-white/40 shadow-sm hover:scale-125 transition-transform" style={{ background: c }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-display font-bold text-xl text-honda-black">{moto.name}</h3>
                      <span className="text-xs text-honda-gray-mid font-mono uppercase tracking-wider">{moto.category}</span>
                    </div>
                    <p className="text-honda-gray-mid text-sm mb-4 line-clamp-1">{moto.tagline}</p>

                    {Object.keys(moto.specs).length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-5 p-3 bg-honda-white-off rounded-xl">
                        {Object.entries(moto.specs).filter(([, v]) => v).slice(0, 4).map(([k, v]) => (
                          <div key={k} className="text-center">
                            <div className="font-display font-bold text-sm text-honda-black">{v}</div>
                            <div className="text-honda-gray-mid text-[10px] capitalize tracking-wide">{k}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-honda-gray-mid">Mulai dari</div>
                        <div className="font-display font-bold text-lg text-honda-red">{moto.price}</div>
                      </div>
                      <Link href="#" className="flex items-center gap-2 bg-honda-black hover:bg-honda-red text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 group/btn">
                        Detail
                        <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link href="#" className="inline-flex items-center gap-3 border-2 border-honda-black hover:border-honda-red hover:text-honda-red text-honda-black font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 group">
            Lihat Semua Model
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
