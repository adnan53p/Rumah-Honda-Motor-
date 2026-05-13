'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <section className="relative py-20 overflow-hidden bg-honda-black">
      {/* Bg decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #CC0000 0%, transparent 60%)'
          }}
        />
      </div>

      {/* Diagonal stripes */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-honda-red" />
            <span className="text-honda-red text-xs font-mono tracking-[0.3em] uppercase">Booking Sekarang</span>
            <span className="w-8 h-px bg-honda-red" />
          </div>

          <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Rasakan Pengalaman<br />
            <span className="text-gradient-red">Berkendara Honda</span>
          </h2>

          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftarkan diri Anda untuk test ride gratis di dealer terdekat. 
            Dapatkan konsultasi langsung dengan tenaga ahli kami.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#dealer"
              className="group inline-flex items-center justify-center gap-3 bg-honda-red hover:bg-honda-red-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-red-glow-lg text-base"
            >
              Booking Test Ride
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-3 border-2 border-white/20 hover:border-honda-red text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Simulasi Kredit
            </Link>
          </div>

          {/* Benefits strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 pt-10 border-t border-white/10">
            {['✓ Test Ride Gratis', '✓ Konsultasi Langsung', '✓ DP Fleksibel', '✓ Proses Cepat'].map((b) => (
              <span key={b} className="text-white/50 text-sm font-medium">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
