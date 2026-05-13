import CrudManager from '@/components/admin/CrudManager';

export default function DealersAdminPage() {
  return <CrudManager title="Dealer & Cabang" description="Kelola alamat, maps, WhatsApp, dan area layanan." table="dealers" searchField="name" fields={[
    { name: 'name', label: 'Nama Dealer' },
    { name: 'address', label: 'Alamat', type: 'textarea' },
    { name: 'city', label: 'Kota' },
    { name: 'whatsapp', label: 'WhatsApp' },
    { name: 'maps_url', label: 'Google Maps URL', type: 'url' },
    { name: 'opening_hours', label: 'Jam Operasional' },
    { name: 'area_served', label: 'Area Layanan' },
    { name: 'active', label: 'Status', type: 'boolean' },
  ]} />;
}
