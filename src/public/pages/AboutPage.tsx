import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileCheck,
  ChevronRight,
  Award,
  Layers,
  Search,
  Check
} from 'lucide-react';
import { TELCOHAUZ_BUSINESS } from '../../data/telcoData.ts';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Mengenai TelcoHauz</span>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Identiti Rasmi & Model Operasi Perniagaan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Pusat Sehenti Perbandingan & Bantuan Permohonan Telco Malaysia
          </h1>

          <p className="text-base text-cyan-300 font-semibold tracking-wide">
            "{TELCOHAUZ_BUSINESS.tagline}"
          </p>
        </div>

        {/* Story & Positioning Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Peranan & Fokus Perniagaan TelcoHauz
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              Di Malaysia, pengguna berdepan dengan pelbagai tawaran telekomunikasi dan utiliti rumah yang rumit—merangkumi sambungan <strong>Fibre Internet</strong>, <strong>Business Fibre</strong>, <strong>5G & Wireless Broadband</strong>, <strong>Pelan Mobile Postpaid</strong>, <strong>Astro & Hiburan TV</strong>, <strong>Penapis Air (Water Purifiers)</strong>, <strong>Peralatan Rumah (Home Appliances)</strong>, <strong>Tenaga Suria (Solar)</strong>, dan <strong>Perkhidmatan Digital</strong>.
            </p>
            <p>
              <strong>{TELCOHAUZ_BUSINESS.brand}</strong> (dikendalikan secara sah di Malaysia oleh entiti berdaftar <strong>{TELCOHAUZ_BUSINESS.businessName}</strong>) bertindak sebagai platform perbandingan objektif dan konsultasi pendaftaran bebas. Matlamat komersial kami adalah membantu pelanggan menemui pakej terbaik, menyemak kelayakan liputan teknikal secara telus, dan membimbing pendaftaran permohonan hingga selesai.
            </p>
            <p>
              Katalog kami merangkumi maklumat pakej daripada pembekal utama negara seperti <em>TIME, Unifi (TM), Maxis, CelcomDigi, ALLO, U Mobile, YES, Astro, Cuckoo, Coway, LG PuriCare, Khind, Verdant Solar, KSIT, Eastel,</em> dan <em>InNET</em> tanpa sebarang berat sebelah atau tokokan harga tersembunyi.
            </p>
          </div>
        </div>

        {/* 5-Step Commercial Business Model */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
              Aliran Bantuan TelcoHauz
            </span>
            <h2 className="text-xl font-bold text-white">
              Model Perjalanan Pengguna: Discover → Compare → Check → Contact → Apply
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {TELCOHAUZ_BUSINESS.applicationModel.map((step) => (
              <div key={step.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold flex items-center justify-center text-xs">
                  0{step.step}
                </div>
                <h3 className="font-bold text-white text-xs leading-snug">{step.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-blue-950/40 border border-blue-900/50 rounded-xl text-xs text-blue-300 leading-relaxed">
            <strong>Penjelasan Integriti Permohonan:</strong> Laman web TelcoHauz tidak membuat dakwaan palsu bahawa permohonan telah dihantar terus ke pembekal melainkan integrasi penyerahan dokumen sah telah diselesaikan bersama perunding. TelcoHauz mendokumentasikan snapshot permohonan pelanggan untuk jaminan rujukan.
          </div>
        </div>

        {/* 4 Pillars of Integrity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Objektif & Bebas</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kami tidak terikat untuk mempromosikan satu jenama secara eksklusif. Cadangan kami berasaskan ketersediaan port sebenar, keperluan bajet, dan kestabilan rangkaian di lokasi kediaman anda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Sifar Tokok Harga (No Fake Prices)</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Semua harga pakej, yuran bulanan dan rebat promosi adalah 100% selari dengan kadar rasmi pembekal perkhidmatan. Tiada sebarang bayaran tambahan atau caj tersembunyi dikenakan kepada pemohon.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Bimbingan Perunding Berpengalaman</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pengguna dibimbing langkah demi langkah oleh perunding tempatan menerusi WhatsApp bagi memudahkan proses semakan baki port, pertukaran MNP, dan jadual temujanji pemasangan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Kepatuhan Privasi & PDPA 2010</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Semua dokumen pendaftaran dan maklumat premis diuruskan secara sulit dan teratur mengikut peruntukan Akta Perlindungan Data Peribadi 2010 (PDPA) semata-mata untuk urusan pendaftaran akaun.
            </p>
          </div>
        </div>

        {/* Business Entity Transparency Box - Verified SSM Records Only */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Profil Entiti Perniagaan (Verified SSM Record)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">Nama Perniagaan Berdaftar</span>
              <strong className="text-white text-sm block mt-0.5">{TELCOHAUZ_BUSINESS.businessName}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">No. Pendaftaran Perniagaan (SSM)</span>
              <strong className="text-cyan-300 font-mono text-sm block mt-0.5">{TELCOHAUZ_BUSINESS.registrationNumber}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">Bidang Tumpuan Komersial</span>
              <strong className="text-white text-xs block mt-0.5">
                Telekomunikasi, Internet Fibre, Mobile 5G, Astro TV, Penapis Air, Peralatan Rumah, Tenaga Solar & Servis Digital
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">Saluran Hotline / WhatsApp</span>
              <a
                href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-mono text-sm block mt-0.5 font-bold"
              >
                {TELCOHAUZ_BUSINESS.verifiedPhone}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">Alamat Pendaftaran SSM</span>
              <span className="text-slate-300 text-xs block mt-0.5">{TELCOHAUZ_BUSINESS.registeredAddress}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block font-medium">Premis Operasi</span>
              <span className="text-slate-300 text-xs block mt-0.5">{TELCOHAUZ_BUSINESS.operatingAddress}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
            <strong>Penafian Tanda Dagang & Hak Cipta:</strong> TelcoHauz BUKAN syarikat pembekal rangkaian telekomunikasi berlesen (licensed network operator) atau pemilik jenama-jenama telekomunikasi pihak ketiga. Segala logo, tanda dagang, dan nama produk adalah hak cipta pemilik masing-masing dan digunakan semata-mata untuk tujuan perbandingan objektif dan kemudahan pendaftaran pelanggan.
          </p>
        </div>

        {/* Action Callout */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold text-white">Sedia Untuk Menjimatkan Bil Internet & Utiliti Rumah?</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 hover:scale-105 transition-transform"
            >
              Lihat Katalog Pakej
            </Link>
            <Link
              to="/eligibility"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:scale-105 transition-transform"
            >
              Semak Kelayakan Liputan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
