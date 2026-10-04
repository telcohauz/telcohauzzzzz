import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { Promotion } from '../../data/telcoData.ts';

interface PromotionCardProps {
  promotion: Promotion;
  onApply?: (promo: Promotion) => void;
}

export function PromotionCard({ promotion, onApply }: PromotionCardProps) {
  const waText = encodeURIComponent(
    `Salam TelcoHauz, saya berminat dengan ${promotion.title}. Bolehkah saya semak kelayakan promosi ini?`
  );

  return (
    <div className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-950/20">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-600/50 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-amber-400" />
            {promotion.badge}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{promotion.provider}</span>
        </div>

        <Link to={`/promotions/${promotion.slug}`} className="block group-hover:text-amber-300 transition-colors">
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
            {promotion.title}
          </h3>
        </Link>

        <div className="mt-2.5 inline-block text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-md">
          {promotion.discountText}
        </div>

        <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
          {promotion.summary}
        </p>

        {/* Highlights */}
        <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
          {promotion.highlights.slice(0, 2).map((hl, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{hl}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Sah hingga: {promotion.validUntil}</span>
        </div>

        <div className="flex items-center gap-2">
          {onApply && (
            <button
              type="button"
              onClick={() => onApply(promotion)}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Tuntut
            </button>
          )}
          <Link
            to={`/promotions/${promotion.slug}`}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Lihat Tawaran Penuh"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
