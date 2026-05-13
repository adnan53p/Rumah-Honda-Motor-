'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function timeoutPromise(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms);
  });
}

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('adnanfafiudinku@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        router.replace(nextUrl);
        return;
      }

      setCheckingSession(false);
    });

    return () => {
      mounted = false;
    };
  }, [nextUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      const loginRequest = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      const result: any = await Promise.race([
        loginRequest,
        timeoutPromise(15000),
      ]);

      const { data, error } = result;

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          setError('Email atau password salah.');
          setDebugInfo('Cek user di Supabase → Authentication → Users, lalu reset password jika perlu.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Email belum dikonfirmasi.');
          setDebugInfo('Buka Supabase → Authentication → Users → pilih user → Confirm email.');
        } else {
          setError(`Login gagal: ${error.message}`);
          setDebugInfo(`Status: ${error.status ?? '-'} | ${error.message}`);
        }

        return;
      }

      if (!data?.session) {
        setError('Login tidak menghasilkan session.');
        setDebugInfo('Kemungkinan konfigurasi Supabase Auth belum benar atau user belum aktif.');
        return;
      }

      router.replace(nextUrl);
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 300);
    } catch (err: any) {
      if (err?.message === 'timeout') {
        setError('Login terlalu lama dan berhenti di Memverifikasi.');
        setDebugInfo('Biasanya karena koneksi ke Supabase terblokir, URL/key salah, atau project Supabase sedang tidak merespons.');
      } else {
        setError('Terjadi kesalahan saat login.');
        setDebugInfo(String(err?.message ?? err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/50 text-sm">Memeriksa sesi admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CC0000] rounded-full opacity-5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#CC0000] rounded-full opacity-5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="relative w-56 h-28 mx-auto mb-2">
              <Image
                src="/logo-rumah-honda-motor.png"
                alt="Rumah Honda Motor"
                fill
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-white font-bold text-xl">Admin Panel</h1>
            <p className="text-white/40 text-sm mt-1">Login untuk mengelola website</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm font-medium mb-1">⚠ {error}</p>
                {debugInfo && <p className="text-red-400/70 text-xs mt-1">{debugInfo}</p>}
              </div>
            )}

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@email.com"
                className="w-full bg-white/5 border border-white/10 focus:border-[#CC0000] text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#CC0000] text-white placeholder-white/20 px-4 py-3 pr-14 rounded-xl outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#990000] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memverifikasi...
                </>
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs">
              Buat akun admin di Supabase Authentication → Users.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
