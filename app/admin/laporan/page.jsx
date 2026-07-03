"use client";

import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import NavbarAdmin from "../componenAdmin/navbar";
import SidebarAdmin from "../componenAdmin/sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LaporanPemasukan() {
  const [laporanHarian, setLaporanHarian] = useState([]);
  const [laporanBulanan, setLaporanBulanan] = useState([]);

  const ambilLaporan = async () => {
    const { data, error } = await supabase
      .from("pelanggan")
      .select("created_at, totalHarga, status");

    if (error) {
      console.error("Gagal ambil data:", error.message);
      return;
    }

    // 🔹 Filter hanya status "Selesai"
    const selesai = data.filter((item) => item.status === "Selesai");

    // 🔹 Kelompokkan berdasarkan tanggal (harian)
    const harian = selesai.reduce((acc, curr) => {
      const tanggal = new Date(curr.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!acc[tanggal]) acc[tanggal] = 0;
      acc[tanggal] += curr.totalHarga;
      return acc;
    }, {});

    const hasilHarian = Object.entries(harian).map(([tanggal, total]) => ({
      tanggal,
      total,
    }));
    setLaporanHarian(hasilHarian);

    // 🔹 Kelompokkan berdasarkan bulan (bulanan)
    const bulanan = selesai.reduce((acc, curr) => {
      const bulan = new Date(curr.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      });
      if (!acc[bulan]) acc[bulan] = 0;
      acc[bulan] += curr.totalHarga;
      return acc;
    }, {});

    const hasilBulanan = Object.entries(bulanan).map(([bulan, total]) => ({
      bulan,
      total,
    }));
    setLaporanBulanan(hasilBulanan);
  };

  useEffect(() => {
    ambilLaporan();
  }, []);

  const COLORS = [
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#F87171",
    "#A78BFA",
    "#FB923C",
    "#4ADE80",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      <SidebarAdmin />
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin />
      </div>

      <div className="flex-1 py-2 ml-72 mt-20 p-8">
        {/* =================== 📅 LAPORAN HARIAN =================== */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Laporan Pemasukan Harian
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {laporanHarian.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={laporanHarian}
                  dataKey="total"
                  nameKey="tanggal"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ tanggal, total }) =>
                    `${tanggal} (${total.toLocaleString("id-ID")})`
                  }
                >
                  {laporanHarian.map((entry, index) => (
                    <Cell
                      key={`cell-harian-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Belum ada data pemasukan harian
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <table className="min-w-full border text-gray-700">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-4 py-2 text-left">Tanggal</th>
                <th className="border px-4 py-2 text-left">
                  Total Pemasukan (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {laporanHarian.length > 0 ? (
                laporanHarian.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.tanggal}</td>
                    <td className="border px-4 py-2 font-semibold">
                      Rp {item.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    Belum ada data pemasukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================== 📆 LAPORAN BULANAN =================== */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Laporan Pemasukan Bulanan
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {laporanBulanan.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={laporanBulanan}
                  dataKey="total"
                  nameKey="bulan"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ bulan, total }) =>
                    `${bulan} (${total.toLocaleString("id-ID")})`
                  }
                >
                  {laporanBulanan.map((entry, index) => (
                    <Cell
                      key={`cell-bulan-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Belum ada data pemasukan bulanan
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="min-w-full border text-gray-700">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-4 py-2 text-left">Bulan</th>
                <th className="border px-4 py-2 text-left">
                  Total Pemasukan (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {laporanBulanan.length > 0 ? (
                laporanBulanan.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.bulan}</td>
                    <td className="border px-4 py-2 font-semibold">
                      Rp {item.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    Belum ada data pemasukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
