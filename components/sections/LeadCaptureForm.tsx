'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { insertLead } from '@/lib/supabase';
import { fadeUp, staggerChildren } from '@/utils';

const cities = [
  'Jakarta','Surabaya','Bandung','Medan','Bekasi','Tangerang',
  'Depok','Semarang','Makassar','Palembang','Bogor','Yogyakarta','Lainnya',
];
const products = [
  'CBR250RR','PCX 160','ADV 160','BeAT Street','CB150R','Supra GTR 150','Lainnya',
];

export default function LeadCaptureForm() {
  const [form, setForm] = useState({ nama: '', whatsapp: '', kota: '', produk_minat: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.whatsapp || !form.kota) {
      setError('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: err } = await insertLead({
      nama: form.nama,
      whatsapp: form.whatsapp,
      kota: form.kota,
      produk_minat: form.produk_minat,
    });

    setLoading(false);
    if (err) {
      console.error('[Lead Form]', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } else {
      setSuccess(true);
      setForm({ nama: '', whatsapp: '', kota: '', produk_minat: '' });
    }
  }

  return (
    <section id="konsultasi" className="py-20 md:py-28 bg-honda-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 100%, #CC0000 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-honda-red" />
              <span className="text-honda-red text-xs font-mono tracking-[0.25em] uppercase font-bold">Konsultasi Gratis</span>
              <span className="w-6 h-px bg-honda-red" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
              Siap Memiliki<br />
              <span className="text-gradient-red">Motor Impian Anda?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
              Isi form konsultasi dan tim kami akan menghubungi Anda dalam 1×24 jam untuk memberikan penawaran terbaik.
            </motion.p>
            <motion.div variants={staggerChildren} className="space-y-4">
              {[
                'Konsultasi produk gratis tanpa biaya',
                'Simulasi kredit & DP fleksibel',
                'Test ride langsung di dealer terdekat',
                'Respon cepat dalam 1×24 jam',
              ].map((item) => (
                <motion.div key={item} variants={fadeUp} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-honda-red/20 flex items-center justify-center text-honda-red text-xs font-bold flex-shrink-0">✓</span>
                  <span className="text-white/60 text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-2">Terima Kasih!</h3>
                    <p className="text-white/60 text-sm mb-6">Data Anda sudah kami terima. Tim Honda akan menghubungi Anda segera.</p>
                    <button onClick={() => setSuccess(false)} className="text-honda-red text-sm font-medium hover:underline">
                      Kirim konsultasi lain →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-display font-bold text-xl text-white mb-5">Form Konsultasi</h3>
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
                    )}
                    {[
                      { key: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap Anda', required: true },
                      { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'tel', placeholder: 'Contoh: 08123456789', required: true },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                          {f.label} {f.required && <span className="text-honda-red">*</span>}
                        </label>
                        <input
                          type={f.type}
                          value={(form as any)[f.key]}
                          onChange={set(f.key as keyof typeof form)}
                          required={f.required}
                          placeholder={f.placeholder}
                          className="w-full bg-white/5 border border-white/10 focus:border-honda-red text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none transition-all text-sm"
                        />
                      </div>
                    ))}
                    {[
                      { key: 'kota', label: 'Kota', options: cities, required: true },
                      { key: 'produk_minat', label: 'Motor yang Diminati', options: products, required: false },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
                          {f.label} {f.required && <span className="text-honda-red">*</span>}
                        </label>
                        <select
                          value={(form as any)[f.key]}
                          onChange={set(f.key as keyof typeof form)}
                          required={f.required}
                          className="w-full bg-[#1A1A1A] border border-white/10 focus:border-honda-red text-white px-4 py-3 rounded-xl outline-none transition-all text-sm appearance-none"
                        >
                          <option value="">Pilih {f.label.toLowerCase()}</option>
                          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-honda-red hover:bg-honda-red-dark disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-red-glow flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Mengirim...</>
                      ) : <>Konsultasi Sekarang <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></>}
                    </button>
                    <p className="text-white/25 text-xs text-center">Data Anda aman dan tidak akan dibagikan ke pihak ketiga</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
