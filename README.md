# Honda Premium Website — Full Stack v2.0
## Next.js 14 + Tailwind CSS + Framer Motion + Supabase

---

## 🚀 Setup (5 Menit)

### 1. Install
```bash
npm install
```

### 2. Supabase Database
1. Buka Supabase Dashboard → SQL Editor → New Query
2. Copy-paste isi `supabase-schema.sql` → Run
3. Semua tabel, RLS, storage, dan seed data terbuat otomatis

### 3. Environment Variables
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://ieakfsqhrxpdkngdfkbi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_KEY_ANDA
NEXT_PUBLIC_WA_NUMBER=6281234567890
```
Anon key: Supabase Dashboard → Settings → API

### 4. Buat Admin User
Supabase Dashboard → Authentication → Users → Add User
- Email: admin@honda.com
- Password: pilih yang kuat

### 5. Run
```bash
npm run dev
# Website: http://localhost:3000
# Admin:   http://localhost:3000/admin
```

---

## 📁 Struktur

```
app/
  page.tsx              - Website utama
  admin/
    page.tsx            - Dashboard
    login/              - Login admin
    products/           - CRUD kendaraan
    promo/              - CRUD promo
    news/               - CRUD berita
    leads/              - Kelola leads
  api/
    leads/              - POST endpoint
    products/           - GET endpoint

components/
  sections/
    HeroSlider          - Hero fullscreen
    PromoBannerSlider   - ★ Promo banner dinamis
    ProductShowcase     - ★ Data dari Supabase
    TestimonialSection  - ★ Ulasan dinamis
    LeadCaptureForm     - ★ Form → Supabase leads
    ... (semua section lama tetap ada)
  admin/
    AdminTable, AdminModal, ImageUpload
  ui/
    FloatingWhatsApp    - ★ Premium + glow
    QuickActions        - ★ Side quick actions

lib/supabase.ts         - ★ Supabase client
types/database.ts       - ★ TypeScript types
supabase-schema.sql     - ★ SQL schema lengkap
```

---

## 🗄️ Tabel Supabase
`products` · `promo` · `news` · `leads` · `testimonials` · `events` · `banners`

## 🚀 Deploy Vercel
```bash
vercel --prod
# Set env vars: SUPABASE_URL, SUPABASE_ANON_KEY, WA_NUMBER
```
