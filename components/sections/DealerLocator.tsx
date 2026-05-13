'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { dealers } from '@/data';
import { staggerChildren, fadeUp } from '@/utils';
import SectionHeader from '@/components/ui/SectionHeader';

export default function DealerLocator() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="dealer" className="py-20 md:py-28 bg-honda-white-off">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Jaringan Dealer"
          title="Temukan Dealer Terdekat"
          subtitle="Lebih dari 1.200 dealer resmi Honda tersebar di seluruh Indonesia siap melayani Anda"
        />

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-honda-gray-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari dealer berdasarkan kota atau wilayah..."
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-honda-gray-light focus:border-honda-red outline-none rounded-xl text-honda-black placeholder-honda-gray-mid transition-all duration-300 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-honda-gray-mid hover:text-honda-red transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Dealer List */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-1"
          >
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-honda-gray-mid">
                <div className="text-4xl mb-3">🔍</div>
                <p>Dealer tidak ditemukan</p>
              </div>
            ) : (
              filtered.map((dealer) => (
                <motion.div
                  key={dealer.id}
                  variants={fadeUp}
                  onClick={() => setSelected(selected === dealer.id ? null : dealer.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selected === dealer.id
                      ? 'border-honda-red bg-honda-red/5 shadow-md'
                      : 'border-honda-gray-light bg-white hover:border-honda-red/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-base text-honda-black leading-tight">
                      {dealer.name}
                    </h4>
                    <div className="flex items-center gap-1 bg-honda-black text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                      <span className="text-yellow-400">★</span>
                      <span>{dealer.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-honda-gray-mid text-sm mb-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs leading-relaxed">{dealer.address}</span>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {dealer.services.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-honda-gray-light text-honda-gray-dark text-[10px] rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Expanded */}
                  {selected === dealer.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-honda-red/20"
                    >
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <svg className="w-4 h-4 text-honda-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${dealer.phone}`} className="text-honda-black hover:text-honda-red font-medium transition-colors">
                          {dealer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <svg className="w-4 h-4 text-honda-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-honda-gray-dark text-xs">{dealer.hours}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`https://maps.google.com?q=${dealer.lat},${dealer.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 bg-honda-red text-white text-xs font-bold rounded-lg hover:bg-honda-red-dark transition-colors"
                        >
                          Buka Maps
                        </a>
                        <a
                          href={`https://wa.me/62${dealer.phone.replace(/[^0-9]/g, '').slice(1)}`}
                          className="flex-1 text-center py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Map placeholder */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-honda-black min-h-[400px] lg:min-h-[560px]">
            {/* Fake map with styled background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(204,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(204,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-honda-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-honda-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="text-white font-display font-semibold text-lg mb-2">Peta Interaktif</p>
                <p className="text-white/50 text-sm mb-6 max-w-xs">
                  Pilih dealer dari daftar untuk melihat lokasi atau klik tombol untuk membuka Google Maps
                </p>
                <a
                  href="https://maps.google.com/maps?q=astra+honda+motor+jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-honda-red hover:bg-honda-red-dark text-white font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            </div>

            {/* Decorative dealer pins */}
            {dealers.slice(0, 5).map((d, i) => (
              <div
                key={d.id}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  selected === d.id ? 'bg-honda-red scale-125 z-10' : 'bg-white/20 hover:bg-honda-red/60'
                }`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${25 + (i % 2 === 0 ? 10 : 30)}%`,
                }}
                onClick={() => setSelected(d.id)}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
