'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from './Supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // Membuat objek data yang berisi email dan password dari form input
  const data = {
    email: formData.get('email'), // Mengambil nilai email dari form
    password: formData.get('password'), // Mengambil nilai password dari form
  }

  // Melakukan proses login dengan email dan password menggunakan Supabase Auth
  // Mengembalikan error jika login gagal
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    if (error.message === 'Invalid login credentials') {
      redirect('/login?message=Email atau password salah')
    }
    redirect('/error')
  }

  // Memperbarui cache halaman untuk memastikan data terbaru ditampilkan
  revalidatePath('/', 'layout')
  // Mengarahkan pengguna ke halaman utama setelah berhasil login
  redirect('/')
}

export async function signup(formData) {
  // Membuat koneksi ke Supabase
  const supabase = await createClient()

  // Membuat objek data yang berisi email dan password dari form input
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // Melakukan proses pendaftaran dengan email dan password menggunakan Supabase Auth
  const { data: signUpData, error } = await supabase.auth.signUp(data)

  // Jika terjadi error saat pendaftaran, redirect ke halaman error
  if (error) {
    redirect('/error')
  }

  // Jika pendaftaran berhasil dan mendapatkan data user
  if (signUpData.user) {
    // Menambahkan role default 'user' ke database untuk user yang baru mendaftar
    const { error: roleError } = await supabase
      .from('roles')
      .insert({
        user_id: signUpData.user.id,
        role: 'user',
      })

    // Jika terjadi error saat menambahkan role, redirect ke halaman error
    if (roleError) {
      redirect('/error')
    }
  }

  // Mengecek jika email sudah terdaftar sebelumnya
  if (signUpData?.user?.identities?.length === 0) {
    redirect('/login?message=Email already registered')
  }

  // Jika semua proses berhasil, redirect ke halaman login dengan pesan untuk konfirmasi email
  redirect('/login?message=Check your email to confirm your account')
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
  redirect('/login')
}
