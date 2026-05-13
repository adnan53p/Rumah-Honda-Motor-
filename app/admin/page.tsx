export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Selamat datang di panel admin Honda Premium.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Kendaraan</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">0</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Promo</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">0</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Leads</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">0</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Status Website
        </h2>
        <p className="text-gray-600">
          Dashboard sudah berhasil dibuka. Sekarang Anda bisa lanjut mengatur
          produk, promo, banner, artikel SEO, FAQ, testimoni, dealer, leads,
          dan pengaturan website dari menu sebelah kiri.
        </p>
      </div>
    </div>
  );
}