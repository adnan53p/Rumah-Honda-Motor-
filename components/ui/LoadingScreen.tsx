'use client';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-honda-black flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="w-16 h-16 bg-honda-red rounded-full flex items-center justify-center font-display font-bold text-3xl text-white">
          H
        </div>
        <div>
          <div className="font-display font-bold text-3xl text-white leading-none">HONDA</div>
          <div className="text-[11px] text-honda-gray-mid tracking-[0.3em]">INDONESIA</div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full bg-honda-red rounded-full"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.3 }}
        className="text-white text-xs font-mono tracking-widest mt-4"
      >
        MEMUAT...
      </motion.p>
    </motion.div>
  );
}
