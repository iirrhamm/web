"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";

export default function AdminHomepage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const cekAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/loginAdmin"); // redirect kalau belum login
        return;
      }

      // Cek apakah email user adalah admin (misal dari kolom metadata.role)
      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (error || !data || data.role !== "admin") {
        router.push("/unauthorized");
        return;
      }

      setAdminName(data.full_name || "Admin");
      setLoading(false);
    };

    cekAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50 text-gray-700 text-lg">
        🔄 Memuat halaman admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-poppins">
      {/* Navbar Admin */}
      <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-600">
            🌿 Mbak Sprih Laundry - Admin Panel
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Halo, {adminName}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-800 mb-6">
          Selamat Datang, Admin 👋
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Kelola pesanan laundry, pelanggan, dan laporan dengan mudah melalui
          dashboard admin.
        </p>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105"
        >
          Buka Dashboard
        </button>
      </section>

      {/* Kartu Fitur */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto pb-16">
        {[
          {
            title: "Kelola Pesanan",
            desc: "Lihat dan ubah status pesanan pelanggan secara real-time.",
            icon: "🧺",
          },
          {
            title: "Manajemen Pelanggan",
            desc: "Tambah, edit, dan hapus data pelanggan dengan mudah.",
            icon: "👥",
          },
          {
            title: "Laporan Harian",
            desc: "Pantau performa bisnis dan pemasukan harian.",
            icon: "📊",
          },
          {
            title: "Notifikasi Otomatis",
            desc: "Kirim pesan WhatsApp otomatis ke pelanggan.",
            icon: "📱",
          },
        ].map((fitur) => (
          <div
            key={fitur.title}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center"
          >
            <div className="text-5xl mb-4">{fitur.icon}</div>
            <h3 className="font-bold text-lg text-blue-700 mb-2">
              {fitur.title}
            </h3>
            <p className="text-gray-600 text-sm">{fitur.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Mbak Sprih Laundry - Admin Panel
        </p>
      </footer>
    </div>
  );
}
