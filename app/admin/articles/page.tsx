import CrudManager from '@/components/admin/CrudManager';

export default function ArticlesAdminPage() {
  return <CrudManager title="Artikel SEO" description="Kelola artikel marketing, blog, dan konten SEO." table="articles" searchField="title" fields={[
    { name: 'title', label: 'Judul' },
    { name: 'slug', label: 'Slug SEO' },
    { name: 'excerpt', label: 'Ringkasan', type: 'textarea' },
    { name: 'content', label: 'Isi Artikel', type: 'textarea' },
    { name: 'category', label: 'Kategori' },
    { name: 'image', label: 'URL Gambar', type: 'url' },
    { name: 'meta_title', label: 'Meta Title' },
    { name: 'meta_description', label: 'Meta Description', type: 'textarea' },
    { name: 'active', label: 'Status', type: 'boolean' },
  ]} />;
}
