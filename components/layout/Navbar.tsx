'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavScroll } from '@/hooks';
import { cn } from '@/utils';

const navItems = [
  { label: 'Sepeda Motor', href: '#products', hasDropdown: true,
    children: ['CBR Series', 'PCX Series', 'ADV Series', 'BeAT Series', 'Supra Series'] },
  { label: 'Promo', href: '#promo' },
  { label: 'Dealer', href: '#dealer' },
  { label: 'Berita', href: '#news' },
  { label: 'Layanan', href: '#services', hasDropdown: true,
    children: ['AHASS', 'Honda Care', 'Suku Cadang', 'Garansi'] },
  { label: 'Tentang', href: '#about' },
];

export default function Navbar() {
  const { scrolled, scrollDir } = useNavScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (scrolled && scrollDir === 'down' && !mobileOpen) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [scrollDir, scrolled, mobileOpen]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-honda-red text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span>📞 0812-9767-279</span>
            <span>✉ rumahhondamotor@gmail.com</span>
          </div>
          <div className="flex gap-4 items-center">
            <span>Senin - Jumat: 08.00 - 17.00 WIB</span>
            <div className="flex gap-2">
              {['ID', 'EN'].map(lang => (
                <button key={lang} className="hover:text-honda-gray-light transition-colors">
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-dark shadow-nav md:top-0'
            : 'bg-transparent md:top-8'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-44 h-14 md:w-56 md:h-16">
                <Image
                  src="/logo-rumah-honda-motor.png"
                  alt="Rumah Honda Motor"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all rounded-lg group',
                      scrolled ? 'text-white hover:text-honda-red' : 'text-white/90 hover:text-white'
                    )}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-honda-red scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-44 backdrop-dark rounded-xl overflow-hidden border border-white/10 shadow-xl"
                      >
                        {item.children?.map((child) => (
                          <Link
                            key={child}
                            href="#"
                            className="block px-4 py-2.5 text-sm text-white/80 hover:text-honda-red hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                          >
                            {child}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="#dealer"
                className="hidden lg:flex items-center gap-2 bg-honda-red hover:bg-honda-red-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-red-glow"
              >
                Test Ride
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
                aria-label="Toggle menu"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'block h-0.5 bg-white transition-all duration-300 rounded-full',
                      i === 0 && 'w-6',
                      i === 1 && 'w-4',
                      i === 2 && 'w-6',
                      mobileOpen && i === 0 && 'rotate-45 translate-y-2 w-6',
                      mobileOpen && i === 1 && 'opacity-0 w-0',
                      mobileOpen && i === 2 && '-rotate-45 -translate-y-2 w-6',
                    )}
                  />
                ))}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden backdrop-dark border-t border-white/10 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-white/90 hover:text-honda-red hover:bg-white/5 rounded-lg transition-all"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.hasDropdown && (
                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 mt-2 border-t border-white/10">
                  <Link
                    href="#dealer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 bg-honda-red text-white font-semibold py-3 rounded-lg"
                  >
                    Booking Test Ride
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
