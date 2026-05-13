export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      promo: {
        Row: Promo;
        Insert: Omit<Promo, 'id' | 'created_at'>;
        Update: Partial<Omit<Promo, 'id' | 'created_at'>>;
      };
      news: {
        Row: NewsArticle;
        Insert: Omit<NewsArticle, 'id' | 'created_at'>;
        Update: Partial<Omit<NewsArticle, 'id' | 'created_at'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at'>;
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id' | 'created_at'>;
        Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at'>>;
      };
      banners: {
        Row: Banner;
        Insert: Omit<Banner, 'id' | 'created_at'>;
        Update: Partial<Omit<Banner, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Product {
  id: string;
  nama: string;
  slug: string;
  harga: number;
  harga_display: string;
  deskripsi: string;
  spesifikasi: {
    engine?: string;
    power?: string;
    torque?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  kategori: 'sport' | 'matic' | 'cub' | 'adventure';
  gambar: string;
  gambar_urls?: string[];
  warna: string[];
  badge?: string;
  badge_color?: string;
  gradient?: string;
  promo?: string;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  badge?: string;
  badge_color?: string;
  gradient?: string;
  expires_at?: string;
  active: boolean;
  order_index: number;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image: string;
  read_time: string;
  featured: boolean;
  active: boolean;
  published_at: string;
  created_at: string;
}

export interface Lead {
  id: string;
  nama: string;
  whatsapp: string;
  kota: string;
  produk_minat?: string;
  pesan?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  created_at: string;
}

export interface Testimonial {
  id: string;
  nama: string;
  komentar: string;
  rating: number;
  foto?: string;
  produk?: string;
  kota?: string;
  active: boolean;
  order_index: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  deskripsi?: string;
  lokasi: string;
  tanggal: string;
  image?: string;
  link?: string;
  active: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  cta_text?: string;
  cta_link?: string;
  badge?: string;
  accent_color: string;
  active: boolean;
  order_index: number;
  created_at: string;
}
