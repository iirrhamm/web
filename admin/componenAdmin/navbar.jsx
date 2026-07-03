'use client';

import { useRouter } from "next/navigation";

export default function NavbarAdmin() {
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-blue-400 via-grey-400 to-blue-300 shadow-md fixed w-full top-0 z-50 border-b border-purple-200">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo dan Brand */}
        <div className="flex items-center space-x-4">
          <img
            src="https://res.cloudinary.com/dds2w4rr8/image/upload/v1751098642/Screenshot_2025-06-28_150629-removebg-preview_o9fgmf.png"
            alt="Logo"
            className="h-12 w-auto drop-shadow-sm"
          />
          <span className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-gray-600 to-black-500">
            Admin Laundry Mbak Suprih
          </span>
        </div>

        {/* Navigasi Admin */}
        <div
          className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/admin/profilAdmin")}
        >
          <img
            src="https://res.cloudinary.com/dds2w4rr8/image/upload/v1751098642/Screenshot_2025-06-28_150629-removebg-preview_o9fgmf.png"
            alt="Profil Admin"
            className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-sm"
          />
          <span className="text-gray-900 font-semibold hover:text-pink-600 transition-colors duration-200">
            Admin 
          </span>
        </div>
      </div>
    </nav>
  );
}
