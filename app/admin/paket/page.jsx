"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import SidebarAdmin from "../componenAdmin/sidebar";
import NavbarAdmin from "../componenAdmin/navbar";

export default function PaketLaundryPage() {
  const [paket, setPaket] = useState([]);
  const [form, setForm] = useState({ nama: "", harga: "", deskripsi: "", gambar: "" });
  const [editingId, setEditingId] = useState(null); // Menyimpan id paket yang sedang diedit

  const loadPaket = async () => {
    const { data, error } = await supabase
      .from("paketLaundri")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.log(error);
    else setPaket(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { data, error } = await supabase.from("paketLaundri").insert([form]);
    if (error) return alert("Gagal tambah paket: " + error.message);
    setForm({ nama: "", harga: 0, deskripsi: "", gambar: "" });
    loadPaket();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus paket ini?")) return;
    const { error } = await supabase.from("paketLaundri").delete().eq("id", id);
    if (error) return alert("Gagal hapus: " + error.message);
    loadPaket();
  };

  const handleEdit = (p) => {
    setForm({ nama: p.nama, harga: p.harga, deskripsi: p.deskripsi, gambar: p.gambar });
    setEditingId(p.id);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("paketLaundri")
      .update(form)
      .eq("id", editingId);

    if (error) return alert("Gagal update: " + error.message);
    setForm({ nama: "", harga: 0, deskripsi: "", gambar: "" });
    setEditingId(null);
    loadPaket();
  };

  useEffect(() => {
    loadPaket();
  }, []);

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
      <h1 className="text-2xl font-bold px-16 pt-24 ">Daftar Paket / Layanan</h1>

      {/* Form tambah / edit paket */}
      <div className="mb-5 ml-12 pt-4 border p-4 rounded ">
        <input
          type="text"
          name="nama"
          placeholder="Nama Paket/Layanan"
          value={form.nama}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="harga"
          placeholder="Harga per Kg"
          value={form.harga}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="gambar"
          placeholder="URL Gambar"
          value={form.gambar}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />

        {editingId ? (
          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Paket
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah Paket
          </button>
        )}
      </div>

      {/* Tabel paket */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 ml-12">
        {paket.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-bold text-lg">{p.nama}</h2>
            <p><strong>Harga per Kg:</strong> Rp {p.harga?.toLocaleString("id-ID")}</p>
            <p><strong>Deskripsi:</strong> {p.deskripsi}</p>
            {p.gambar && <img src={p.gambar} alt={p.nama} className="w-full h-32 object-cover mt-2 rounded" />}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
