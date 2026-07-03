"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import SidebarAdmin from "../componenAdmin/sidebar";
import NavbarAdmin from "../componenAdmin/navbar";

export default function NotifikasiWA() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load semua notifikasi WA
  const loadNotifikasi = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifikasiwa")
      .select(`
        *,
        pelanggan:pelangganid (
          namaPelanggan
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading notifikasi:", error);
    } else {
      setNotifikasi(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifikasi();
  }, []);

  // 🔴 Hapus satu notifikasi
  const hapusNotifikasi = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus notifikasi ini?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("notifikasiwa")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus notifikasi");
      console.error(error);
    } else {
      loadNotifikasi();
    }
  };

  // 🔥 Hapus semua history notifikasi
  const hapusSemuaNotifikasi = async () => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus SEMUA riwayat notifikasi WA?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("notifikasiwa")
      .delete()
      .neq("id", 0); // hapus semua data

    if (error) {
      alert("Gagal menghapus semua notifikasi");
      console.error(error);
    } else {
      loadNotifikasi();
    }
  };

  // Filter berdasarkan nama pelanggan
  const filteredNotifikasi = notifikasi.filter((item) =>
    item.pelanggan?.namaPelanggan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
     <div className="flex min-h-screen bg-gray-100 font-poppins">
          {/* SIDEBAR */}
          <SidebarAdmin />
    
          {/* AREA KONTEN */}
          <div className="flex-1 ml-60 ">
            {/* NAVBAR */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <NavbarAdmin />
            </div>
      <div className="flex items-center mb-2 mt-24 ml-16">
        <h1 className="text-2xl font-bold">Riwayat Notifikasi WA</h1>

        {notifikasi.length > 0 && (
          <button
            onClick={hapusSemuaNotifikasi}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-[68%]"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Cari nama pelanggan..."
        className="w-[94%] mb-5 ml-16 px-3 py-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Memuat notifikasi...</p>
      ) : filteredNotifikasi.length === 0 ? (
        <p className="ml-16">Belum ada notifikasi yang dikirim.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-12 px-4">
          {filteredNotifikasi.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded shadow bg-white relative"
            >
              <button
                onClick={() => hapusNotifikasi(item.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
              >
                Hapus
              </button>

              <p>
                <strong>Pelanggan:</strong>{" "}
                {item.pelanggan?.namaPelanggan || "-"}
              </p>
              <p>
                <strong>No HP:</strong> {item.nohp}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "-"}
              </p>

              <details className="mt-2">
                <summary className="cursor-pointer font-semibold">
                  Lihat Pesan
                </summary>
                <pre className="mt-1 whitespace-pre-line">{item.pesan}</pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
