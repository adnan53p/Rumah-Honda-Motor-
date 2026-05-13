'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  'Produk': ['CBR Series', 'PCX Series', 'ADV Series', 'BeAT Series', 'Supra Series', 'Vario Series'],
  'Layanan': ['AHASS', 'Honda Care', 'Suku Cadang Asli', 'Garansi Resmi', 'Recall Informasi'],
  'Perusahaan': ['Tentang Kami', 'Visi & Misi', 'Karir', 'Investor Relations', 'CSR'],
  'Informasi': ['Berita & Event', 'Promo Terkini', 'Simulasi Kredit', 'Cari Dealer', 'FAQ'],
};

const socialLinks = [
  { name: 'Facebook', icon: 'f', href: '#' },
  { name: 'Instagram', icon: '✦', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
  { name: 'Twitter', icon: '✕', href: '#' },
  { name: 'TikTok', icon: '◈', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-honda-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-honda-red rounded-full flex items-center justify-center font-display font-bold text-xl">
                H
              </div>
              <div>
                <div className="font-display font-bold text-xl leading-none">HONDA</div>
                <div className="text-[10px] text-honda-gray-mid tracking-[0.2em]">INDONESIA</div>
              </div>
            </div>
            <p className="text-honda-gray-mid text-sm leading-relaxed mb-6 max-w-xs">
              PT Astra Honda Motor — Produsen sepeda motor Honda terbesar di Indonesia. 
              Menghadirkan teknologi terdepan untuk kehidupan yang lebih baik.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-sm text-honda-gray-mid hover:border-honda-red hover:text-honda-red hover:bg-honda-red/10 transition-all duration-300"
                  aria-label={s.name}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-sm tracking-wider text-white mb-4 uppercase">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-honda-gray-mid text-sm hover:text-honda-red transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-honda-gray-mid text-xs">Terdaftar & Diawasi oleh:</span>
            {['ISO 9001:2015', 'SNI', 'BPOM', 'TKDN 85%'].map((cert) => (
              <span
                key={cert}
                className="px-3 py-1 border border-white/10 rounded text-xs text-honda-gray-mid"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-honda-gray-mid text-xs">
            © {new Date().getFullYear()} PT Astra Honda Motor. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-honda-gray-mid text-xs hover:text-honda-red transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Red line bottom */}
      <div className="h-1 bg-gradient-to-r from-transparent via-honda-red to-transparent" />
    </footer>
  );
}
