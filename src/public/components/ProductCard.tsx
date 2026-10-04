import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Wifi, ArrowRight, Plus, CheckCircle2, MessageSquare, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { TelcoPlan, TELCOHAUZ_BUSINESS, formatPlanPrice, formatPublicStatusBadge } from '../../data/telcoData.ts';
import { useCompare } from '../context/CompareContext.tsx';
import { trackEvent } from '../lib/analytics.ts';

interface ProductCardProps {
  plan: TelcoPlan;
  onApply?: (plan: TelcoPlan) => void;
}

export function ProductCard({ plan, onApply }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const compared = isInCompare(plan.id);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(plan.id);
    } else {
      addToCompare(plan);
      trackEvent('compare_started', { planId: plan.id, planName: plan.name });
    }
  };

  const getProviderColor = (provider: string) => {
    if (provider.includes('TIME')) return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
    if (provider.includes('Unifi')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (provider.includes('Maxis')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (provider.includes('CelcomDigi')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (provider.includes('ALLO')) return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    if (provider.includes('U Mobile')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (provider.includes('YES')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (provider.includes('Astro')) return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30';
    if (provider.includes('Cuckoo') || provider.includes('Coway') || provider.includes('LG PuriCare')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (provider.includes('Verdant')) return 'bg-lime-500/10 text-lime-400 border-lime-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const priceInfo = formatPlanPrice(plan);
  const statusBadge = formatPublicStatusBadge(plan.dataStatus);

  // Structured WhatsApp message - TelcoHauz assists the application
  const priceDisplayForWA = priceInfo.isSpecial ? priceInfo.displayText : `RM${plan.priceMonthly}/${plan.billingPeriod || 'bulan'}`;
  const waEnquiryText = encodeURIComponent(
    `Salam TelcoHauz,\n` +
    `Saya ingin membuat pertanyaan dan bantuan permohonan bagi:\n` +
    `• Produk: ${plan.name}\n` +
    `• Pembekal: ${plan.provider}\n` +
    `• Kategori: ${plan.category}\n` +
    `• Harga: ${priceDisplayForWA}\n` +
    `Mohon bantu semak kelayakan dan tatacara pendaftaran. Terima kasih!`
  );

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-950/20">
      <div>
        {/* Provider badge, status badge & Promo badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getProviderColor(
                plan.provider
              )}`}
            >
              {plan.provider || 'Maklumat belum tersedia'}
            </span>

            {statusBadge && (
              <span className="text-[10px] font-medium text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                {statusBadge}
              </span>
            )}
          </div>

          {plan.promoBadge ? (
            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              {plan.promoBadge}
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">{plan.category}</span>
          )}
        </div>

        {/* Product Name */}
        <Link
          to={`/products/${plan.slug}`}
          onClick={() => trackEvent('product_view', { planId: plan.id, planName: plan.name })}
          className="block group-hover:text-cyan-400 transition-colors"
        >
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
            {plan.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {plan.shortDescription || plan.description || 'Maklumat belum tersedia'}
        </p>

        {/* Speed / Quota Pill */}
        {plan.speed && (
          <div className="mt-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-cyan-300">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>{plan.speed}</span>
            </div>
            {plan.speedUpload && (
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                ↑ {plan.speedUpload}
              </span>
            )}
          </div>
        )}

        {/* Pricing Box & Billing Period - NO FAKE PRICES */}
        <div className="mt-4 pt-3 pb-3 border-y border-slate-800/80 flex items-baseline justify-between">
          <div className="flex-1 pr-2">
            {priceInfo.isSpecial ? (
              <div>
                <span className="text-xs font-medium text-amber-300 block leading-tight">
                  {priceInfo.displayText}
                </span>
                {priceInfo.subText && (
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {priceInfo.subText}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-slate-400">RM</span>
                  <span className="text-3xl font-black text-white tracking-tight font-mono">
                    {plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400">{priceInfo.subText}</span>
                </div>
                {plan.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    Biasa: RM{plan.originalPrice}/bln
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-medium">Kontrak</span>
            <span className="text-xs font-semibold text-slate-200">
              {plan.contractMonths ? `${plan.contractMonths} Bulan` : 'Tanpa Kontrak'}
            </span>
          </div>
        </div>

        {/* Key Benefits */}
        <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
          {plan.features?.slice(0, 3).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Detail Link */}
          <Link
            to={`/products/${plan.slug}`}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Perincian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Compare Button */}
          <button
            onClick={handleToggleCompare}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
              compared
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-slate-700'
            }`}
          >
            {compared ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dibanding</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Banding</span>
              </>
            )}
          </button>
        </div>

        {/* Primary CTA: Mohon Dengan TelcoHauz / WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => onApply?.(plan)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-950/30 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mohon Pelan Ini</span>
          </button>

          <a
            href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${waEnquiryText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { planId: plan.id, source: 'product_card' })}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
