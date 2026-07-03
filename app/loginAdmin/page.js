import { login } from './action'
import Link from 'next/link'

export default function AdminLoginPage({ searchParams }) {
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
          Login Admin
        </h2>

        {/* PESAN */}
        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center mb-4">
            {message}
          </div>
        )}

        <form className="space-y-5" action={login}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@srilaundry.com"
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
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* LINK SIGNUP */}
        <p className="text-center text-sm mt-4">
          Belum punya akun?{' '}
          <Link href="/signupAdmin" className="text-blue-600 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>

      </div>
    </div>
  )
}
