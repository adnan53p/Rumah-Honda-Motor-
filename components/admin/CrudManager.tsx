'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'date' | 'url';
  placeholder?: string;
};

type CrudManagerProps = {
  title: string;
  description: string;
  table: string;
  fields: Field[];
  searchField?: string;
};

const defaultValues = (fields: Field[]) =>
  fields.reduce<Record<string, any>>((acc, field) => {
    acc[field.name] = field.type === 'boolean' ? true : '';
    return acc;
  }, {});

export default function CrudManager({ title, description, table, fields, searchField = 'title' }: CrudManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>(() => defaultValues(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) => String(item[searchField] || item.nama || item.name || '').toLowerCase().includes(query.toLowerCase()));
  }, [items, query, searchField]);

  async function loadItems() {
    setLoading(true);
    const { data, error } = await supabase.from(table as any).select('*').order('created_at', { ascending: false });
    if (error) setMessage(`Gagal memuat data: ${error.message}`);
    else setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, [table]);

  function updateField(name: string, value: any) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(item: any) {
    const next = defaultValues(fields);
    fields.forEach((field) => {
      next[field.name] = item[field.name] ?? (field.type === 'boolean' ? false : '');
    });
    setForm(next);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = fields.reduce<Record<string, any>>((acc, field) => {
      const value = form[field.name];
      acc[field.name] = field.type === 'number' && value !== '' ? Number(value) : value;
      return acc;
    }, {});

    const request = editingId
      ? (supabase as any).from(table as any).update(payload as any).eq('id', editingId)
      : (supabase as any).from(table as any).insert(payload as any);

    const { error } = await request;
    if (error) setMessage(`Gagal menyimpan: ${error.message}`);
    else {
      setMessage(editingId ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.');
      setForm(defaultValues(fields));
      setEditingId(null);
      await loadItems();
    }
    setSaving(false);
  }

  async function removeItem(id: string) {
    if (!confirm('Hapus data ini?')) return;
    const { error } = await (supabase as any).from(table as any).delete().eq('id', id);
    if (error) setMessage(`Gagal menghapus: ${error.message}`);
    else {
      setMessage('Data berhasil dihapus.');
      await loadItems();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                value={form[field.name] || ''}
                onChange={(event) => updateField(field.name, event.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
              />
            ) : field.type === 'boolean' ? (
              <select
                value={String(Boolean(form[field.name]))}
                onChange={(event) => updateField(field.name, event.target.value === 'true')}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'datetime-local' : field.type === 'url' ? 'url' : 'text'}
                value={form[field.name] || ''}
                onChange={(event) => updateField(field.name, event.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
              />
            )}
          </label>
        ))}
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Menyimpan...' : editingId ? 'Update Data' : 'Tambah Data'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(defaultValues(fields)); }} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600">
              Batal Edit
            </button>
          )}
        </div>
      </form>

      {message && <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{message}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="font-semibold text-gray-900">Daftar Data</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari data..."
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#CC0000]"
          />
        </div>
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Memuat data...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">Belum ada data.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{item[searchField] || item.nama || item.name || item.title || 'Tanpa Judul'}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {item.id}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600">Edit</button>
                  <button onClick={() => removeItem(item.id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
