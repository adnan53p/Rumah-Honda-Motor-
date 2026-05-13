'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Banner } from '@/types/database';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal, {
  FormField,
  inputClass,
  textareaClass,
} from '@/components/admin/AdminModal';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  cta_text: 'Jelajahi Sekarang',
  cta_link: '#products',
  badge: '',
  accent_color: '#CC0000',
  active: true,
  order_index: 0,
};

const accentOptions = [
  { label: 'Merah Honda', value: '#CC0000' },
  { label: 'Emas', value: '#C9A84C' },
  { label: 'Biru', value: '#1A6ABA' },
  { label: 'Putih', value: '#FFFFFF' },
];

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);

    const { data } = await (supabase as any)
      .from('banners')
      .select('*')
      .order('order_index');

    setBanners(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function openCreate() {
    setEditItem(null);
    setForm({
      ...emptyForm,
      order_index: banners.length + 1,
    });
    setModalOpen(true);
  }

  function openEdit(b: Banner) {
    setEditItem(b);

    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      description: b.description || '',
      image: b.image,
      cta_text: b.cta_text || 'Jelajahi Sekarang',
      cta_link: b.cta_link || '#products',
      badge: b.badge || '',
      accent_color: b.accent_color || '#CC0000',
      active: b.active,
      order_index: b.order_index,
    });

    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.image) {
      showToast('Judul dan gambar wajib diisi!');
      return;
    }

    setSaving(true);

    const payload = { ...form } as any;

    const { error } = editItem
      ? await (supabase as any)
          .from('banners')
          .update(payload)
          .eq('id', editItem.id)
      : await (supabase as any)
          .from('banners')
          .insert(payload);

    setSaving(false);

    if (!error) {
      setModalOpen(false);
      showToast(
        editItem
          ? '✓ Banner diperbarui!'
          : '✓ Banner ditambahkan!'
      );
      load();
    } else {
      showToast('Error: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    await (supabase as any)
      .from('banners')
      .delete()
      .eq('id', id);

    setDeleteId(null);
    showToast('Banner dihapus');
    load();
  }

  async function toggleActive(b: Banner) {
    await (supabase as any)
      .from('banners')
      .update({ active: !b.active } as any)
      .eq('id', b.id);

    showToast(
      b.active
        ? 'Banner dinonaktifkan'
        : 'Banner diaktifkan'
    );

    load();
  }

  async function moveOrder(
    b: Banner,
    dir: 'up' | 'down'
  ) {
    const newIndex =
      dir === 'up'
        ? b.order_index - 1
        : b.order_index + 1;

    await (supabase as any)
      .from('banners')
      .update({ order_index: newIndex } as any)
      .eq('id', b.id);

    load();
  }

  const columns = [
    {
      key: 'image',
      label: 'Gambar',
      render: (v: string, row: Banner) => (
        <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100">
          {v ? (
            <img
              src={v}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">
                No Image
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Judul Banner',
      render: (v: string, row: Banner) => (
        <div>
          <div className="font-semibold text-gray-900">{v}</div>
          {row.subtitle && (
            <div className="text-gray-400 text-xs mt-0.5">
              {row.subtitle}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'order_index',
      label: 'Urutan',
      render: (v: number, row: Banner) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => moveOrder(row, 'up')}
            className="w-7 h-7 rounded hover:bg-gray-100"
          >
            ↑
          </button>

          <span className="w-6 text-center text-sm">{v}</span>

          <button
            onClick={() => moveOrder(row, 'down')}
            className="w-7 h-7 rounded hover:bg-gray-100"
          >
            ↓
          </button>
        </div>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      render: (v: boolean, row: Banner) => (
        <button
          onClick={() => toggleActive(row)}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            v
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {v ? 'Aktif' : 'Nonaktif'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-black text-white px-4 py-3 rounded-xl z-50"
        >
          {toast}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Banner Hero
          </h2>

          <p className="text-sm text-gray-500">
            {banners.length} banner
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#CC0000] hover:bg-[#990000] text-white px-5 py-2.5 rounded-xl font-semibold"
        >
          Tambah Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <AdminTable
          columns={columns}
          data={banners}
          loading={loading}
          onEdit={openEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyText="Belum ada banner"
        />
      </div>

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Banner?"
        size="sm"
      >
        <p className="text-gray-600 text-sm mb-6">
          Banner ini akan dihapus permanen. Yakin?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 border border-gray-200 py-2.5 rounded-xl"
          >
            Batal
          </button>

          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl"
          >
            Hapus
          </button>
        </div>
      </AdminModal>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Banner' : 'Tambah Banner'}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <ImageUpload
              bucket="banners"
              value={form.image}
              onChange={(url) =>
                setForm((f) => ({
                  ...f,
                  image: url,
                }))
              }
              label="Gambar Banner"
            />
          </div>

          {form.image && (
            <div className="md:col-span-2">
              <div className="relative h-40 rounded-xl overflow-hidden bg-black">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover opacity-70"
                />

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="font-bold text-xl text-white">
                    {form.title || 'Judul Banner'}
                  </div>

                  {form.subtitle && (
                    <div
                      className="text-sm font-semibold"
                      style={{ color: form.accent_color }}
                    >
                      {form.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <FormField label="Judul" required>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="Subtitle">
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  subtitle: e.target.value,
                }))
              }
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Deskripsi">
              <textarea
                className={textareaClass}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          <FormField label="Badge">
            <input
              className={inputClass}
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  badge: e.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="CTA Text">
            <input
              className={inputClass}
              value={form.cta_text}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  cta_text: e.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="CTA Link">
            <input
              className={inputClass}
              value={form.cta_link}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  cta_link: e.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="Urutan">
            <input
              type="number"
              className={inputClass}
              value={form.order_index}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  order_index: Number(e.target.value),
                }))
              }
            />
          </FormField>

          <div className="md:col-span-2">
            <div className="flex gap-2 flex-wrap">
              {accentOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      accent_color: opt.value,
                    }))
                  }
                  className={`px-3 py-2 rounded-xl border text-sm ${
                    form.accent_color === opt.value
                      ? 'border-[#CC0000] text-[#CC0000]'
                      : 'border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    active: e.target.checked,
                  }))
                }
              />

              <span className="text-sm text-gray-700">
                Banner aktif tampil di website
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setModalOpen(false)}
            className="flex-1 border border-gray-200 py-3 rounded-xl"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#CC0000] hover:bg-[#990000] text-white py-3 rounded-xl font-semibold"
          >
            {saving
              ? 'Menyimpan...'
              : editItem
              ? 'Simpan'
              : 'Tambah Banner'}
          </button>
        </div>
      </AdminModal>
     </div>
  );
}
