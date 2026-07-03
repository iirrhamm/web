"use client";

import { useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const router = useRouter();

  return (
    <aside className="w-72 fixed left-0 top-16 bottom-0 bg-gray-500 px-4 py-9 text-white font-poppins">
      <ul className="space-y-8 font-medium">

        {/* Dashboard */}
        <li>
          <a
            href="/admin/profilAdmin"
            className="flex items-center p-3 rounded-lg hover:bg-blue-600"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 20V14h4v6h5v-8h3L10 0 0 12h3v8z" />
            </svg>
            <span className="ml-4">Dashboard</span>
          </a>
        </li>

        {/* Tambah Orderan */}
        <li>
          <button
            onClick={() => router.push("/admin/tambahPaket")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className="ml-4">Tambah Orderan</span>
          </button>
        </li>

        {/* Riwayat Order */}
        <li>
          <button
            onClick={() => router.push("/admin/konfirmasi")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3h12v2H4V3zm0 5h8v2H4V8zm0 5h12v2H4v-2z" />
            </svg>
            <span className="ml-4">Daftar Orderan</span>
          </button>
        </li>

        {/* Paket / Layanan */}
        <li>
          <a
            href="/admin/paket"
            className="flex items-center p-3 rounded-lg hover:bg-blue-600"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0L0 5v10l10 5 10-5V5L10 0z" />
            </svg>
            <span className="ml-4">Paket / Layanan</span>
          </a>
        </li>

        {/* Notifikasi WA */}
        <li>
          <button
            onClick={() => router.push("/admin/notifikasi")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0a12 12 0 0 0-10 18l-2 6 6-2a12 12 0 1 0 6-22z" />
            </svg>
            <span className="ml-4">Riwayat Notifikasi</span>
          </button>
        </li>

        {/* Laporan */}
        <li>
          <button
            onClick={() => router.push("/admin/laporan")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v2H4zm0 5h10v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
            </svg>
            <span className="ml-4">Laporan Keuangan</span>
          </button>
        </li>

        {/* Pengaturan */}
        <li>
          <button
            onClick={() => router.push("/admin/pengaturan")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12.94 0l-.94 2.06L11 2c-.7 0-1.4.1-2 .3L8.06 2 7 0H3L4.1 2.3C2.8 3.4 2 5.1 2 7c0 1.9.8 3.6 2.1 4.7L3 14h4l1.06-2.06 1 .3c.6.2 1.3.3 2 .3l1 .06.94 2.06H17l-1.1-2.3C18.2 10.6 19 8.9 19 7s-.8-3.6-2.1-4.7L17 0h-4z" />
            </svg>
            <span className="ml-4">Pengaturan</span>
          </button>
        </li>

        {/* Logout */}
        <li>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            onClick={() => {
              alert("Logout berhasil!");
              router.push("/");
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
