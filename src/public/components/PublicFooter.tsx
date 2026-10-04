import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Mail, MapPin, ShieldCheck, ArrowRight, Database, ExternalLink } from 'lucide-react';
import { TELCOHAUZ_BUSINESS, QUICK_CATEGORIES } from '../../data/telcoData.ts';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Pre-footer Call to Action */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Bantuan Pendaftaran Percuma
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Belum Pasti Pakej Mana Paling Sesuai?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Perunding TelcoHauz sedia membantu semakan port gentian optik, baki kuota dan memadankan tawaran promosi pembekal terbaik untuk premis anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/eligibility"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Semak Kelayakan Liputan</span>
            </Link>

            <a
              href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
                'Salam TelcoHauz, saya ingin bertanyakan tentang semakan liputan internet dan pakej paling sesuai.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Perunding</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Verified Entity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white font-black text-lg">
                TH
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Telco<span className="text-cyan-400">Hauz</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              <strong>{TELCOHAUZ_BUSINESS.businessName}</strong> (No. Pendaftaran SSM: <span className="font-mono text-cyan-300">{TELCOHAUZ_BUSINESS.registrationNumber}</span>) merupakan platform perbandingan objektif dan perundingan pendaftaran bebas untuk pengguna di Malaysia.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Hotline & WhatsApp:</span>
                  <a
                    href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-cyan-400 hover:underline font-semibold"
                  >
                    {TELCOHAUZ_BUSINESS.verifiedPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Emel Rasmi:</span>
                  <span className="text-slate-300">{TELCOHAUZ_BUSINESS.verifiedEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Alamat Pendaftaran SSM:</span>
                  <span className="text-slate-300 block text-[11px]">{TELCOHAUZ_BUSINESS.registeredAddress}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Operasi: {TELCOHAUZ_BUSINESS.operatingAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Categories (9 Official Categories) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Kategori Produk
            </h4>
            <ul className="space-y-2 text-xs">
              {QUICK_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Journey & Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Fungsi & Perkhidmatan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-cyan-400 transition-colors">
                  Katalog Semua Produk
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-cyan-400 transition-colors">
                  Promosi & Rebat Terkini
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-400 transition-colors">
                  Bandingkan Pelan (Compare)
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-cyan-400 transition-colors">
                  Semak Kelayakan Liputan
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="hover:text-cyan-400 transition-colors">
                  Smart Plan Finder (AI)
                </Link>
              </li>
              <li>
                <Link to="/providers" className="hover:text-cyan-400 transition-colors">
                  Direktori Pembekal
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-cyan-400 transition-colors">
                  Berita & Industri Telco
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-cyan-400 transition-colors">
                  Panduan Pengguna
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Korporat & Dasar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  Tentang TelcoHauz
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                  Dasar Privasi (PDPA 2010)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                  Terma & Syarat
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-cyan-400 transition-colors">
                  Penafian Hak Bebas
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/audit"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40"
                >
                  <Database className="w-3.5 h-3.5" />
                  Portal Audit & Rekod
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] leading-relaxed text-slate-400 space-y-2">
            <p>
              <strong>Penafian Bebas (Independent Service Disclaimer):</strong> TelcoHauz (dikendalikan oleh <em>TelcoHauz Phone Enterprise</em>) adalah platform maklumat, perbandingan objektif dan perundingan pendaftaran bebas. TelcoHauz BUKAN syarikat pembekal rangkaian telekomunikasi rasmi (licensed telco operator) atau pemilik jenama-jenama yang dipaparkan. Segala tanda dagang, logo dan nama produk (termasuk Unifi, TIME, Maxis, CelcomDigi, ALLO, U Mobile, YES, Astro, Cuckoo, Coway, LG PuriCare, Khind, Verdant Solar, KSIT, Eastel, InNET) adalah hak milik sah syarikat pemilik masing-masing dan digunakan di laman ini semata-mata untuk tujuan rujukan, perbandingan objektif dan kemudahan pendaftaran pengguna.
            </p>
            <p>
              Harga pakej, rebat, tawaran kelajuan dan promosi yang dinyatakan adalah tertakluk kepada pengesahan pembekal semasa dan boleh berubah tanpa notis terlebih dahulu. Pengesahan akhir liputan port dan kelayakan tertakluk kepada semakan teknikal di premis pemasangan.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              © {currentYear} {TELCOHAUZ_BUSINESS.businessName} (SSM: {TELCOHAUZ_BUSINESS.registrationNumber}). Hak Cipta Terpelihara.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-slate-300">Privasi</Link>
              <Link to="/terms" className="hover:text-slate-300">Terma</Link>
              <Link to="/disclaimer" className="hover:text-slate-300">Penafian</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
