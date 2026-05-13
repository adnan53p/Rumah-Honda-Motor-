'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Promo } from '@/types/database';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal, { FormField, inputClass, textareaClass, selectClass } from '@/components/admin/AdminModal';

const empty = {
  title: '', subtitle: '', description: '', badge: '',
  badge_color: 'red', gradient: 'from-honda-red-dark to-honda-black',
  expires_at: '', active: true, order_index: 0,
};

export default function AdminPromo() {
  const [items, setItems] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Promo | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('promo').select('*').order('order_index');
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditItem(null); setForm(empty); setModalOpen(true); }
  function openEdit(p: Promo) {
    setEditItem(p);
    setForm({
      title: p.title, subtitle: p.subtitle || '', description: p.description || '',
      badge: p.badge || '', badge_color: p.badge_color || 'red',
      gradient: p.gradient || 'from-honda-red-dark to-honda-black',
      expires_at: p.expires_at?.split('T')[0] || '',
      active: p.active, order_index: p.order_index,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null };
    const { error } = editItem
      ? await (supabase as any).from('promo').update(payload as any).eq('id', editItem.id)
      : await (supabase as any).from('promo').insert(payload as any);
    setSaving(false);
    if (!error) {
      setModalOpen(false);
      setToast(editItem ? 'Promo diperbarui!' : 'Promo ditambahkan!');
      setTimeout(() => setToast(''), 3000);
      load();
    }
  }

  async function handleDelete(id: string) {
    await (supabase as any).from('promo').delete().eq('id', id);
    setDeleteId(null);
    setToast('Promo dihapus');
    setTimeout(() => setToast(''), 3000);
    load();
  }

  const columns = [
    { key: 'order_index', label: '#', className: 'w-12' },
    { key: 'title', label: 'Judul', render: (v: string, row: Promo) => (
      <div>
        <div className="font-semibold text-gray-900">{v}</div>
        <div className="text-gray-400 text-xs">{row.subtitle}</div>
      </div>
    )},
    { key: 'badge', label: 'Badge', render: (v: string) => v ? (
      <span className="px-2 py-0.5 bg-[#CC0000]/10 text-[#CC0000] text-xs rounded-full font-medium">{v}</span>
    ) : '—' },
    { key: 'expires_at', label: 'Expired', render: (v: string) => v ? new Date(v).toLocaleDateString('id-ID') : '—' },
    { key: 'active', label: 'Status', render: (v: boolean) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{v ? 'Aktif' : 'Nonaktif'}</span>
    )},
  ];

  return (
    <div className="space-y-5">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">{toast}</motion.div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Promo</h2>
          <p className="text-gray-500 text-sm">{items.length} promo terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#990000] text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Promo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={r => setDeleteId(r.id)} emptyText="Belum ada promo" />
      </div>

      <AdminModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Promo?" size="sm">
        <p className="text-gray-600 text-sm mb-6">Yakin ingin menghapus promo ini?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium">Batal</button>
          <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold">Hapus</button>
        </div>
      </AdminModal>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Promo' : 'Tambah Promo'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Judul" required>
            <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="DP Mulai Rp 2 Juta" />
          </FormField>
          <FormField label="Subtitle">
            <input className={inputClass} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Honda BeAT Series" />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Deskripsi">
              <textarea className={textareaClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi promo..." />
            </FormField>
          </div>
          <FormField label="Badge">
            <input className={inputClass} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Terbatas" />
          </FormField>
          <FormField label="Berlaku Sampai">
            <input className={inputClass} type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
          </FormField>
          <FormField label="Urutan">
            <input className={inputClass} type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))} />
          </FormField>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? 'bg-[#CC0000]' : 'bg-gray-200'}`} onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-700">Aktif</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium">Batal</button>
          <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 bg-[#CC0000] hover:bg-[#990000] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold">
            {saving ? 'Menyimpan...' : editItem ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
