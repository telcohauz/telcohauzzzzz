import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Tag
} from 'lucide-react';
import { CAMPAIGNS, TELCO_PLANS, TelcoPlan } from '../../data/telcoData.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { SocialShareBar } from '../components/SocialShareBar.tsx';

export function CampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activePlanForApply, setActivePlanForApply] = useState<TelcoPlan | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const campaign = CAMPAIGNS.find((c) => c.slug === slug);

  if (!campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Kempen Tidak Dijumpai</h2>
        <p className="text-sm text-slate-400 mt-2">
          Kempen promosi ini mungkin telah tamat atau berpindah.
        </p>
        <Link
          to="/promotions"
          className="mt-6 px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Lihat Promosi Semasa
        </Link>
      </div>
    );
  }

  // Get related products for this campaign
  const relatedProducts = TELCO_PLANS.filter((p) =>
    campaign.targetPlanSlugs.includes(p.slug) || campaign.targetPlanSlugs.includes(p.id) || p.category === campaign.category
  ).slice(0, 3);

  const waCampaignText = encodeURIComponent(
    `Salam TelcoHauz, saya berminat dengan ${campaign.title}. Boleh bantu saya semak kelayakan dan tawaran harga di kawasan saya?`
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={campaign.title}
        description={campaign.heroSubheadline}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/promotions" className="hover:text-cyan-400">Promotions</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white truncate">{campaign.title}</span>
        </div>

        {/* 1. Hero */}
        <div className="relative bg-gradient-to-br from-blue-950/70 via-slate-900 to-cyan-950/50 border border-cyan-800/40 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Kempen Eksklusif TelcoHauz
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {campaign.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {campaign.heroSubheadline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/601123456789?text=${waCampaignText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Dapatkan Tawaran di WhatsApp
              </a>

              <Link
                to={`/eligibility?service=${encodeURIComponent(campaign.category)}`}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm"
              >
                Semak Kelayakan Alamat
              </Link>
            </div>

            <SocialShareBar title={campaign.title} />
          </div>
        </div>

        {/* 2. Offer & Pricing Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ringkasan Tawaran</span>
            <h2 className="text-xl font-bold text-white">Apa Yang Ditawarkan?</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{campaign.offerSummary}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Kadar Harga</span>
            <h2 className="text-xl font-bold text-white">{campaign.pricing}</h2>
            <p className="text-xs text-slate-400">Harga rasmi pembekal tanpa caj tersembunyi. Pemasangan standard percuma.</p>
          </div>
        </div>

        {/* 3. Benefits & Who It Is For */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benefits */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Kelebihan Pakej Ini
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {campaign.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who It Is For */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Sesuai Untuk Siapa?
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {campaign.whoItIsFor.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Eligibility & Important Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Kelayakan Memohon
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{campaign.eligibility}</p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Maklumat Penting Sebelum Mendaftar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">{campaign.importantInfo}</p>
          </div>
        </div>

        {/* 5. Frequently Asked Questions */}
        {campaign.faqs.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              Soalan Lazim Kempen Ini (FAQ)
            </h2>
            <div className="space-y-3">
              {campaign.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm space-y-1">
                  <strong className="text-white block">{faq.question}</strong>
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Pilihan Terpilih</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Pakej Yang Termasuk Dalam Kempen Ini</h2>
              </div>
              <Link to={`/products?category=${encodeURIComponent(campaign.category)}`} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  plan={p}
                  onApply={(plan) => {
                    setActivePlanForApply(plan);
                    setIsApplyModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 7. Bottom WhatsApp CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-800/40 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Sedia Untuk Menikmati Tawaran Ini?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Hantar pertanyaan anda terus kepada perunding TelcoHauz di WhatsApp untuk semakan liputan segera.
          </p>
          <a
            href={`https://wa.me/601123456789?text=${waCampaignText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50"
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp TelcoHauz Sekarang</span>
          </a>
        </div>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        plan={activePlanForApply}
      />
    </div>
  );
}
