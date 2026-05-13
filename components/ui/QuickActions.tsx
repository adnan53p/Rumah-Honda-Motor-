'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const actions = [
  {
    id: 'testrider',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    label: 'Test Ride',
    sub: 'Gratis',
    href: '#konsultasi',
    color: '#CC0000',
    bg: '#CC0000',
  },
  {
    id: 'dealer',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Dealer',
    sub: 'Terdekat',
    href: '#dealer',
    color: '#1A6ABA',
    bg: '#1A3A5C',
  },
  {
    id: 'service',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Booking',
    sub: 'Servis',
    href: '#dealer',
    color: '#16a34a',
    bg: '#14532d',
  },
  {
    id: 'katalog',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: 'Download',
    sub: 'Katalog',
    href: '#',
    color: '#C9A84C',
    bg: '#4a3a0a',
  },
];

export default function QuickActions() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-1 mb-1"
          >
            {actions.map((a, i) => (
              <motion.a
                key={a.id}
                href={a.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpanded(false)}
                className="group flex items-center gap-0 hover:gap-2 overflow-hidden rounded-r-xl transition-all duration-300"
                style={{ background: `${a.bg}dd` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-white"
                >
                  {a.icon}
                </div>
                <div className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 pr-0 group-hover:pr-3">
                  <div className="text-white text-xs font-bold whitespace-nowrap">{a.label}</div>
                  <div className="text-white/60 text-[10px] whitespace-nowrap">{a.sub}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle tab */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 bg-[#CC0000] hover:bg-[#990000] text-white text-[11px] font-bold px-2.5 py-2 rounded-r-xl transition-all shadow-lg group"
      >
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.span>
        <span className="[writing-mode:vertical-rl] rotate-180 tracking-widest text-[10px]">
          AKSI CEPAT
        </span>
      </button>
    </div>
  );
}
