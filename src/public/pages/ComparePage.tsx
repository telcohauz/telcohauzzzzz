import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Plus,
  X,
  Check,
  Sparkles,
  Wifi,
  Zap,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Trash2,
  ShieldCheck,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { TELCO_PLANS, TelcoPlan, TELCOHAUZ_BUSINESS, formatPlanPrice } from '../../data/telcoData.ts';
import { useCompare } from '../context/CompareContext.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { SocialShareBar } from '../components/SocialShareBar.tsx';
import { trackEvent } from '../lib/analytics.ts';

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlanForApply, setSelectedPlanForApply] = useState<TelcoPlan | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // If list is empty, default to 2 popular fibre plans for immediate comparison preview
  const displayPlans = compareList.length > 0
    ? compareList
    : [TELCO_PLANS[0], TELCO_PLANS[1]];

  const handleApply = (plan: TelcoPlan) => {
    setSelectedPlanForApply(plan);
    setIsApplyModalOpen(true);
    trackEvent('apply_clicked', { from: 'comparison', planId: plan.id });
  };

  const availablePlansToAdd = TELCO_PLANS.filter(
    (p) => !displayPlans.some((dp) => dp.id === p.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Bandingkan Pelan Telco Sebelah-Menyebelah - TelcoHauz"
        description="Bandingkan harga bulanan, kelajuan, kuota, kontrak, liputan dan syarat kelayakan sehingga 4 pelan telekomunikasi serentak."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/" className="hover:text-cyan-400">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Bandingkan Pelan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Scale className="w-8 h-8 text-cyan-400" />
              Bandingkan Pelan Secara Objektif
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Bandingkan 2 hingga 4 pelan serentak. Maklumat yang tidak dinyatakan akan dilabel "Not stated" atau "Semak dengan provider".
            </p>
          </div>

          <div className="flex items-center gap-3">
            {displayPlans.length < 4 && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pelan ({displayPlans.length}/4)</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="p-2.5 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
                title="Padam Semua Pilihan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table (Section 13 Fields) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Header: Snapshots */}
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90">
                  <th className="p-5 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                    Ciri / Spesifikasi
                  </th>
                  {displayPlans.map((plan) => (
                    <th key={plan.id} className="p-5 align-top min-w-[220px]">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                            {plan.provider}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCompare(plan.id)}
                            className="text-slate-400 hover:text-rose-400 p-1"
                            title="Keluarkan dari perbandingan"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <Link to={`/products/${plan.slug}`} className="block hover:text-cyan-400 transition-colors">
                          <h3 className="font-bold text-white text-base leading-snug">
                            {plan.name}
                          </h3>
                        </Link>

                        {(() => {
                          const pInfo = formatPlanPrice(plan);
                          return (
                            <div>
                              {pInfo.isSpecial ? (
                                <span className="text-xs font-semibold text-amber-300 block">
                                  {pInfo.displayText}
                                </span>
                              ) : (
                                <div className="flex items-baseline gap-1 font-mono">
                                  <span className="text-xs text-slate-400">RM</span>
                                  <span className="text-3xl font-black text-white">{plan.priceMonthly}</span>
                                  <span className="text-xs text-slate-400">/{plan.billingPeriod || 'bln'}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div className="space-y-1.5 pt-2">
                          <button
                            type="button"
                            onClick={() => handleApply(plan)}
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Mohon Pelan Ini
                          </button>
                          <a
                            href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
                              `Salam TelcoHauz, saya ingin memohon ${plan.name} (${plan.provider}) dari halaman perbandingan.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </th>
                  ))}

                  {displayPlans.length < 4 && (
                    <th className="p-5 align-middle text-center border-l border-slate-800/60 min-w-[180px]">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-slate-400 hover:text-cyan-300 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer p-4"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold">Tambah Pelan Ke-{displayPlans.length + 1}</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Exact Section 13 Rows */}
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {/* 1. Monthly price */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Harga Bulanan (Monthly price)
                  </td>
                  {displayPlans.map((plan) => {
                    const pInfo = formatPlanPrice(plan);
                    return (
                      <td key={plan.id} className="p-4 font-mono font-bold text-white">
                        {pInfo.isSpecial ? (
                          <span className="text-amber-300 font-sans text-xs">{pInfo.displayText}</span>
                        ) : (
                          `RM${plan.priceMonthly}/${plan.billingPeriod || 'bulan'}`
                        )}
                      </td>
                    );
                  })}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 2. Installation */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Pemasangan (Installation)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-emerald-400 font-semibold">
                      Standard Percuma
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 3. Contract */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Tempoh Kontrak (Contract)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-slate-200">
                      {plan.contractMonths ? `${plan.contractMonths} Bulan` : 'Tanpa Kontrak (No Contract)'}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 4. Speed */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Kelajuan (Speed)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 font-mono font-bold text-cyan-300">
                      {plan.speed || 'Not stated'}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 5. Data allowance */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Kuota Data (Data allowance)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-emerald-400 font-medium">
                      {plan.quota || 'Unlimited Tanpa Had'}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 6. Benefits */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Faedah & Freebies (Benefits)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-slate-300">
                      {plan.freebies && plan.freebies.length > 0 ? (
                        <ul className="space-y-1 text-xs">
                          {plan.freebies.map((fb, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{fb}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 italic">Not stated</span>
                      )}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 7. Promotion */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Promosi Semasa (Promotion)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-amber-300 font-medium">
                      {plan.promoBadge || 'Semak dengan provider'}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 8. Coverage */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Liputan (Coverage)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-slate-300">
                      {plan.coverageStatus || (plan.category === 'Fibre' ? 'Kondominium & Kediaman Bertingkat' : 'Semak dengan provider')}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 9. Eligibility */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Kelayakan (Eligibility)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-slate-300">
                      {plan.eligibilityStatus || 'Warganegara / Pemastautin Malaysia'}
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>

                {/* 10. Application requirements */}
                <tr className="hover:bg-slate-850/50">
                  <td className="p-4 font-semibold text-slate-300 bg-slate-900/40">
                    Syarat Permohonan (Application requirements)
                  </td>
                  {displayPlans.map((plan) => (
                    <td key={plan.id} className="p-4 text-slate-300">
                      Salinan MyKad / Pasport & Alamat Pemasangan
                    </td>
                  ))}
                  {displayPlans.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <SocialShareBar title="Bandingkan Pelan Telco Malaysia di TelcoHauz" />
      </div>

      {/* Modal to add plans */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Pilih Pelan Untuk Dibandingkan</h3>
                <span className="text-xs text-slate-400">Pilih sehingga 4 pelan serentak</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-800">
              {availablePlansToAdd.map((plan) => (
                <div key={plan.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {plan.provider}
                      </span>
                      <span className="text-xs text-slate-400">{plan.category}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{plan.name}</div>
                    <div className="text-xs text-slate-400">{plan.speed} • RM{plan.priceMonthly}/bln</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToCompare(plan);
                      setIsAddModalOpen(false);
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 cursor-pointer"
                  >
                    Pilih
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        plan={selectedPlanForApply}
      />
    </div>
  );
}
