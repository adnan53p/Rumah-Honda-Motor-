'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Lead } from '@/types/database';
import AdminTable from '@/components/admin/AdminTable';

const statusConfig = {
  new: {
    label: 'Baru',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  contacted: {
    label: 'Dihubungi',
    color: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  converted: {
    label: 'Closing ✓',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  lost: {
    label: 'Tidak Jadi',
    color: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400',
  },
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);

    const { data } = await (supabase as any)
      .from('leads')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    setLeads(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(
    id: string,
    status: Lead['status']
  ) {
    await (supabase as any)
      .from('leads')
      .update({ status } as any)
      .eq('id', id);

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
            }
          : l
      )
    );

    setToast('Status diperbarui');
    setTimeout(() => setToast(''), 2000);
  }

  async function deleteLead(id: string) {
    await (supabase as any)
      .from('leads')
      .delete()
      .eq('id', id);

    setLeads((prev) =>
      prev.filter((l) => l.id !== id)
    );

    setToast('Lead dihapus');
    setTimeout(() => setToast(''), 2000);
  }

  const filtered = leads.filter((l) => {
    const matchFilter =
      filter === 'all' || l.status === filter;

    const matchSearch =
      !search ||
      l.nama
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      l.whatsapp.includes(search) ||
      l.kota
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    lost: leads.filter((l) => l.status === 'lost').length,
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama',
      render: (v: string, row: Lead) => (
        <div>
          <div className="font-semibold text-gray-900">
            {v}
          </div>
          <div className="text-gray-400 text-xs">
            {row.kota}
          </div>
        </div>
      ),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      render: (v: string) => {
        const cleanNumber = v
          .replace(/^0/, '62')
          .replace(/[^0-9]/g, '');

        return (
          <a
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline font-medium text-sm flex items-center gap-1"
          >
            {v}
          </a>
        );
      },
    },
    {
      key: 'produk_minat',
      label: 'Produk',
      render: (v: string) => v || '—',
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (v: string) =>
        new Date(v).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v: string, row: Lead) => (
        <select
          value={v}
          onChange={(e) =>
            updateStatus(
              row.id,
              e.target.value as Lead['status']
            )
          }
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${
            statusConfig[
              v as keyof typeof statusConfig
            ]?.color || statusConfig.new.color
          }`}
        >
          {Object.entries(statusConfig).map(
            ([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.label}
              </option>
            )
          )}
        </select>
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
            Leads
          </h2>

          <p className="text-gray-500 text-sm">
            {leads.length} total leads · {counts.new} baru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          {
            k: 'all',
            l: `Semua (${counts.all})`,
          },
          {
            k: 'new',
            l: `Baru (${counts.new})`,
          },
          {
            k: 'contacted',
            l: `Dihubungi (${counts.contacted})`,
          },
          {
            k: 'converted',
            l: `Closing (${counts.converted})`,
          },
          {
            k: 'lost',
            l: `Tidak Jadi (${counts.lost})`,
          },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === t.k
                ? 'bg-[#CC0000] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, WhatsApp, atau kota..."
          className="w-full max-w-sm pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#CC0000] transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminTable
          columns={columns}
          data={filtered}
          loading={loading}
          onDelete={(row) => {
            if (confirm('Hapus lead ini?')) {
              deleteLead(row.id);
            }
          }}
          emptyText="Tidak ada lead ditemukan"
        />
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-xs">
          Untuk export CSV, gunakan Supabase Dashboard → Table
          Editor → Export
        </p>
      </div>
    </div>
  );
}