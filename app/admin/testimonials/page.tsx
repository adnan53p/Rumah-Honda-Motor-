import CrudManager from '@/components/admin/CrudManager';

export default function TestimonialsAdminPage() {
  return <CrudManager title="Testimoni" description="Kelola bukti sosial dari customer." table="testimonials" searchField="nama" fields={[
    { name: 'nama', label: 'Nama Customer' },
    { name: 'komentar', label: 'Komentar', type: 'textarea' },
    { name: 'rating', label: 'Rating', type: 'number' },
    { name: 'foto', label: 'URL Foto', type: 'url' },
    { name: 'produk', label: 'Produk' },
    { name: 'kota', label: 'Kota' },
    { name: 'order_index', label: 'Urutan', type: 'number' },
    { name: 'active', label: 'Status', type: 'boolean' },
  ]} />;
}
