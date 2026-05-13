-- ============================================================
-- HONDA PREMIUM WEBSITE — SUPABASE SQL SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  harga BIGINT NOT NULL DEFAULT 0,
  harga_display TEXT NOT NULL DEFAULT '',
  deskripsi TEXT DEFAULT '',
  spesifikasi JSONB DEFAULT '{}',
  kategori TEXT NOT NULL DEFAULT 'matic' CHECK (kategori IN ('sport','matic','cub','adventure')),
  gambar TEXT DEFAULT '',
  gambar_urls TEXT[] DEFAULT '{}',
  warna TEXT[] DEFAULT '{}',
  badge TEXT DEFAULT '',
  badge_color TEXT DEFAULT '',
  gradient TEXT DEFAULT 'from-gray-900 to-black',
  promo TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ PROMO ============
CREATE TABLE IF NOT EXISTS promo (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  badge_color TEXT DEFAULT 'red',
  gradient TEXT DEFAULT 'from-honda-red-dark to-honda-black',
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ NEWS ============
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Umum',
  image TEXT DEFAULT '',
  read_time TEXT DEFAULT '3 menit',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ LEADS ============
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  kota TEXT NOT NULL,
  produk_minat TEXT DEFAULT '',
  pesan TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','converted','lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  komentar TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  foto TEXT DEFAULT '',
  produk TEXT DEFAULT '',
  kota TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  deskripsi TEXT DEFAULT '',
  lokasi TEXT NOT NULL DEFAULT '',
  tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image TEXT DEFAULT '',
  link TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ BANNERS ============
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  cta_text TEXT DEFAULT 'Jelajahi Sekarang',
  cta_link TEXT DEFAULT '#products',
  badge TEXT DEFAULT '',
  accent_color TEXT DEFAULT '#CC0000',
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access (website visitors)
CREATE POLICY "Public read products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public read promo" ON promo FOR SELECT USING (active = true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (active = true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (active = true);

-- Public insert for leads (lead capture form)
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all promo" ON promo FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public read products storage" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin upload products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete products" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Public read banners storage" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Admin upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Public read news storage" ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "Admin upload news" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news' AND auth.role() = 'authenticated');

CREATE POLICY "Public read testimonials storage" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Admin upload testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Public read events storage" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Admin upload events" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Products
-- ============================================================

INSERT INTO products (nama, slug, harga, harga_display, deskripsi, spesifikasi, kategori, gambar, warna, badge, badge_color, gradient, featured, active) VALUES
(
  'CBR250RR', 'cbr250rr', 78500000, 'Rp 78.500.000',
  'Motor sport premium dengan mesin 250cc DOHC parallel twin. Dominasi setiap tikungan dengan teknologi MotoGP.',
  '{"engine":"250cc","power":"31 PS","torque":"25 Nm","weight":"168 kg"}',
  'sport',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['#CC0000','#0A0A0A','#1A3A5C'],
  'Terlaris', 'red', 'from-red-900 to-black', true, true
),
(
  'PCX 160', 'pcx-160', 34200000, 'Rp 34.200.000',
  'Skuter premium dengan Smart Key System dan mesin ESP+ 160cc. Gaya premium untuk kehidupan urban modern.',
  '{"engine":"160cc","power":"15.8 PS","torque":"14.7 Nm","weight":"130 kg"}',
  'matic',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80',
  ARRAY['#CC0000','#2D2D2D','#F5F5F5'],
  'Baru', 'gold', 'from-gray-900 to-black', true, true
),
(
  'ADV 160', 'adv-160', 38900000, 'Rp 38.900.000',
  'Adventure scooter dengan ground clearance tinggi dan fitur canggih untuk petualangan urban maupun touring.',
  '{"engine":"160cc","power":"15.7 PS","torque":"14.7 Nm","weight":"133 kg"}',
  'adventure',
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80',
  ARRAY['#1A3A5C','#CC0000','#2D2D2D'],
  'Popular', 'blue', 'from-blue-900 to-black', true, true
),
(
  'BeAT Street', 'beat-street', 18500000, 'Rp 18.500.000',
  'Skuter sporty dengan desain street style yang modern. Efisien, lincah, dan stylish untuk aktivitas sehari-hari.',
  '{"engine":"110cc","power":"9.0 PS","torque":"9.3 Nm","weight":"91 kg"}',
  'matic',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80',
  ARRAY['#CC0000','#0A0A0A','#4A4A4A'],
  '', '', 'from-zinc-900 to-black', false, true
),
(
  'CB150R', 'cb150r', 32800000, 'Rp 32.800.000',
  'Naked sport agresif dengan karakter streetfighter sejati. Mesin 150cc bertenaga untuk dominasi jalanan kota.',
  '{"engine":"150cc","power":"16.1 PS","torque":"13.7 Nm","weight":"135 kg"}',
  'sport',
  'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80',
  ARRAY['#CC0000','#0A0A0A','#2D4A2D'],
  '', '', 'from-red-950 to-black', false, true
),
(
  'Supra GTR 150', 'supra-gtr-150', 22400000, 'Rp 22.400.000',
  'Bebek sport dengan jiwa racing sejati. Mesin 150cc berkarakter untuk pengendara yang menginginkan performa dan efisiensi.',
  '{"engine":"150cc","power":"13.9 PS","torque":"13.5 Nm","weight":"111 kg"}',
  'cub',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
  ARRAY['#CC0000','#2D2D2D','#1A3A5C'],
  '', '', 'from-slate-900 to-black', false, true
);

-- ============================================================
-- SEED DATA — Promo
-- ============================================================

INSERT INTO promo (title, subtitle, description, badge, badge_color, gradient, expires_at, active, order_index) VALUES
('DP Mulai Rp 2 Juta', 'Honda BeAT Series', 'Promo spesial akhir tahun. Angsuran ringan mulai Rp 700.000/bulan dengan proses pengajuan mudah.', 'Terbatas', 'red', 'from-honda-red-dark to-honda-black', '2024-12-31T23:59:59Z', true, 1),
('Angsuran 0%', 'Honda PCX 160', 'Bunga 0% untuk tenor 12 bulan dengan uang muka minimum. Promo eksklusif bulan ini.', 'Eksklusif', 'gold', 'from-blue-900 to-honda-black', '2024-11-28T23:59:59Z', true, 2),
('Free Aksesori', 'Honda CBR Series', 'Dapatkan aksesori original Honda senilai Rp 3 juta gratis untuk setiap pembelian CBR.', 'Spesial', 'blue', 'from-zinc-800 to-honda-black', '2024-12-15T23:59:59Z', true, 3);

-- ============================================================
-- SEED DATA — Testimonials
-- ============================================================

INSERT INTO testimonials (nama, komentar, rating, produk, kota, active, order_index) VALUES
('Budi Santoso', 'PCX 160 saya sudah 2 tahun, mesin masih prima dan irit banget! Servis di AHASS juga ramah dan profesional. Highly recommended!', 5, 'PCX 160', 'Jakarta', true, 1),
('Dewi Rahayu', 'CBR250RR adalah motor terbaik yang pernah saya miliki. Performa luar biasa, handling mantap, dan desain yang selalu bikin kagum!', 5, 'CBR250RR', 'Bandung', true, 2),
('Agus Firmansyah', 'ADV 160 cocok banget buat saya yang sering touring. Ground clearance tinggi, fitur lengkap, dan nyaman banget dipakai jarak jauh.', 5, 'ADV 160', 'Surabaya', true, 3),
('Siti Nurhaliza', 'Beli BeAT Street lewat promo DP ringan, prosesnya cepat dan mudah. Motor nyaman dan irit, cocok untuk harian di Jakarta.', 4, 'BeAT Street', 'Depok', true, 4);

-- ============================================================
-- SEED DATA — News
-- ============================================================

INSERT INTO news (title, excerpt, category, image, read_time, featured, active, published_at) VALUES
('Honda CBR250RR Raih Juara 1 Asia Road Racing Championship 2024', 'Tim Astra Honda Racing kembali membuktikan dominasi di ajang bergengsi internasional dengan kemenangan memukau di sirkuit Sentul.', 'Racing', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', '4 menit', true, true, NOW() - INTERVAL '5 days'),
('Peluncuran Honda PCX 160 Edisi Spesial Anniversary 50 Tahun', 'Menandai 50 tahun kehadiran Honda di Indonesia, PCX 160 hadir dalam warna eksklusif dengan fitur premium terbaru.', 'Produk Baru', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80', '3 menit', false, true, NOW() - INTERVAL '10 days'),
('Honda Perkenalkan Teknologi E-Clutch Pertama untuk Motor Sport', 'Inovasi revolusioner E-Clutch hadir memberikan pengalaman berkendara yang lebih intuitif dan efisien.', 'Teknologi', 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80', '5 menit', false, true, NOW() - INTERVAL '15 days'),
('Program Honda Care: Servis Gratis 10.000 Motor di Seluruh Indonesia', 'Honda memberikan layanan servis gratis kepada pelanggan setia di 1.200 bengkel resmi seluruh Indonesia.', 'Program', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80', '2 menit', false, true, NOW() - INTERVAL '22 days');

-- ============================================================
-- SEED DATA — Events
-- ============================================================

INSERT INTO events (title, deskripsi, lokasi, tanggal, active) VALUES
('Honda Racing Carnival 2024', 'Event otomotif terbesar Honda dengan pameran motor terbaru, test ride, dan kompetisi menarik.', 'JIEXPO Kemayoran, Jakarta', NOW() + INTERVAL '14 days', true),
('Honda Touring Nasional Jawa-Bali', 'Touring akbar bersama ribuan komunitas Honda dari seluruh Jawa menuju Bali.', 'Start: Surabaya, Finish: Bali', NOW() + INTERVAL '30 days', true),
('Honda Community Gathering Jabodetabek', 'Kopi darat akbar komunitas Honda se-Jabodetabek. Games, doorprize, dan banyak hadiah menarik!', 'Senayan, Jakarta', NOW() + INTERVAL '7 days', true);

-- ============================================================
-- SEED DATA — Banners
-- ============================================================

INSERT INTO banners (title, subtitle, description, image, cta_text, cta_link, badge, accent_color, active, order_index) VALUES
('CBR250RR', 'Born To Race', 'Performa mesin 250cc DOHC dengan teknologi terdepan. Dominasi setiap tikungan.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90', 'Jelajahi Sekarang', '#products', '2024 Special Edition', '#CC0000', true, 1),
('PCX 160', 'Smart. Stylish. Powerful.', 'Teknologi Smart Key System dan mesin ESP+ untuk kenyamanan berkendara premium.', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1600&q=90', 'Lihat Detail', '#products', 'New Model 2024', '#C9A84C', true, 2),
('ADV 160', 'Ready For Any Road', 'Ground clearance tinggi dan fitur canggih untuk petualangan urban maupun luar kota.', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1600&q=90', 'Temukan Petualangan', '#products', 'Adventure Series', '#1A6ABA', true, 3);

-- ============================================================
-- CMS + SEO MARKETING TABLES (ADDED CLEANUP)
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'product' CHECK (type IN ('product','article')),
  description TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'SEO',
  image TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'Umum',
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dealers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  maps_url TEXT DEFAULT '',
  opening_hours TEXT DEFAULT '',
  area_served TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT '',
  group_name TEXT DEFAULT 'general',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (active = true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (active = true);
CREATE POLICY "Public read dealers" ON dealers FOR SELECT USING (active = true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all faq" ON faq FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all dealers" ON dealers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public read articles storage" ON storage.objects FOR SELECT USING (bucket_id = 'articles');
CREATE POLICY "Admin upload articles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'articles' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete articles" ON storage.objects FOR DELETE USING (bucket_id = 'articles' AND auth.role() = 'authenticated');
