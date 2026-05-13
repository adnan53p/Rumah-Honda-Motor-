# Perubahan dari ChatGPT

Perubahan utama:
1. Admin `/admin` sekarang wajib login Supabase.
2. Jika belum login, otomatis diarahkan ke `/admin/login`.
3. Halaman login memakai logo Rumah Honda Motor.
4. Header website mengganti teks HONDA INDONESIA menjadi logo `public/logo-rumah-honda-motor.png`.
5. Tombol logout admin tetap tersedia di sidebar.

Cara membuat akun admin:
1. Buka Supabase Dashboard.
2. Masuk ke Authentication → Users.
3. Klik Add user.
4. Masukkan email dan password admin.
5. Centang/aktifkan Auto Confirm User.
6. Login di `/admin/login`.

Setelah extract:
```powershell
npm install
npm run build
git add .
git commit -m "Enable secure admin login and update logo"
git push
```

Catatan:
- Proteksi dilakukan client-side lewat Supabase session di `app/admin/layout.tsx`.
- Jangan promosikan URL admin ke publik.
- Untuk keamanan server-level penuh, nanti bisa dilanjutkan migrasi ke `@supabase/ssr` cookie auth.
