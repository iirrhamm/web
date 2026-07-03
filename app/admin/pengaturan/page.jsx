"use client";

import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import SidebarAdmin from "../componenAdmin/sidebar";
import NavbarAdmin from "../componenAdmin/navbar";

export default function PengaturanPage() {
  const [form, setForm] = useState({
    nama_laundry: "",
    alamat: "",
    no_hp: "",
  });
  const [loading, setLoading] = useState(false);

  // Load pengaturan
  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pengaturan")
      .select("*")
      .eq("id", 1)
      .single();
    if (!error && data) {
      setForm({
        nama_laundry: data.nama_laundry || "",
        alamat: data.alamat || "",
        no_hp: data.no_hp || "",
      });
    }
    setLoading(false);
  };

  // Simpan pengaturan
  const simpan = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("pengaturan")
      .upsert([{ id: 1, ...form }], { onConflict: "id" });
    if (error) alert("Gagal menyimpan: " + error.message);
    else alert("Pengaturan berhasil disimpan!");
    setLoading(false);
    loadSettings();
  };

  useEffect(() => {
    loadSettings();
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

        {/* ISI HALAMAN */}
        <div className="pt-24 px-12">
          <h1 className="text-2xl font-bold mb-6">
            Pengaturan Admin
          </h1>
      <form className="py-2 space-y-4 w-4/4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Nama Laundry"
          value={form.nama_laundry}
          onChange={(e) => setForm({ ...form, nama_laundry: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Alamat"
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="No HP"
          value={form.no_hp}
          onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={simpan}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
      </div>
      </div>
    </div>
  );
}
