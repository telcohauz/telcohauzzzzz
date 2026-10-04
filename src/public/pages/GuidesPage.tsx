import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ArrowRight, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { CONSUMER_GUIDES } from '../../data/telcoData.ts';

export function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Panduan Pengguna (Guides)</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Pusat Ilmu Telus
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Panduan & Tips Telekomunikasi Malaysia
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Panduan langkah-demi-langkah cara menukar telco (MNP) tanpa hilang nombor, petua membaiki WiFi rumah yang perlahan, dan perbezaan antara teknologi 5G dan gentian optik.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONSUMER_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all group hover:shadow-xl"
            >
              <div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                  {guide.category}
                </span>

                <Link to={`/guides/${guide.slug}`} className="block group-hover:text-emerald-300 transition-colors mt-4">
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {guide.title}
                  </h2>
                </Link>

                <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>

                {/* Steps summary */}
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Langkah Utama:
                  </span>
                  {guide.steps.slice(0, 3).map((st) => (
                    <div key={st.stepNumber} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {st.stepNumber}
                      </span>
                      <span className="line-clamp-1">{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{guide.readTime}</span>
                <Link
                  to={`/guides/${guide.slug}`}
                  className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-bold text-xs"
                >
                  Baca Panduan Penuh <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
