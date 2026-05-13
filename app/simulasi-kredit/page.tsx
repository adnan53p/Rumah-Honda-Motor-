'use client';
import { useMemo, useState } from 'react';
import { whatsappUrl } from '@/lib/site';

export default function SimulasiKreditPage() {
  const [harga, setHarga] = useState(25000000);
  const [dp, setDp] = useState(3000000);
  const [tenor, setTenor] = useState(35);
  const cicilan = useMemo(() => Math.max(0, Math.round((harga - dp) / tenor)), [harga, dp, tenor]);
  return <main className="min-h-screen bg-gray-50 px-6 py-16"><section className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm"><h1 className="text-3xl md:text-5xl font-bold">Simulasi Kredit Motor Honda</h1><p className="text-gray-600 mt-3">Hitungan kasar untuk bahan konsultasi awal. Angka final mengikuti leasing/dealer.</p><div className="grid gap-4 mt-8"><label>Harga Motor<input type="number" value={harga} onChange={e=>setHarga(Number(e.target.value))} className="w-full mt-2 border rounded-xl p-3" /></label><label>DP<input type="number" value={dp} onChange={e=>setDp(Number(e.target.value))} className="w-full mt-2 border rounded-xl p-3" /></label><label>Tenor Bulan<input type="number" value={tenor} onChange={e=>setTenor(Number(e.target.value))} className="w-full mt-2 border rounded-xl p-3" /></label></div><div className="mt-8 rounded-2xl bg-[#0A0A0A] text-white p-6"><p>Estimasi cicilan/bulan</p><strong className="text-3xl">Rp {cicilan.toLocaleString('id-ID')}</strong></div><a href={whatsappUrl(`Halo, saya mau cek simulasi kredit. Harga ${harga}, DP ${dp}, tenor ${tenor} bulan.`)} className="inline-block mt-6 rounded-xl bg-[#CC0000] px-6 py-4 text-white font-semibold">Kirim ke WhatsApp</a></section></main>;
}
