import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables are missing. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.'
  );
}

export const supabase = createClient<any>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function signInAdmin(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export function getPublicUrl(
  bucket: string,
  path: string
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    console.error(
      '[Supabase Storage] Upload error:',
      error.message
    );

    return null;
  }

  return getPublicUrl(bucket, path);
}

export async function deleteFile(
  bucket: string,
  path: string
) {
  return supabase.storage
    .from(bucket)
    .remove([path]);
}

export async function fetchProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true);

  if (
    options?.category &&
    options.category !== 'all'
  ) {
    query = query.eq(
      'kategori',
      options.category
    );
  }

  if (options?.featured) {
    query = query.eq('featured', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query.order('created_at', {
    ascending: false,
  });
}

export async function fetchPromos() {
  return supabase
    .from('promo')
    .select('*')
    .eq('active', true)
    .order('order_index');
}

export async function fetchNews(options?: {
  featured?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('news')
    .select('*')
    .eq('active', true);

  if (options?.featured) {
    query = query.eq('featured', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query.order('published_at', {
    ascending: false,
  });
}

export async function fetchTestimonials() {
  return supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('order_index');
}

export async function fetchBanners() {
  return supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .order('order_index');
}

export async function insertLead(data: {
  nama: string;
  whatsapp: string;
  kota: string;
  produk_minat?: string;
  pesan?: string;
}) {
  return (supabase as any).from('leads').insert({
    ...data,
    status: 'new',
  });
}