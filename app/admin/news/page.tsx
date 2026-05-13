'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { NewsArticle } from '@/types/database';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal, {
  FormField,
  inputClass,
  textareaClass,
  selectClass,
} from '@/components/admin/AdminModal';
import ImageUpload from '@/components/admin/ImageUpload';

const empty = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Umum',
  image: '',
  read_time: '3 menit',
  featured: false,
  active: true,
  published_at: new Date().toISOString().split('T')[0],
};

const categories = [
  'Racing',
  'Produk Baru',
  'Teknologi',
  'Program',
  'Korporat',
  'Komunitas',
  'Umum',
];

export default function AdminNews() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] =
    useState<NewsArticle | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  async function load() {
    setLoading(true);

    const { data } = await (supabase as any)
      .from('news')
      .select('*')
      .order('published_at', {
        ascending: false,
      });

    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditItem(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(p: NewsArticle) {
    setEditItem(p);

    setForm({
      title: p.title,
      excerpt: p.excerpt || '',
      content: p.content || '',
      category: p.category || 'Umum',
      image: p.image || '',
      read_time: p.read_time || '3 menit',
      featured: p.featured,
      active: p.active,
      published_at:
        p.published_at?.split('T')[0] ||
        new Date().toISOString().split('T')[0],
    });

    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);

    const payload = {
      ...form,
      published_at: new Date(
        form.published_at
      ).toISOString(),
    } as any;

    const { error } = editItem
      ? await (supabase as any)
          .from('news')
          .update(payload)
          .eq('id', editItem.id)
      : await (supabase as any)
          .from('news')
          .insert(payload);

    setSaving(false);

    if (!error) {
      setModalOpen(false);

      setToast(
        editItem
          ? 'Berita diperbarui!'
          : 'Berita ditambahkan!'
      );

      setTimeout(() => setToast(''), 3000);

      load();
    } else {
      setToast('Error: ' + error.message);
      setTimeout(() => setToast(''), 3000);
    }
  }

  async function handleDelete(id: string) {
    await (supabase as any)
      .from('news')
      .delete()
      .eq('id', id);

    setDeleteId(null);

    setToast('Berita dihapus');

    setTimeout(() => setToast(''), 3000);

    load();
  }

  const catColors: Record<string, string> = {
    Racing: 'bg-red-100 text-red-700',
    'Produk Baru': 'bg-blue-100 text-blue-700',
    Teknologi: 'bg-purple-100 text-purple-700',
    Program: 'bg-green-100 text-green-700',
    Korporat: 'bg-orange-100 text-orange-700',
    Komunitas: 'bg-teal-100 text-teal-700',
    Umum: 'bg-gray-100 text-gray-600',
  };

  const columns = [
    {
      key: 'image',
      label: 'Foto',
      render: (v: string, row: NewsArticle) => (
        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
          {v ? (
            <img
              src={v}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Judul',
      render: (v: string, row: NewsArticle) => (
        <div className="max-w-xs">
          <div className="font-semibold text-gray-900 text-sm line-clamp-2">
            {v}
          </div>
          <div className="text-gray-400 text-xs mt-0.5">
            {row.read_time}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (v: string) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            catColors[v] || catColors.Umum
          }`}
        >
          {v}
        </span>
      ),
    },
    {
      key: 'published_at',
      label: 'Tanggal',
      render: (v: string) =>
        new Date(v).toLocaleDateString('id-ID'),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (v: boolean) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            v
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {v ? '★ Featured' : '—'}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      render: (v: boolean) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            v
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-500'
          }`}
        >
          {v ? 'Aktif' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {toast && (
        <motion.div
          initial={{
            opacity: 0,
            y: -16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Berita & Artikel
          </h2>
          <p className="text-gray-500 text-sm">
            {items.length} artikel terdaftar
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#990000] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tulis Berita
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminTable
          columns={columns}
          data={items}
          loading={loading}
          onEdit={openEdit}
          onDelete={(r) => setDeleteId(r.id)}
          emptyText="Belum ada berita"
        />
      </div>

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Berita?"
        size="sm"
      >
        <p className="text-gray-600 text-sm mb-6">
          Yakin ingin menghapus berita ini?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium"
          >
            Batal
          </button>

          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            Hapus
          </button>
        </div>
      </AdminModal>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editItem
            ? 'Edit Berita'
            : 'Tulis Berita Baru'
        }
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
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
                placeholder="Judul berita..."
              />
            </FormField>
          </div>

          <FormField label="Kategori">
            <select
              className={selectClass}
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value,
                }))
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Estimasi Baca">
            <input
              className={inputClass}
              value={form.read_time}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  read_time: e.target.value,
                }))
              }
              placeholder="3 menit"
            />
          </FormField>

          <FormField label="Tanggal Publish">
            <input
              className={inputClass}
              type="date"
              value={form.published_at}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  published_at: e.target.value,
                }))
              }
            />
          </FormField>

          <div className="flex items-center gap-6">
            {[
              {
                k: 'featured',
                l: 'Featured',
              },
              {
                k: 'active',
                l: 'Publikasikan',
              },
            ].map((t) => (
              <label
                key={t.k}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    (form as any)[t.k]
                      ? 'bg-[#CC0000]'
                      : 'bg-gray-200'
                  }`}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      [t.k]: !(f as any)[t.k],
                    }))
                  }
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      (form as any)[t.k]
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    }`}
                  />
                </div>

                <span className="text-sm text-gray-700">
                  {t.l}
                </span>
              </label>
            ))}
          </div>

          <div className="md:col-span-2">
            <FormField label="Ringkasan">
              <textarea
                className={textareaClass}
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    excerpt: e.target.value,
                  }))
                }
                placeholder="Ringkasan singkat berita..."
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Konten Lengkap">
              <textarea
                className={textareaClass}
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    content: e.target.value,
                  }))
                }
                placeholder="Isi lengkap berita atau artikel..."
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              bucket="news"
              value={form.image}
              onChange={(url) =>
                setForm((f) => ({
                  ...f,
                  image: url,
                }))
              }
              label="Foto Berita"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={() => setModalOpen(false)}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !form.title}
            className="flex-1 bg-[#CC0000] hover:bg-[#990000] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            {saving
              ? 'Menyimpan...'
              : editItem
              ? 'Simpan'
              : 'Publikasikan'}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}