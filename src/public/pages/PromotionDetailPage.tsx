import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag, Calendar, CheckCircle2, AlertCircle, ArrowLeft, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import { PROMOTIONS, TELCO_PLANS, Promotion } from '../../data/telcoData.ts';
import { ApplyModal } from '../components/ApplyModal.tsx';

export function PromotionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const promo = PROMOTIONS.find((p) => p.slug === slug || p.id === slug);

  if (!promo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Promosi Tidak Dijumpai</h2>
        <p className="text-sm text-slate-400 mt-2">
          Promosi ini mungkin telah tamat atau berpindah.
        </p>
        <Link
          to="/promotions"
          className="mt-6 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Lihat Promosi Aktif
        </Link>
      </div>
    );
  }

  const linkedPlan = promo.planSlug ? TELCO_PLANS.find(p => p.slug === promo.planSlug) : null;

  const waEnquiryText = encodeURIComponent(
    `Salam TelcoHauz, saya berminat untuk menuntut ${promo.title}. Sila bantu proses permohonan saya.`
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/promotions" className="hover:text-cyan-400">Promotions</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 truncate">{promo.title}</span>
        </div>

        {/* Promo Hero Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-600/50 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              {promo.badge}
            </span>
            <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              {promo.provider}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              Sah hingga: <strong>{promo.validUntil}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {promo.title}
          </h1>

          <div className="inline-block text-sm font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3.5 py-1.5 rounded-lg">
            {promo.discountText}
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {promo.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tuntut Tawaran Ini Sekarang</span>
            </button>

            <a
              href={`https://wa.me/601123456789?text=${waEnquiryText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Perunding</span>
            </a>
          </div>
        </div>

        {/* Highlights & Terms */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Highlights */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Faedah & Kelebihan Promosi
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {promo.highlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Terma & Syarat Kelayakan
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {promo.terms.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linked Plan */}
        {linkedPlan && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Pelan Berkaitan Promosi Ini</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{linkedPlan.name}</h3>
              <p className="text-xs text-slate-300 mt-1">{linkedPlan.speed} • RM{linkedPlan.priceMonthly}/bulan</p>
            </div>
            <Link
              to={`/products/${linkedPlan.slug}`}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap"
            >
              Lihat Spesifikasi Pelan
            </Link>
          </div>
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        promotion={promo}
      />
    </div>
  );
}
