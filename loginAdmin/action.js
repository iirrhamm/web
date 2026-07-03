'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/Supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // Membuat objek data yang berisi email dan password dari form input
  const data = {
    email: formData.get('email'),   // Mengambil nilai email dari form
    password: formData.get('password'), // Mengambil nilai password dari form
  }

  // Melakukan proses login dengan email dan password menggunakan Supabase Auth
  // Mengembalikan error jika login gagal
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    if (error.message === 'Invalid login credentials') {
      redirect('/loginAdmin?message=Email atau password salah')
    }
    redirect('/error')
  }

  // Memperbarui cache halaman untuk memastikan data terbaru ditampilkan
  revalidatePath('/', 'layout')
  // Mengarahkan pengguna ke halaman utama setelah berhasil login
  redirect('/admin/profilAdmin')
}

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data)

  // Jika gagal signup
  if (error) {
    redirect('/loginAdmin?message=Gagal mendaftar, email mungkin sudah terdaftar')
  }

  // ❗ (Catatan) Insert role tetap seperti kode kamu
  if (signUpData.user) {
    const { error: roleError } = await supabase
      .from('roles')
      .insert({
        user_id: signUpData.user.id,
        role: 'admin',
      })

    if (roleError) {
      redirect('/loginAdmin?message=Akun berhasil dibuat, tetapi gagal menyimpan role')
    }
  }

  // Jika signup berhasil
  redirect('/signupAdmin?message=Pendaftaran berhasil. Silakan login menggunakan akun Anda')
}

export async function signout() {
  // Membuat koneksi ke Supabase
  const supabase = await createClient()

  // Melakukan proses logout menggunakan Supabase Auth
  const { error } = await supabase.auth.signOut()

  // Jika terjadi error saat logout, redirect ke halaman error
  if (error) {
    redirect('/error')
  }

  // Memperbarui cache halaman
  revalidatePath('/', 'layout')
  // Mengarahkan pengguna ke halaman login setelah logout
  redirect('/loginAdmin')
}