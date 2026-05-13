'use client';
import { motion } from 'framer-motion';
import { fadeUp } from '@/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  center?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  dark = false,
  center = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={fadeUp}
      className={`mb-12 md:mb-16 ${center ? 'text-center' : ''}`}
    >
      {badge && (
        <div className={`inline-flex items-center gap-2 mb-4 ${center ? 'justify-center' : ''}`}>
          <span className="w-6 h-px bg-honda-red" />
          <span className={`text-xs font-mono tracking-[0.25em] uppercase font-bold ${dark ? 'text-honda-red' : 'text-honda-red'}`}>
            {badge}
          </span>
          <span className="w-6 h-px bg-honda-red" />
        </div>
      )}
      <h2 className={`font-display font-bold text-3xl md:text-5xl leading-tight mb-4 ${dark ? 'text-white' : 'text-honda-black'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${dark ? 'text-white/50' : 'text-honda-gray-mid'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
