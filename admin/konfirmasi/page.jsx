"use client";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import SidebarAdmin from "../componenAdmin/sidebar";
import NavbarAdmin from "../componenAdmin/navbar";

export default function KonfirmasiPage() {
  const [orderan, setOrderan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pengaturan, setPengaturan] = useState({
    nama_laundry: "Laundry Mbak Suprih",
    alamat: "Jl. Brigjen Katamso No. 7",
    no_hp: "08123456789",
  });

  // ================= LOAD PENGATURAN =================
  const loadPengaturan = async () => {
    const { data } = await supabase
      .from("pengaturan")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) setPengaturan(data);
  };

  // ================= LOAD DATA PELANGGAN =================
  const loadData = async () => {
    const { data, error } = await supabase
      .from("pelanggan")
      .select(`*, paket:jenisLayanan(nama)`)
      .order("id", { ascending: true });

    if (!error) setOrderan(data);
  };

  // ================= UPDATE STATUS + WA =================
  const handleUpdateStatus = async (item, statusBaru) => {
    const {
      id,
      noHp,
      namaPelanggan,
      paket,
      berat,
      hargaPerKg,
      totalHarga,
      tanggalTerima,
      tanggalSelesai,
      statusPembayaran,
    } = item;

    if (statusBaru === "Selesai") {
      const { error } = await supabase
        .from("pelanggan")
        .update({
          status: "Selesai",
          tanggalSelesai: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) return alert("Gagal update status");
      await loadData();
    }

    const { nama_laundry, alamat } = pengaturan;
    const jenisLayananNama = paket?.nama || "-";

    let pesan = "";

    if (statusBaru === "Proses") {
      pesan = `${nama_laundry}
${alamat}

Pelanggan Yth:
${namaPelanggan}
Tanggal Terima : ${tanggalTerima || "-"}
Tanggal Selesai : ${tanggalSelesai || "-"}

Detail Pesanan:
Layanan:
${jenisLayananNama}, 
Harga Perkg : ${hargaPerKg},
Berat : ${berat} KG, 
Total: Rp${totalHarga?.toLocaleString("id-ID")}

Status Pembayaran:
${statusPembayaran}

Terima kasih`;
    }

    if (statusBaru === "Selesai") {
      pesan = `✨ Laundry Anda telah selesai ✨

Silakan diambil di:
${alamat}

Status Pembayaran:
${statusPembayaran}

Terima kasih 🙏`;
    }

    const noWa = noHp.replace(/^0/, "62");
    window.open(
      `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`,
      "_blank"
    );

    await supabase.from("notifikasiwa").insert([
      { pelangganid: id, nohp: noHp, status: statusBaru, pesan },
    ]);
  };

  // ================= UPDATE PEMBAYARAN =================
  const updatePembayaran = async (item, status) => {
    const { error } = await supabase
      .from("pelanggan")
      .update({ statusPembayaran: status })
      .eq("id", item.id);

    if (!error) {
      await loadData();
      alert("Status pembayaran diperbarui");
    }
  };

  // ================= HAPUS + HISTORY =================
  const handleDelete = async (item) => {
    const alasan = prompt(
      "Masukkan alasan penghapusan data pelanggan:",
      "Pesanan Slesai"
    );
    if (!alasan) return;

    // 1️⃣ Simpan ke history
    const { error: historyError } = await supabase
      .from("history_hapus_pelanggan")
      .insert([
        {
          pelanggan_id: item.id,
          nama_pelanggan: item.namaPelanggan,
          no_hp: item.noHp,
          layanan: item.paket?.nama || "-",
          berat: item.berat,
          total_harga: item.totalHarga,
          tanggal_terima: item.tanggalTerima,
          tanggal_selesai: item.tanggalSelesai,
          status_pembayaran: item.statusPembayaran,
          alasan: alasan,
        },
      ]);

    if (historyError) {
      alert("Gagal menyimpan history penghapusan");
      return;
    }

    // 2️⃣ Hapus dari tabel pelanggan
    const { error } = await supabase
      .from("pelanggan")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert("Gagal menghapus data pelanggan");
    } else {
      await loadData();
      alert("Data pelanggan dihapus & tersimpan di history");
    }
  };

  useEffect(() => {
    loadPengaturan();
    loadData();
  }, []);

  const filteredOrderan = orderan.filter((item) =>
    item.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between mb-5 ml-16 pt-24">
        <h1 className="text-2xl font-bold ">Daftar Orderan</h1>
          <a href="/admin/historyhapus" className="bg-blue-600 text-white px-4 py-2 mr-4 rounded  hover:bg-blue-800">Lihat History Hapus Orderan</a>
      </div>  
      <input
        className="w-[94%] ml-16 mb-5 px-3 py-2 border rounded"
        placeholder="Cari nama pelanggan..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-4 ml-12">
        {filteredOrderan.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-bold text-xl">{item.namaPelanggan}</h2>

            <p className="text-sm"><strong>Layanan :</strong> {item.paket?.nama}</p>
            <p className="text-sm"><strong>Harga Perkg :</strong> {item.hargaPerKg}</p>
            <p className="text-sm"><strong>Berat :</strong> {item.berat} kg</p>
            <p className="text-sm"><strong>Total :</strong> Rp {item.totalHarga?.toLocaleString("id-ID")}</p>

            <p className="text-sm"><strong>Tanggal Terima :</strong>{" "}
              {item.tanggalTerima
                ? new Date(item.tanggalTerima).toLocaleDateString("id-ID")
                : "-"}
            </p>

            <p className="text-sm"><strong>Tanggal Selesai :</strong>{" "}
              {item.tanggalSelesai
                ? new Date(item.tanggalSelesai).toLocaleDateString("id-ID")
                : "-"}
            </p>

            <p className="text-sm">
              <strong>Pembayaran :</strong>{" "}
              <span className={`font-bold ${
                item.statusPembayaran === "Lunas"
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
                {item.statusPembayaran}
              </span>
            </p>

            <div className=" mt-1 text-sm m flex gap-2 flex-wrap">
              {item.statusPembayaran !== "Lunas" && (
                <button
                  onClick={() => updatePembayaran(item, "Lunas")}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Tandai Lunas
                </button>
              )}

              {/* {item.statusPembayaran !== "Belum Lunas" && (
                <button
                  onClick={() => updatePembayaran(item, "Belum Lunas")}
                  className="bg-red-500 text-white px-3 py-1 rounded  hover:bg-red-700"
                >
                  Belum Lunas
                </button>
              )} */}

              <button
                onClick={() => handleDelete(item)}
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Hapus
              </button>
            </div>

            <p className="mt-1 text-sm"><strong>Status :</strong> {item.status}</p>

            <div className="mt-1 flex gap-2 flex-wrap">
              {item.status === "Proses" && (
                <button
                  onClick={() => handleUpdateStatus(item, "Proses")}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-700"
                >
                  Kirim WA Diproses
                </button>
              )}

              {item.status !== "Selesai" && (
                <button
                  onClick={() => handleUpdateStatus(item, "Selesai")}
                  className="bg-green-500 text-white px-3 py-1 rounded  hover:bg-green-700"
                >
                  Tandai Selesai & WA
                </button>
              )}

              {item.status === "Selesai" && (
                <span className="font-bold text-gray-600">Selesai ✔</span>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
