'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function timeoutPromise(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms);
  });
}

function AdminLoginContent() {
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

    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      const result: any = await Promise.race([
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        }),
        timeoutPromise(15000),
      ]);

      const { data, error } = result;

      if (error) {
        setError(error.message || 'Login gagal.');
        return;
      }

      if (!data?.session) {
        setError('Session login tidak ditemukan.');
        return;
      }

      router.replace(nextUrl);
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 300);
    } catch (err: any) {
      setError('Terjadi kesalahan login.');
      setDebugInfo(String(err?.message ?? err));
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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
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
            <p className="text-white/40 text-sm mt-1">
              Login untuk mengelola website
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm font-medium">⚠ {error}</p>
                {debugInfo && (
                  <p className="text-red-400/70 text-xs mt-1">{debugInfo}</p>
                )}
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email admin"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none"
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 pr-14 rounded-xl outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#990000] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-white/50 text-sm">Memuat halaman login...</p>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}