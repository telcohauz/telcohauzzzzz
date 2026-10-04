import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PROVIDERS_INFO } from '../../data/telcoData.ts';

export function ProvidersPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Direktori Pembekal Rangkaian & Jenama</span>
        </div>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Ekosistem Telekomunikasi & Perkhidmatan Malaysia
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Direktori Pembekal Rangkaian & Jenama
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Ketahui latar belakang syarikat pembekal gentian optik, rangkaian selular 5G, televisyen satelit/striming, penapis air dan tenaga suria di Malaysia. TelcoHauz bertindak sebagai platform semakan dan pendaftaran bebas untuk kemudahan anda.
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROVIDERS_INFO.map((prov) => (
            <div
              key={prov.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md"
                      style={{ backgroundColor: prov.accentColor }}
                    >
                      {prov.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-lg leading-tight">{prov.name}</h2>
                      <span className="text-[11px] text-slate-400">{prov.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {prov.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Kawasan Liputan Utama:
                  </span>
                  <p className="text-xs text-slate-200">
                    {prov.coverageHighlight}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  *{prov.disclaimer}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <Link
                  to={`/products?provider=${encodeURIComponent(prov.name)}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Lihat Pelan ({prov.plansCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/eligibility?plan=${encodeURIComponent(prov.name)}`}
                  className="text-slate-400 hover:text-white font-medium"
                >
                  Semak Port
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency callout */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Ketelusan Hak Cipta & Perlesenan:</strong> Semua tanda dagang, logo syarikat dan nama produk yang tersenarai adalah hak milik mutlak pengendali yang berkenaan. Paparan di laman TelcoHauz adalah bertujuan memudahkan pengguna membuat perbandingan dan semakan ketersediaan perkhidmatan secara objektif.
          </div>
        </div>
      </div>
    </div>
  );
}
