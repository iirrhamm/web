import { signup } from '../loginAdmin/action'
import Link from 'next/link'

export default function SignupAdminPage({ searchParams }) {
  const message = searchParams?.message

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-600 to-purple-200">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-purple-100">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dsxte6o6s/image/upload/v1736059252/foto5_drbzgu.png"
            className="h-24 mb-3"
            alt="Sri Laundry Logo"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Laundry Mbak Suprih
          </h1>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">
          Signup Admin
        </h2>

        {/* PESAN */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm text-center mb-4">
            {message}
          </div>
        )}

        <form className="space-y-5" action={signup}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="Masukan Email"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-gray-700"
          >
            Daftar
          </button>
        </form>

        {/* LINK LOGIN */}
        <p className="text-center text-sm mt-4">
          Sudah punya akun?{' '}
          <Link href="/loginAdmin" className="text-blue-600 font-semibold hover:underline">
            Login di sini
          </Link>
        </p>

      </div>
    </div>
  )
}
