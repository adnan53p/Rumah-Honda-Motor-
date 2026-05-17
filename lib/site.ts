export const siteConfig = {
  name: 'Honda Premium Dealer',

  tagline:
    'Dealer Motor Honda Premium untuk Promo, Kredit, dan Konsultasi Pembelian',

  description:
    'Temukan promo motor Honda, simulasi kredit, katalog produk, dan konsultasi pembelian melalui dealer motor Honda premium.',

  url: 'https://www.rumahhondamotor.my.id',

  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628129767279',

  address:
    process.env.NEXT_PUBLIC_DEALER_ADDRESS || 'Jakarta, Indonesia',

  areaServed: [
    'Jakarta',
    'Tangerang',
    'Bekasi',
    'Depok',
    'Bogor',
  ],

  keywords: [
    'promo motor Honda',
    'dealer Honda',
    'kredit motor Honda',
    'Honda Beat',
    'Honda Vario',
    'Honda PCX',
    'simulasi kredit motor Honda',
  ],
};

export function absoluteUrl(path = '/') {
  const base = siteConfig.url.replace(/\/$/, '');

  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(
    message
  )}`;
}
