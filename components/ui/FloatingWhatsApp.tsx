'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';

const options = [
  { label: '🏍️  Info Motor Terbaru', msg: 'Halo Honda! Saya ingin informasi tentang motor terbaru.' },
  { label: '🎁  Promo & DP Ringan', msg: 'Halo Honda! Saya ingin tahu promo dan cicilan terbaru.' },
  { label: '📍  Cari Dealer Terdekat', msg: 'Halo Honda! Bisa bantu temukan dealer terdekat di kota saya?' },
  { label: '🔧  Booking Servis', msg: 'Halo Honda! Saya ingin booking servis motor di AHASS.' },
  { label: '🏁  Test Ride Gratis', msg: 'Halo Honda! Saya ingin booking test ride gratis.' },
];

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    const t2 = setTimeout(() => setShowBubble(false), 9000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-white rounded-2xl rounded-br-sm shadow-xl px-4 py-3 max-w-[200px] border border-gray-100"
          >
            <p className="text-gray-800 text-sm font-medium">Ada yang bisa kami bantu? 👋</p>
            <p className="text-gray-500 text-xs mt-0.5">Chat kami sekarang!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-green-600 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">H</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-300 border-2 border-green-600 rounded-full" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Honda Indonesia</div>
                  <div className="text-green-200 text-xs">● Online — Balas cepat</div>
                </div>
              </div>
            </div>
            <div className="px-4 pt-4 pb-2">
              <div className="bg-gray-100 rounded-xl rounded-tl-sm px-3 py-2.5 text-sm text-gray-700 leading-relaxed">
                Halo! 👋 Ada yang bisa kami bantu hari ini?
              </div>
            </div>
            <div className="px-3 pb-4 space-y-1.5">
              {options.map((opt) => (
                <a
                  key={opt.label}
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(opt.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-700 text-sm rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-green-100"
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
            <span className="absolute -inset-1.5 rounded-full bg-green-500 opacity-10 animate-pulse" />
          </>
        )}
        <motion.button
          onClick={() => { setOpen(!open); setShowBubble(false); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-900/30 transition-colors"
          aria-label="Chat WhatsApp"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.span>
            ) : (
              <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
