"use client";

import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import NavbarAdmin from "../componenAdmin/navbar";
import SidebarAdmin from "../componenAdmin/sidebar";

export default function FormTambahPelanggan() {
  const [formData, setFormData] = useState({
    id: null,
    namaPelanggan: "",
    noHp: "",
    alamat: "",
    jenisLayanan: "",
    berat: "",
    hargaPerKg: "",
    totalHarga: "",
    status: "Proses",
    statusPembayaran: "Belum Lunas",
    tanggalTerima: "",
    tanggalSelesai: "",
  });

  const [pelangganList, setPelangganList] = useState([]);
  const [paketList, setPaketList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const ambilPelanggan = async () => {
    const { data, error } = await supabase
      .from("pelanggan")
      .select(`
        *,
        paket:jenisLayanan(id, nama, harga)
      `)
      .order("id", { ascending: true });

    if (error) console.error("Gagal memuat data pelanggan:", error.message);
    else setPelangganList(data);
  };

  const ambilPaket = async () => {
    const { data, error } = await supabase
      .from("paketLaundri")
      .select("id, nama, harga")
      .order("id", { ascending: true });

    if (error) console.error("Gagal memuat data paket:", error.message);
    else setPaketList(data);
  };

  useEffect(() => {
    ambilPelanggan();
    ambilPaket();
  }, []);

  useEffect(() => {
    const selectedPaket = paketList.find(
      (p) => p.id === parseInt(formData.jenisLayanan)
    );
    if (selectedPaket) {
      const harga = selectedPaket.harga;
      const total = parseFloat(formData.berat || 0) * harga;
      setFormData((prev) => ({
        ...prev,
        hargaPerKg: harga,
        totalHarga: total,
      }));
    }
  }, [formData.jenisLayanan, formData.berat, paketList]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // 🔥 aktifkan autocomplete saat ketik nama
  if (name === "namaPelanggan") {
    cariPelangganLama(value);
  }
};


  const resetForm = () => {
    setFormData({
      id: null,
      namaPelanggan: "",
      noHp: "",
      alamat: "",
      jenisLayanan: "",
      berat: "",
      hargaPerKg: "",
      totalHarga: "",
      status: "Proses",
      statusPembayaran: "Belum Lunas", // <-- RESET
      tanggalTerima: "",
      tanggalSelesai: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, ...pelangganData } = formData;

    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("pelanggan")
          .update(pelangganData)
          .eq("id", id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("pelanggan")
          .insert([pelangganData]);
        error = insertError;
      }

      if (error) {
        alert("Gagal menyimpan data: " + error.message);
      } else {
        await ambilPelanggan();
        resetForm();
        alert(isEditing ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleEdit = (pelanggan) => {
    setFormData({
      id: pelanggan.id,
      namaPelanggan: pelanggan.namaPelanggan,
      noHp: pelanggan.noHp,
      alamat: pelanggan.alamat,
      jenisLayanan: pelanggan.jenisLayanan?.toString() || "",
      berat: pelanggan.berat,
      hargaPerKg: pelanggan.hargaPerKg,
      totalHarga: pelanggan.totalHarga,
      status: pelanggan.status,
      statusPembayaran: pelanggan.statusPembayaran || "Belum Lunas", // <-- DITAMBAHKAN
      tanggalTerima: pelanggan.tanggalTerima,
      tanggalSelesai: pelanggan.tanggalSelesai,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus data pelanggan ini?")) {
      const { error } = await supabase.from("pelanggan").delete().eq("id", id);
      if (!error) ambilPelanggan();
    }
  };

  const filteredPelanggan = pelangganList.filter((p) =>
    p.namaPelanggan.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // 🔍 Cari pelanggan lama berdasarkan nama
const cariPelangganLama = (nama) => {
  if (!nama) {
    setSuggestions([]);
    return;
  }

  const hasil = pelangganList.filter((p) =>
    p.namaPelanggan.toLowerCase().includes(nama.toLowerCase())
  );

  setSuggestions(hasil.slice(0, 5));
};

// ✅ Saat pelanggan lama dipilih
const pilihPelangganLama = (pelanggan) => {
  setFormData((prev) => ({
    ...prev,
    namaPelanggan: pelanggan.namaPelanggan,
    noHp: pelanggan.noHp,
    alamat: pelanggan.alamat,
  }));

  setSuggestions([]);
};


  

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

        <main className="mt-20 px-8">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow-lg bg-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isEditing ? "Edit Data Pelanggan" : "Tambah Orderan"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <InputField
                    label="Nama Pelanggan"
                    name="namaPelanggan"
                    value={formData.namaPelanggan}
                    onChange={handleChange}
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded shadow">
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => pilihPelangganLama(p)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <strong>{p.namaPelanggan}</strong>
                          <div className="text-xs text-gray-500">
                            {p.noHp} • {p.alamat}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <InputField label="Nomor HP" name="noHp" value={formData.noHp} onChange={handleChange}  />

                <TextareaField label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} />

                <SelectField
                  label="Jenis Layanan"
                  name="jenisLayanan"
                  value={formData.jenisLayanan}
                  onChange={handleChange}
                  options={paketList.map((p) => ({ value: p.id, label: p.nama }))}
                />

                <InputField label="Berat Cucian (Kg)" name="berat" type="number" value={formData.berat} onChange={handleChange} />

                <InputField label="Harga per Kg (Rp)" name="hargaPerKg" type="number" value={formData.hargaPerKg} readOnly />

                <InputField label="Total Harga (Rp)" name="totalHarga" type="number" value={formData.totalHarga} readOnly />

                <InputField label="Tanggal Terima" name="tanggalTerima" type="date" value={formData.tanggalTerima} onChange={handleChange} />

                <InputField label="Tanggal Selesai" name="tanggalSelesai" type="date" value={formData.tanggalSelesai} onChange={handleChange} />

                {/* STATUS PEMBAYARAN */}
                <SelectField
                  label="Status Pembayaran"
                  name="statusPembayaran"
                  value={formData.statusPembayaran}
                  onChange={handleChange}
                  options={[
                    { value: "Lunas", label: "Lunas" },
                    { value: "Belum Lunas", label: "Belum Lunas" },
                  ]}
                />
              </div>

              <button type="submit" className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600">
                {isEditing ? "Update Data" : "Tambah Pelanggan"}
              </button>
            </form>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Daftar Pelanggan</h2>
              <input
                type="text"
                placeholder="Cari nama..."
                className="border px-4 py-2 rounded-lg w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredPelanggan.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Tidak ada pelanggan ditemukan.</p>
            ) : (
              <ul className="space-y-4">
                {filteredPelanggan.map((pelanggan) => (
                  <li key={pelanggan.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-40">
                    <div>
                      <p className="font-semibold text-gray-800">{pelanggan.namaPelanggan}</p>
                      <p className="text-sm text-gray-800">HP : {pelanggan.noHp}</p>
                      <p className="text-sm text-gray-800">Layanan : {pelanggan.paket?.nama}</p>
                      <p className="text-sm text-gray-800">Berat : {pelanggan.berat} Kg</p>
                      <p className="text-sm text-gray-800">Tanggal Terima : {pelanggan.tanggalTerima}</p>
                      <p className="text-sm text-gray-800">Tanggal Slesai : {pelanggan.tanggalSelesai}</p>
                      <p className="text-sm text-gray-800">Total : Rp {pelanggan.totalHarga?.toLocaleString("id-ID")}</p>

                      {/* TAMPILKAN STATUS PEMBAYARAN */}
                      <p className="text-sm">
                        Pembayaran:{" "}
                        <span
                          className={
                            pelanggan.statusPembayaran === "Lunas"
                              ? "text-green-600 font-semibold"
                              : "text-red-500 font-semibold"
                          }
                        >
                          {pelanggan.statusPembayaran}
                        </span>
                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          pelanggan.status === "Selesai" ? "text-green-600" : "text-yellow-500"
                        }`}
                      >
                        Status Order: {pelanggan.status}
                      </p>
                    </div>

                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(pelanggan)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(pelanggan.id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// -------------------- KOMPONEN INPUT --------------------
function InputField({ label, name, value, onChange, type = "text", readOnly = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full p-3 border rounded-lg ${readOnly ? "bg-gray-200" : "bg-white"}`}
        required={!readOnly}
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full p-3 border rounded-lg bg-white text-gray-700"
        required
      ></textarea>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full p-3 border rounded-lg bg-white text-gray-700"
        required
      >
        <option value="">-- Pilih --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
