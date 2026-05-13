import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, whatsapp, kota, produk_minat, pesan } = body;

    if (!nama || !whatsapp || !kota) {
      return NextResponse.json({ error: 'Nama, WhatsApp, dan Kota wajib diisi' }, { status: 400 });
    }

    const { data, error } = await (supabase as any)
      .from('leads')
      .insert({ nama, whatsapp, kota, produk_minat: produk_minat || '', pesan: pesan || '', status: 'new' } as any)
      .select()
      .single();

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
