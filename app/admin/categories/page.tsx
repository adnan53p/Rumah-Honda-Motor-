import CrudManager from '@/components/admin/CrudManager';

export default function CategoriesAdminPage() {
  return <CrudManager title="Kategori" description="Kelola kategori produk dan artikel." table="categories" searchField="name" fields={[
    { name: 'name', label: 'Nama Kategori' },
    { name: 'slug', label: 'Slug' },
    { name: 'type', label: 'Tipe: product/article' },
    { name: 'description', label: 'Deskripsi', type: 'textarea' },
    { name: 'active', label: 'Status', type: 'boolean' },
  ]} />;
}
