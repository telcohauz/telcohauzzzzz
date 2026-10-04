import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  MapPin,
  Wallet,
  Target,
  Wifi,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { TELCO_PLANS, TelcoPlan } from '../../data/telcoData.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { trackEvent } from '../lib/analytics.ts';

const MALAYSIAN_REGIONS = [
  'Lembah Klang (KL & Selangor)',
  'Wilayah Utara (Penang, Perak, Kedah, Perlis)',
  'Wilayah Selatan (Johor, Melaka, N. Sembilan)',
  'Pantai Timur (Pahang, Terengganu, Kelantan)',
  'Sabah & Sarawak',
];

export function RecommendPage() {
  // Section 15: 5 exact questions
  const [premiseType, setPremiseType] = useState<'Rumah' | 'Bisnes'>('Rumah');
  const [region, setRegion] = useState(MALAYSIAN_REGIONS[0]);
  const [budget, setBudget] = useState('RM100 - RM150');
  const [primaryNeed, setPrimaryNeed] = useState('Gaming & Striming 4K');
  const [speedRequirement, setSpeedRequirement] = useState('300 Mbps');

  const [showResults, setShowResults] = useState(false);
  const [activePlanForApply, setActivePlanForApply] = useState<TelcoPlan | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const getRecommendations = (): { plan: TelcoPlan; matchScore: number; reason: string }[] => {
    return TELCO_PLANS.filter((p) => {
      if (premiseType === 'Bisnes') {
        return p.category.includes('Business');
      }
      return !p.category.includes('Business');
    }).map((plan) => {
      let score = 75;
      let reason = 'Memenuhi kriteria pilihan utama anda.';
      const pm = plan.priceMonthly;

      // Budget match
      if (budget === 'Bawah RM100' && typeof pm === 'number' && pm < 100) {
        score += 15;
        reason = 'Kadar bulanan jimat di bawah RM100.';
      } else if (budget === 'RM100 - RM150' && typeof pm === 'number' && pm >= 99 && pm <= 150) {
        score += 15;
        reason = 'Kadar penjimatan seimbang antara kelajuan dan bajet RM100-RM150.';
      } else if (budget === 'RM150 ke atas' && typeof pm === 'number' && pm >= 139) {
        score += 15;
        reason = 'Prestasi berkelajuan tinggi untuk keperluan berat.';
      }

      // Need match
      if (primaryNeed === 'Gaming & Striming 4K' && (plan.provider === 'TIME' || plan.name.includes('600') || plan.name.includes('300'))) {
        score += 15;
        reason = 'Latensi rendah dan kelajuan muat naik pantas untuk striming lancar.';
      } else if (primaryNeed === 'Kerja Dari Rumah (WFH)' && plan.category.includes('Fibre')) {
        score += 10;
        reason = 'Kestabilan gentian optik tanpa gangguan cuaca semasa telesidang.';
      } else if (primaryNeed === 'Penggunaan Ringan / Sewa Rumah' && plan.category.includes('5G')) {
        score += 20;
        reason = 'Mudah pasang tanpa tebuk dinding – sesuai untuk penyewa.';
      }

      // Region consideration
      if (region.includes('Lembah Klang') && plan.provider === 'TIME') {
        score += 5;
      }

      return {
        plan,
        matchScore: Math.min(99, Math.max(70, score)),
        reason,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    trackEvent('recommendation_completed', { premiseType, region, budget, primaryNeed });
  };

  const results = getRecommendations();

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Tak Pasti Nak Pilih Yang Mana? - Pencari Pelan Pintar TelcoHauz"
        description="Jawab 5 soalan mudah untuk mendapatkan cadangan pelan internet rumah atau bisnes paling sesuai dengan bajet anda di Malaysia."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Pencari Pelan Pintar (Recommendation)</span>
        </div>

        {/* Header (Section 15: "Tak pasti nak pilih yang mana?") */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-800/80">
            Penasihat Pemilihan Objektif
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tak pasti nak pilih yang mana?
          </h1>
          <p className="text-sm text-slate-300">
            Isikan 5 maklumat ringkas di bawah. Sistem akan mencadangkan pelan yang disahkan sesuai mengikut bajet dan penggunaan anda.
          </p>
        </div>

        {/* 5 Questions Form (Section 15) */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* 1. Rumah atau bisnes? */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              1. Rumah atau bisnes? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Rumah', 'Bisnes'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPremiseType(type)}
                  className={`py-3.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    premiseType === type
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {type === 'Rumah' ? 'Kediaman / Rumah (Home)' : 'Perniagaan / Pejabat (Business)'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kawasan? */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              2. Kawasan premis anda? *
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
            >
              {MALAYSIAN_REGIONS.map((r) => (
                <option key={r} value={r} className="bg-slate-900">{r}</option>
              ))}
            </select>
          </div>

          {/* 3. Bajet? */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              3. Berapakah bajet bulanan anda? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Bawah RM100', 'RM100 - RM150', 'RM150 ke atas'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    budget === b
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Keperluan utama? */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              4. Keperluan utama penggunaan? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Gaming & Striming 4K', desc: 'Latensi rendah & kelajuan tinggi' },
                { id: 'Kerja Dari Rumah (WFH)', desc: 'Telesidang & fail berat' },
                { id: 'Penggunaan Ringan / Sewa Rumah', desc: 'Penyewa & media sosial biasa' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPrimaryNeed(item.id)}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    primaryNeed === item.id
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <strong className="block text-white mb-0.5">{item.id}</strong>
                  <span className="text-[11px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Usage / speed requirement? */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              5. Keperluan Kelajuan / Usage Speed Requirement? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {['100 Mbps', '300 Mbps', '500-600 Mbps', '1 Gbps+'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedRequirement(s)}
                  className={`p-3 rounded-xl border text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                    speedRequirement === s
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Sparkles className="w-5 h-5" />
              <span>Dapatkan Cadangan Sekarang</span>
            </button>
          </div>
        </form>

        {/* Display Results (Section 15) */}
        {showResults && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Display: "Cadangan untuk anda" */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-800/80">
                Keputusan Padanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Cadangan untuk anda
              </h2>

              {/* Mandatory Display: "Cadangan ini berdasarkan maklumat yang anda berikan. Sahkan kelayakan sebelum memohon." */}
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium max-w-lg mx-auto bg-amber-950/40 border border-amber-800/40 rounded-xl p-3">
                "Cadangan ini berdasarkan maklumat yang anda berikan. Sahkan kelayakan sebelum memohon."
              </p>
            </div>

            <div className="space-y-6">
              {results.map(({ plan, matchScore, reason }) => (
                <div
                  key={plan.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan-500/40 transition-colors shadow-xl"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-mono">
                        {matchScore}% Padanan Sempurna
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{plan.provider}</span>
                    </div>

                    <h3 className="text-xl font-black text-white">{plan.name}</h3>

                    <p className="text-xs text-cyan-300 font-medium">
                      💡 <strong>Sebab cadangan:</strong> {reason}
                    </p>

                    <div className="text-xs text-slate-400 pt-1">
                      Kelajuan: <strong className="text-slate-200">{plan.speed}</strong> • Router: <strong className="text-slate-200">{plan.wifiRouter || 'Percuma'}</strong>
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-2xl font-black text-white font-mono">
                      RM{plan.priceMonthly}<span className="text-xs text-slate-400">/bln</span>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row md:flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlanForApply(plan);
                          setIsApplyModalOpen(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Mohon Pakej Ini
                      </button>
                      <Link
                        to={`/products/${plan.slug}`}
                        className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center transition-colors"
                      >
                        Lihat Maklumat Penuh
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        plan={activePlanForApply}
      />
    </div>
  );
}
