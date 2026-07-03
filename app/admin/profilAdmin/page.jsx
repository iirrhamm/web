"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import NavbarAdmin from "../componenAdmin/navbar";
import SidebarAdmin from "../componenAdmin/sidebar";

export default function DashboardAdmin() {
  const [pelanggan, setPelanggan] = useState([]);
  const [totalPelanggan, setTotalPelanggan] = useState(0);
  const [totalSelesai, setTotalSelesai] = useState(0);
  const [totalProses, setTotalProses] = useState(0);

  const ambilData = async () => {
    const { data, error } = await supabase.from("pelanggan").select("*");
    if (error) console.error("Gagal memuat data:", error);
    else {
      setPelanggan(data);
      setTotalPelanggan(data.length);
      setTotalSelesai(data.filter((p) => p.status === "Selesai").length);
      setTotalProses(data.filter((p) => p.status !== "Selesai").length);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
          {/* SIDEBAR */}
          <SidebarAdmin />
    
          {/* AREA KONTEN */}
          <div className="flex-1 ml-64">
            {/* NAVBAR */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <NavbarAdmin />
            </div>

        {/* Dashboard Content */}
        <div className="p-12 ml-4 pt-24">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Dashboard Admin
          </h1>

          {/* Statistik Ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-gray-500 text-sm font-semibold">
                Total Pelanggan
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {totalPelanggan}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-gray-500 text-sm font-semibold">
                Laundry Proses
              </h3>
              <p className="text-3xl font-bold text-yellow-500">
                {totalProses}
              </p>
            </div>
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-gray-500 text-sm font-semibold">
                Laundry Selesai
              </h3>
              <p className="text-3xl font-bold text-blue-600">{totalSelesai}</p>
            </div>
          </div>

          {/* Daftar Pelanggan */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Daftar Pelanggan
            </h2>

            {pelanggan.length === 0 ? (
              <p className="text-gray-500 text-center">Tidak ada data.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-green-500 text-white">
                    <tr>
                      <th className="px-4 py-2 border">Nama</th>
                      <th className="px-4 py-2 border">Layanan</th>
                      <th className="px-4 py-2 border">Berat (kg)</th>
                      <th className="px-4 py-2 border">Total Harga</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pelanggan.map((p) => (
                      <tr key={p.id} className="text-center hover:bg-gray-50">
                        <td className="border px-4 py-2">{p.namaPelanggan}</td>
                        <td className="border px-4 py-2">{p.jenisLayanan}</td>
                        <td className="border px-4 py-2">{p.berat}</td>
                        <td className="border px-4 py-2">
                          Rp {p.totalHarga?.toLocaleString("id-ID")}
                        </td>
                        <td className="border px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-white text-sm ${
                              p.status === "Selesai"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {p.status || "Proses"}
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(p.created_at).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 mt-10 text-sm">
            © {new Date().getFullYear()} Laundry Admin Dashboard
          </footer>
        </div>
      </div>
    </div>
  );
}
