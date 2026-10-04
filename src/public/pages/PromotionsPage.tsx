import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Tag, Calendar, ArrowRight } from 'lucide-react';
import { PROMOTIONS, Promotion } from '../../data/telcoData.ts';
import { PromotionCard } from '../components/PromotionCard.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';

export function PromotionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePromoForApply, setActivePromoForApply] = useState<Promotion | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const categories = ['ALL', 'Fibre', 'Mobile', 'Astro'];

  const filteredPromos = PROMOTIONS.filter((promo) => {
    if (selectedCategory === 'ALL') return true;
    return promo.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleApplyPromo = (promo: Promotion) => {
    setActivePromoForApply(promo);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-cyan-400">Home</Link>
            <span>/</span>
            <span className="text-white">Promosi & Rebat</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Tawaran Khas 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Promosi & Rebat Jimat Terkini
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Rebut peluang diskaun rebat bil bulanan, router WiFi 6 model terkini secara percuma, dan kuota data ekstra apabila mendaftar melalui TelcoHauz.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'Semua Tawaran' : `Promosi ${cat}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromos.map((promo) => (
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onApply={handleApplyPromo}
            />
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white">Ada Kod Baucar Atau Promosi Yang Anda Nampak?</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Hantarkan tangkapan skrin (screenshot) promosi tersebut kepada kami melalui WhatsApp. Pasukan TelcoHauz akan semak sama ada kod tersebut boleh diaplikasikan ke akaun permohonan anda.
          </p>
          <a
            href={`https://wa.me/601123456789?text=${encodeURIComponent(
              'Salam TelcoHauz, saya ingin bertanyakan tentang kod promosi dan diskaun terkini yang boleh saya tebus.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Tanya Promosi di WhatsApp
          </a>
        </div>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        promotion={activePromoForApply}
      />
    </div>
  );
}
