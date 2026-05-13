import CrudManager from '@/components/admin/CrudManager';

export default function FaqAdminPage() {
  return <CrudManager title="FAQ" description="Kelola pertanyaan umum untuk SEO dan closing customer." table="faq" searchField="question" fields={[
    { name: 'question', label: 'Pertanyaan' },
    { name: 'answer', label: 'Jawaban', type: 'textarea' },
    { name: 'category', label: 'Kategori' },
    { name: 'order_index', label: 'Urutan', type: 'number' },
    { name: 'active', label: 'Status', type: 'boolean' },
  ]} />;
}
