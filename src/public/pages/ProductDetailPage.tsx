import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wifi,
  Check,
  Scale,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Zap,
  Info,
  ChevronRight,
  FileText,
  AlertTriangle,
  HelpCircle,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { TELCO_PLANS, TelcoPlan, TELCOHAUZ_BUSINESS, formatPlanPrice, formatPublicStatusBadge } from '../../data/telcoData.ts';
import { ApplyModal } from '../components/ApplyModal.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { useCompare } from '../context/CompareContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { SocialShareBar } from '../components/SocialShareBar.tsx';
import { trackEvent } from '../lib/analytics.ts';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const plan = TELCO_PLANS.find((p) => p.slug === slug || p.id === slug);

  if (!plan) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Pelan Tidak Dijumpai</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          Pelan yang anda cari mungkin telah tamat tempoh promosi atau pautan tidak tepat.
        </p>
        <Link
          to="/products"
          className="mt-6 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
        >
          Kembali ke Katalog Produk
        </Link>
      </div>
    );
  }

  const compared = isInCompare(plan.id);

  const handleToggleCompare = () => {
    if (compared) {
      removeFromCompare(plan.id);
    } else {
      addToCompare(plan);
      trackEvent('compare_started', { planId: plan.id, planName: plan.name });
    }
  };

  const relatedPlans = TELCO_PLANS.filter(
    (p) => p.id !== plan.id && (p.category === plan.category || p.provider === plan.provider)
  ).slice(0, 3);

  const priceInfo = formatPlanPrice(plan);
  const statusBadge = formatPublicStatusBadge(plan.dataStatus);

  const priceDisplayForWA = priceInfo.isSpecial ? priceInfo.displayText : `RM${plan.priceMonthly}/${plan.billingPeriod || 'bulan'}`;
  const waEnquiryText = encodeURIComponent(
    `Salam TelcoHauz,\n` +
    `Saya ingin memohon / semak kelayakan untuk pakej:\n` +
    `• Produk: ${plan.name}\n` +
    `• Pembekal: ${plan.provider}\n` +
    `• Kategori: ${plan.category}\n` +
    `• Harga: ${priceDisplayForWA}\n` +
    `Mohon bantuan perunding TelcoHauz untuk semakan liputan & proses permohonan. Terima kasih.`
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${plan.name} (${plan.provider}) - Harga & Spesifikasi Penuh`}
        description={plan.description || `Bandingkan dan mohon ${plan.name} daripada ${plan.provider} dengan kadar rasmi RM${plan.priceMonthly}/bulan.`}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: plan.name,
          description: plan.description,
          offers: {
            '@type': 'Offer',
            price: plan.priceMonthly,
            priceCurrency: 'MYR',
            availability: 'https://schema.org/InStock',
          },
          brand: {
            '@type': 'Brand',
            name: plan.provider,
          },
        }}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-cyan-400">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/products?category=${encodeURIComponent(plan.category)}`} className="hover:text-cyan-400">
            {plan.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 truncate">{plan.name}</span>
        </div>

        {/* Top Product Hero Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                  {plan.provider}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                  {plan.category}
                </span>
                {plan.promoBadge && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-950/80 border border-amber-600/60 text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {plan.promoBadge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {plan.name}
              </h1>

              {plan.speed && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-sm text-cyan-300">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>Muat Turun: {plan.speed}</span>
                  </div>
                  {plan.speedUpload && (
                    <span className="text-xs text-slate-400 font-mono">
                      Muat Naik: {plan.speedUpload}
                    </span>
                  )}
                </div>
              )}

              {/* 1. WHAT IT IS */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  1. APAKAH PELAN INI (WHAT IT IS)
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {plan.whatItIs || plan.description || 'Maklumat belum tersedia'}
                </p>
              </div>

              {/* 2. BEST FOR */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs sm:text-sm text-blue-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cyan-300 font-semibold mb-0.5">2. SESUAI UNTUK (BEST FOR):</strong>
                  <span>{plan.bestFor || 'Penggunaan keluarga dan pejabat kecil.'}</span>
                </div>
              </div>

              <SocialShareBar title={plan.name} />
            </div>

            {/* Right Action / Price Column */}
            <div className="lg:col-span-4 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-xs text-slate-400 block font-medium">4. KADAR HARGA (PRICE / PLAN)</span>
                {priceInfo.isSpecial ? (
                  <div className="mt-2">
                    <span className="text-base font-bold text-amber-300 block leading-tight">
                      {priceInfo.displayText}
                    </span>
                    {priceInfo.subText && (
                      <span className="text-xs text-slate-400 block mt-1">
                        {priceInfo.subText}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-slate-400">RM</span>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                      {plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{priceInfo.subText}</span>
                  </div>
                )}

                {plan.originalPrice && !priceInfo.isSpecial && (
                  <span className="text-xs text-slate-400 line-through block mt-1">
                    Harga Asal: RM{plan.originalPrice}/bln
                  </span>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Tempoh Kontrak:</span>
                    <strong className="text-slate-200">
                      {plan.contractMonths ? `${plan.contractMonths} Bulan` : 'Tanpa Kontrak Wajib'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pemasangan Standard:</span>
                    <strong className="text-emerald-400">100% Percuma</strong>
                  </div>
                </div>
              </div>

              {/* CTAs (Section 10): MOHON SEKARANG & WHATSAPP TELCOHAUZ */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsApplyModalOpen(true);
                    trackEvent('apply_clicked', { planId: plan.id, planName: plan.name });
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm tracking-wide rounded-xl shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>MOHON SEKARANG</span>
                </button>

                <a
                  href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${waEnquiryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_clicked', { planId: plan.id, planName: plan.name })}
                  className="w-full py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP TELCOHAUZ</span>
                </a>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleToggleCompare}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      compared
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    {compared ? 'Dalam Bandingan' : 'Tambah Ke Perbandingan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12 Detailed Sections Breakdown (Section 10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* 3. WHAT YOU GET */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                3. APA YANG ANDA DAPAT (WHAT YOU GET)
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
                {plan.freebies.map((fb, idx) => (
                  <li key={`fb-${idx}`} className="flex items-start gap-2.5 text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Percuma: {fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. PROMOTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                5. TAWARAN PROMOSI (PROMOTION)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {plan.promoBadge ? (
                  <>Pelan ini kini ditawarkan dengan promosi khas: <strong>{plan.promoBadge}</strong>. Tertakluk kepada ketersediaan port semasa.</>
                ) : (
                  'Promosi standard tertakluk kepada pengesahan semasa dengan pembekal.'
                )}
              </p>
            </div>

            {/* 6. BEFORE APPLYING */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                6. SEBELUM MEMOHON (BEFORE APPLYING)
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc pl-5">
                <li>Pastikan premis anda berada dalam kawasan liputan pembekal perkhidmatan.</li>
                <li>Sekiranya anda menukar daripada talian telco terdahulu, pastikan kontrak lama telah tamat bagi mengelakkan penalti awal.</li>
                <li>Sahkan persetujuan tuan rumah jika menyewa untuk kerja-kerja pemasangan kabel dalaman.</li>
              </ul>
            </div>

            {/* 7. ELIGIBILITY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                7. SYARAT KELAYAKAN (ELIGIBILITY)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {plan.eligibilityNote || 'Terbuka kepada semua warganegara Malaysia berumur 18 tahun ke atas dan pemastautin sah dengan pasport sah.'}
              </p>
            </div>

            {/* 8. COVERAGE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                8. KAWASAN LIPUTAN (COVERAGE)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {plan.coverageStatus || (plan.category === 'Fibre' ? 'Liputan gentian optik tersedia di kondominium, apartmen, dan kawasan perumahan bertingkat serta perumahan terpilih.' : 'Tersedia di kawasan liputan 4G/5G di seluruh Malaysia.')}
              </p>
              <div className="pt-2">
                <Link
                  to={`/eligibility?plan=${encodeURIComponent(plan.name)}`}
                  className="text-xs text-cyan-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  Semak liputan di alamat anda sekarang <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 9. DOCUMENTS REQUIRED */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                9. DOKUMEN DIPERLUKAN (DOCUMENTS REQUIRED)
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc pl-5">
                <li>Salinan MyKad (depan & belakang) yang jelas untuk warganegara Malaysia.</li>
                <li>Salinan Pasport dengan tempoh sah sekurang-kurangnya 6 bulan bagi pemastautin bukan warganegara.</li>
                <li>Bil utiliti (air atau elektrik) jika alamat MyKad anda berbeza dengan alamat pemasangan premis.</li>
              </ul>
            </div>

            {/* 10. IMPORTANT */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                10. PERKARA PENTING (IMPORTANT)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keputusan akhir kelayakan, ketersediaan port gentian optik, dan tarikh temu janji pemasangan adalah tertakluk kepada semakan rasmi oleh sistem {plan.provider}. TelcoHauz bertindak sebagai platform perundingan dan bantuan pendaftaran bebas tanpa sebarang surcaj tambahan.
              </p>
            </div>

            {/* 11. HOW TO APPLY */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                11. BAGAIMANA CARA MEMOHON (HOW TO APPLY)
              </h2>
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-300 list-decimal pl-5">
                <li>Klik butang "MOHON SEKARANG" atau "WHATSAPP TELCOHAUZ".</li>
                <li>Hantarkan alamat premis untuk pengesahan port teknikal dalam sistem pembekal.</li>
                <li>Sahkan dokumen pendaftaran MyKad secara sulit dan selamat.</li>
                <li>Pilih tarikh dan masa temu janji pemasangan oleh juruteknik bertauliah ke rumah anda.</li>
              </ol>
            </div>

            {/* 12. FAQ */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                12. SOALAN LAZIM (FAQ)
              </h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <strong className="text-white block text-xs sm:text-sm">Berapa lamakah tempoh pemasangan?</strong>
                  <p className="text-xs text-slate-300">Pemasangan biasanya boleh diaturkan dalam tempoh 1 hingga 3 hari bekerja selepas dokumen disahkan.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <strong className="text-white block text-xs sm:text-sm">Adakah ada sebarang bayaran pendahuluan?</strong>
                  <p className="text-xs text-slate-300">Tiada bayaran dikenakan kepada TelcoHauz. Yuran bulanan pertama akan dicaj terus oleh pembekal rasmi ke dalam bil pertama anda.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Specifications Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Jadual Spesifikasi Penuh
              </h3>
              <div className="space-y-2.5 text-xs">
                {Object.entries(plan.specs).map(([k, v]) => (
                  <div key={k} className="py-2 border-b border-slate-800/80 flex flex-col gap-0.5">
                    <span className="text-slate-400">{k}</span>
                    <strong className="text-white font-medium">{v || 'Maklumat belum tersedia'}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Plans */}
        {relatedPlans.length > 0 && (
          <div className="pt-10 border-t border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Alternatif Berkaitan</span>
                <h3 className="text-xl font-bold text-white mt-1">Pelan Lain Yang Mungkin Anda Minati</h3>
              </div>
              <Link to="/products" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                Semua Pelan
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlans.map((rPlan) => (
                <ProductCard key={rPlan.id} plan={rPlan} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        plan={plan}
      />
    </div>
  );
}
