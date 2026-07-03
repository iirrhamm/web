"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";

export default function HistoryHapusPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ================= LOAD HISTORY =================
  const loadHistory = async () => {
    const { data, error } = await supabase
      .from("history_hapus_pelanggan")
      .select("*")
      .order("deleted_at", { ascending: false });

    if (error) {
      alert("Gagal memuat history");
      console.log(error);
    } else {
      setHistory(data);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.nama_pelanggan
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* HEADER */}
      
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold mb-5">
        History Hapus Pelanggan
      </h1>
        <button
          onClick={() => router.push("/admin/konfirmasi")}
          className="bg-blue-600 text-white ml-[65%] px-4 py-2 rounded hover:bg-blue-800"
        >
          ← Kembali ke Daftar Orderan
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari nama pelanggan..."
        className="w-full mb-5 px-3 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-900 text-sm">
          <thead className="bg-blue-400">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">No HP</th>
              <th className="border p-2">Layanan</th>
              <th className="border p-2">Berat</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Pembayaran</th>
              <th className="border p-2">Alasan</th>
              <th className="border p-2">Tanggal Hapus</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center p-4 text-gray-500"
                >
                  Tidak ada data history
                </td>
              </tr>
            ) : (
              filteredHistory.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >
                  <td className="border p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border p-2">
                    {item.nama_pelanggan}
                  </td>
                  <td className="border p-2">
                    {item.no_hp}
                  </td>
                  <td className="border p-2">
                    {item.layanan}
                  </td>
                  <td className="border p-2 text-center">
                    {item.berat} kg
                  </td>
                  <td className="border p-2">
                    Rp{" "}
                    {item.total_harga?.toLocaleString(
                      "id-ID"
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <span
                      className={`font-bold ${
                        item.status_pembayaran === "Lunas"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.status_pembayaran}
                    </span>
                  </td>
                  <td className="border p-2">
                    {item.alasan}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(
                      item.deleted_at
                    ).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
