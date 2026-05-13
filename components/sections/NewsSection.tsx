'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { newsArticles } from '@/data';
import { formatDate } from '@/utils';
import { staggerChildren, fadeUp, fadeRight } from '@/utils';
import SectionHeader from '@/components/ui/SectionHeader';

const categoryColors: Record<string, string> = {
  'Racing': 'bg-honda-red text-white',
  'Produk Baru': 'bg-blue-600 text-white',
  'Teknologi': 'bg-purple-600 text-white',
  'Program': 'bg-green-600 text-white',
  'Korporat': 'bg-orange-600 text-white',
};

export default function NewsSection() {
  const featured = newsArticles[0];
  const rest = newsArticles.slice(1);

  return (
    <section id="news" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Berita & Event"
          title="Terkini dari Honda"
          subtitle="Update terbaru seputar produk, racing, teknologi, dan program Honda Indonesia"
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Featured Article */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative rounded-2xl overflow-hidden card-shine shadow-card hover:shadow-card-hover bg-honda-black"
          >
            <div className="relative h-80">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[featured.category] || 'bg-gray-600 text-white'}`}>
                  {featured.category}
                </span>
                <span className="text-white/40 text-xs">{formatDate(featured.date)}</span>
                <span className="text-white/40 text-xs">· {featured.readTime} baca</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-honda-red transition-colors leading-snug">
                {featured.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{featured.excerpt}</p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-honda-red text-sm font-semibold hover:gap-3 transition-all"
              >
                Baca Selengkapnya
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Secondary Articles */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {rest.map((article) => (
              <motion.article
                key={article.id}
                variants={fadeUp}
                className="group flex gap-4 p-4 rounded-xl border border-honda-gray-light hover:border-honda-red/30 hover:bg-honda-white-off transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[article.category] || 'bg-gray-600 text-white'}`}>
                      {article.category}
                    </span>
                    <span className="text-honda-gray-mid text-[11px]">{formatDate(article.date)}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-honda-black group-hover:text-honda-red transition-colors leading-snug line-clamp-2 mb-1">
                    {article.title}
                  </h4>
                  <span className="text-honda-gray-mid text-xs">{article.readTime} baca</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* View All */}
        <div className="text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-3 border-2 border-honda-black hover:border-honda-red hover:text-honda-red text-honda-black font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 group"
          >
            Semua Berita
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
