'use client';
import { useState, useCallback } from 'react';
import { uploadFile } from '@/lib/supabase';

interface ImageUploadProps {
  bucket: string;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ bucket, value, onChange, label = 'Gambar' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const url = await uploadFile(bucket, path, file);
    if (url) onChange(url);
    setUploading(false);
  }, [bucket, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragOver ? 'border-[#CC0000] bg-[#CC0000]/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {value ? (
          <div className="space-y-3">
            <img src={value} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            <div className="flex gap-2 justify-center">
              <label className="cursor-pointer text-xs font-medium text-[#CC0000] hover:underline">
                Ganti Gambar
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <button type="button" onClick={() => onChange('')} className="text-xs text-gray-400 hover:text-red-500">
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-[#CC0000] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-500">Mengupload...</p>
              </div>
            ) : (
              <div>
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">Drag & drop atau</p>
                <label className="cursor-pointer inline-block text-sm font-medium text-[#CC0000] hover:underline">
                  Pilih File
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, WebP max 5MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* URL input */}
      <div className="mt-2">
        <input
          type="url"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Atau paste URL gambar langsung..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 outline-none focus:border-[#CC0000] transition-all"
        />
      </div>
    </div>
  );
}
