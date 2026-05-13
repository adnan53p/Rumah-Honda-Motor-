import CrudManager from '@/components/admin/CrudManager';

export default function SettingsAdminPage() {
  return <CrudManager title="Pengaturan Website" description="Kelola logo, kontak, SEO global, dan identitas website." table="settings" searchField="key" fields={[
    { name: 'key', label: 'Key / Nama Setting' },
    { name: 'value', label: 'Value / Isi Setting', type: 'textarea' },
    { name: 'group_name', label: 'Grup' },
    { name: 'description', label: 'Keterangan', type: 'textarea' },
  ]} />;
}
