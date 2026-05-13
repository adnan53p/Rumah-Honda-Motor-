'use client';

const items = [
  'NEW: Honda CBR250RR SE 2024 — Limited Edition',
  'PROMO: DP Mulai Rp 2 Juta untuk All New PCX 160',
  'EVENT: Honda Racing Carnival — 23-24 November di JIEXPO Kemayoran',
  'PROMO: Angsuran 0% untuk Honda BeAT Series',
  'NEW: Honda ADV 160 Warna Baru — Matte Blue Gunpowder',
  'SERVICE: Cek Gratis Seluruh Indonesia Bulan November',
];

export default function TickerTape() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-honda-red-dark py-2.5 overflow-hidden relative">
      <div className="flex items-center whitespace-nowrap ticker-tape">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8 text-white text-xs font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
