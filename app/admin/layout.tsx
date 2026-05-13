'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Kendaraan', icon: '🏍' },
  { href: '/admin/categories', label: 'Kategori', icon: '🏷' },
  { href: '/admin/promo', label: 'Promo', icon: '🎁' },
  { href: '/admin/news', label: 'Berita Lama', icon: '📰' },
  { href: '/admin/articles', label: 'Artikel SEO', icon: '✍️' },
  { href: '/admin/faq', label: 'FAQ', icon: '❓' },
  { href: '/admin/testimonials', label: 'Testimoni', icon: '⭐' },
  { href: '/admin/dealers', label: 'Dealer', icon: '📍' },
  { href: '/admin/leads', label: 'Leads', icon: '👥' },
  { href: '/admin/banners', label: 'Banner Hero', icon: '🖼' },
  { href: '/admin/settings', label: 'Pengaturan', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      if (pathname === '/admin/login') {
        if (mounted) setCheckingAuth(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setCheckingAuth(false);
        router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
        return;
      }

      setUser(session.user);
      setCheckingAuth(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (pathname === '/admin/login') return;

      if (!session?.user) {
        setUser(null);
        router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
        return;
      }

      setUser(session.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-44 h-20">
            <Image
              src="/logo-rumah-honda-motor.png"
              alt="Rumah Honda Motor"
              fill
              priority
              className="object-contain"
            />
          </div>
          <p className="text-white/50 text-sm">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#0A0A0A] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-28 h-12">
              <Image
                src="/logo-rumah-honda-motor.png"
                alt="Rumah Honda Motor"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#CC0000] text-white shadow-lg shadow-red-900/30'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}

                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#CC0000]/20 flex items-center justify-center text-[#CC0000] text-sm font-bold">
              {user.email?.[0]?.toUpperCase() || 'A'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">
                {user.email}
              </div>

              <div className="text-white/40 text-[10px]">
                Administrator
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-white/50 hover:text-[#CC0000] hover:bg-white/5 rounded-xl text-sm transition-all"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
          >
            ☰
          </button>

          <div className="flex-1">
            <h1 className="text-gray-900 font-semibold text-base">
              {navItems.find(
                (i) =>
                  pathname === i.href ||
                  (i.href !== '/admin' &&
                    pathname.startsWith(i.href))
              )?.label || 'Dashboard'}
            </h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-[#CC0000]"
          >
            Lihat Website
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
