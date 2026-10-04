import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
          <HelpCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-4xl sm:text-6xl font-black text-white font-mono block">404</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">Halaman Tidak Ditemui</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Maaf, halaman yang anda cuba akses tidak wujud atau telah dialihkan ke alamat baharu.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Laman Utama</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs"
          >
            <Search className="w-4 h-4" />
            <span>Cari Produk Telco</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
