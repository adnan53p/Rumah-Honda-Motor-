import type { Metadata, Viewport } from 'next';
import './globals.css';
import { createSeo } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = createSeo({
  title: 'Promo Motor Honda, Kredit, dan Dealer Terdekat',
  description: siteConfig.description,
  path: '/',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#CC0000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
