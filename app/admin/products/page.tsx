'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/database';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal, { FormField, inputClass, textareaClass, selectClass } from '@/components/admin/AdminModal';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyForm = {
  nama: '', slug: '', harga: 0, harga_display: '', deskripsi: '',
  kategori: 'matic' as Product['kategori'], gambar: '', warna: ['#CC0000'],
  badge: '', badge_color: '', gradient: 'from-gray-900 to-black',
  featured: false, active: true,
  spesifikasi: { engine: '', power: '', torque: '', weight: '' },
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditItem(p);
    setForm({
      nama: p.nama, slug: p.slug, harga: p.harga, harga_display: p.harga_display,
      deskripsi: p.deskripsi || '', kategori: p.kategori, gambar: p.gambar || '',
      warna: p.warna || ['#CC0000'], badge: p.badge || '', badge_color: p.badge_color || '',
      gradient: p.gradient || 'from-gray-900 to-black', featured: p.featured, active: p.active,
      spesifikasi: { engine: '', power: '', torque: '', weight: '', ...(p.spesifikasi as any) },
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || form.nama.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      harga: Number(form.harga),
      harga_display: form.harga_display || `Rp ${Number(form.harga).toLocaleString('id-ID')}`,
    };

    const { error } = editItem
      ? await (supabase as any).from('products').update(payload as any).eq('id', editItem.id)
      : await (supabase as any).from('products').insert(payload as any);

    setSaving(false);
    if (!error) {
      setModalOpen(false);
      setToast(editItem ? 'Kendaraan diperbarui!' : 'Kendaraan ditambahkan!');
      setTimeout(() => setToast(''), 3000);
      load();
    } else {
      setToast('Error: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    await (supabase as any).from('products').delete().eq('id', id);
    setDeleteId(null);
    setToast('Kendaraan dihapus');
    setTimeout(() => setToast(''), 3000);
    load();
  }

  const filtered = products.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'gambar',
      label: 'Foto',
      render: (v: string, row: Product) => (
        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {v ? <img src={v} alt={row.nama} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />}
        </div>
      ),
    },
    { key: 'nama', label: 'Nama', render: (v: string, row: Product) => (
      <div>
        <div className="font-semibold text-gray-900">{v}</div>
        <div className="text-gray-400 text-xs">{row.kategori}</div>
      </div>
    )},
    { key: 'harga_display', label: 'Harga' },
    { key: 'badge', label: 'Badge', render: (v: string) => v ? (
      <span className="px-2 py-0.5 bg-[#CC0000]/10 text-[#CC0000] text-xs rounded-full font-medium">{v}</span>
    ) : '—' },
    { key: 'featured', label: 'Featured', render: (v: boolean) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {v ? 'Ya' : 'Tidak'}
      </span>
    )},
    { key: 'active', label: 'Status', render: (v: boolean) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
        {v ? 'Aktif' : 'Nonaktif'}
      </span>
    )},
  ];

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kendaraan</h2>
          <p className="text-gray-500 text-sm">{products.length} total kendaraan</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#990000] text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kendaraan
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari kendaraan..."
          className="w-full max-w-xs pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#CC0000] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminTable
          columns={columns}
          data={filtered}
          loading={loading}
          onEdit={openEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyText="Belum ada kendaraan"
        />
      </div>

      {/* Delete confirm */}
      <AdminModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Kendaraan?" size="sm">
        <p className="text-gray-600 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus kendaraan ini?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
            Batal
          </button>
          <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
            Hapus
          </button>
        </div>
      </AdminModal>

      {/* Product Form Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? `Edit: ${editItem.nama}` : 'Tambah Kendaraan Baru'}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Nama Kendaraan" required>
            <input className={inputClass} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="CBR250RR" />
          </FormField>

          <FormField label="Slug URL">
            <input className={inputClass} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="cbr250rr (otomatis jika kosong)" />
          </FormField>

          <FormField label="Kategori" required>
            <select className={selectClass} value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value as Product['kategori'] }))}>
              <option value="matic">Matic</option>
              <option value="sport">Sport</option>
              <option value="cub">Bebek</option>
              <option value="adventure">Adventure</option>
            </select>
          </FormField>

          <FormField label="Harga (angka)" required>
            <input className={inputClass} type="number" value={form.harga} onChange={e => setForm(f => ({ ...f, harga: Number(e.target.value) }))} placeholder="78500000" />
          </FormField>

          <FormField label="Harga Display">
            <input className={inputClass} value={form.harga_display} onChange={e => setForm(f => ({ ...f, harga_display: e.target.value }))} placeholder="Rp 78.500.000" />
          </FormField>

          <FormField label="Badge">
            <input className={inputClass} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Terlaris / Baru / dll" />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Deskripsi">
              <textarea className={textareaClass} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi singkat kendaraan..." />
            </FormField>
          </div>

          {/* Specs */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-3">Spesifikasi</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['engine', 'power', 'torque', 'weight'] as const).map(k => (
                <FormField key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                  <input className={inputClass} value={(form.spesifikasi as any)[k] || ''} onChange={e => setForm(f => ({ ...f, spesifikasi: { ...f.spesifikasi, [k]: e.target.value } }))} placeholder={k === 'engine' ? '250cc' : k === 'weight' ? '168 kg' : ''} />
                </FormField>
              ))}
            </div>
          </div>

          {/* Gradient */}
          <FormField label="Gradient Card">
            <select className={selectClass} value={form.gradient} onChange={e => setForm(f => ({ ...f, gradient: e.target.value }))}>
              <option value="from-gray-900 to-black">Abu-abu Gelap</option>
              <option value="from-red-900 to-black">Merah Gelap</option>
              <option value="from-red-950 to-black">Merah Pekat</option>
              <option value="from-blue-900 to-black">Biru Gelap</option>
              <option value="from-zinc-900 to-black">Zinc Gelap</option>
              <option value="from-slate-900 to-black">Slate Gelap</option>
            </select>
          </FormField>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            {[{ key: 'featured', label: 'Featured' }, { key: 'active', label: 'Aktif' }].map(t => (
              <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${(form as any)[t.key] ? 'bg-[#CC0000]' : 'bg-gray-200'}`}
                  onClick={() => setForm(f => ({ ...f, [t.key]: !(f as any)[t.key] }))}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(form as any)[t.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-700">{t.label}</span>
              </label>
            ))}
          </div>

          {/* Image upload */}
          <div className="md:col-span-2">
            <ImageUpload
              bucket="products"
              value={form.gambar}
              onChange={url => setForm(f => ({ ...f, gambar: url }))}
              label="Gambar Utama"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving || !form.nama} className="flex-1 bg-[#CC0000] hover:bg-[#990000] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
            {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Kendaraan'}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
