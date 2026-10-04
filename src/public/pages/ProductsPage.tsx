import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, Sparkles, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { TELCO_PLANS, TelcoPlan } from '../../data/telcoData.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { trackEvent } from '../lib/analytics.ts';

const CATEGORIES = [
  'ALL',
  'Fibre Internet',
  'Business Fibre',
  '5G / Wireless Broadband',
  'Mobile',
  'Astro / Entertainment',
  'Water Purifiers',
  'Home Appliances',
  'Solar',
  'Digital Services'
];

const PROVIDERS = [
  'ALL',
  'TIME',
  'Unifi',
  'Maxis',
  'CelcomDigi',
  'ALLO',
  'U Mobile',
  'YES',
  'Astro',
  'Cuckoo',
  'Coway',
  'LG PuriCare',
  'Khind',
  'Verdant Solar',
  'KSIT',
  'Eastel',
  'InNET'
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('q') || '';
  const initialProvider = searchParams.get('provider') || 'ALL';

  // Filters
  const [category, setCategory] = useState<string>(initialCategory);
  const [provider, setProvider] = useState<string>(initialProvider);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>('popularity');
  const [priceFilter, setPriceFilter] = useState<string>('ALL'); // ALL, under100, 100-150, over150
  const [promoFilter, setPromoFilter] = useState<boolean>(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [activePlanForApply, setActivePlanForApply] = useState<TelcoPlan | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
    const prov = searchParams.get('provider');
    if (prov) setProvider(prov);
  }, [searchParams]);

  const filteredPlans = useMemo(() => {
    return TELCO_PLANS.filter((plan) => {
      // 1. Category (flexible match for Fibre vs Fibre Internet, etc.)
      if (category !== 'ALL') {
        const catNorm = category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const planCatNorm = plan.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!planCatNorm.includes(catNorm) && !catNorm.includes(planCatNorm)) {
          return false;
        }
      }

      // 2. Provider
      if (provider !== 'ALL' && !plan.provider.toLowerCase().includes(provider.toLowerCase())) {
        return false;
      }

      // 3. Price Filter (safe for null)
      if (priceFilter === 'under100') {
        if (plan.priceMonthly === null || plan.priceMonthly === undefined || plan.priceMonthly >= 100) return false;
      }
      if (priceFilter === '100-150') {
        if (plan.priceMonthly === null || plan.priceMonthly === undefined || plan.priceMonthly < 100 || plan.priceMonthly > 150) return false;
      }
      if (priceFilter === 'over150') {
        if (plan.priceMonthly === null || plan.priceMonthly === undefined || plan.priceMonthly <= 150) return false;
      }

      // 4. Promotion filter
      if (promoFilter && !plan.promoBadge && !plan.originalPrice) return false;

      // 5. Availability filter
      if (availabilityFilter === 'highrise' && !plan.eligibilityNote.toLowerCase().includes('bertingkat') && !plan.eligibilityNote.toLowerCase().includes('kondominium')) {
        return false;
      }
      if (availabilityFilter === 'plugandplay' && !plan.category.includes('5G')) {
        return false;
      }

      // 6. Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = plan.name.toLowerCase().includes(q);
        const matchProvider = plan.provider.toLowerCase().includes(q);
        const matchDesc = plan.description.toLowerCase().includes(q);
        const matchSpeed = plan.speed?.toLowerCase().includes(q);
        const matchCat = plan.category.toLowerCase().includes(q);
        if (!matchName && !matchProvider && !matchDesc && !matchSpeed && !matchCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const aP = a.priceMonthly ?? 9999;
        const bP = b.priceMonthly ?? 9999;
        return aP - bP;
      }
      if (sortBy === 'price-desc') {
        const aP = a.priceMonthly ?? 0;
        const bP = b.priceMonthly ?? 0;
        return bP - aP;
      }
      if (sortBy === 'newest') return (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0);
      // Popularity default
      const aScore = (a.isPopular ? 3 : 0) + (a.isFeatured ? 2 : 0);
      const bScore = (b.isPopular ? 3 : 0) + (b.isFeatured ? 2 : 0);
      return bScore - aScore;
    });
  }, [category, provider, searchTerm, sortBy, priceFilter, promoFilter, availabilityFilter]);

  const clearAllFilters = () => {
    setCategory('ALL');
    setProvider('ALL');
    setSearchTerm('');
    setPriceFilter('ALL');
    setPromoFilter(false);
    setAvailabilityFilter('ALL');
    setSortBy('popularity');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Katalog Lengkap Pelan Internet, Mobile & Rumah Malaysia - TelcoHauz"
        description="Semak dan bandingkan pelan gentian optik Fibre, 5G Wireless, pascabayar mobile, Astro TV, penapis air dan solar kediaman di Malaysia."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-cyan-400">Home</Link>
            <span>/</span>
            <span className="text-white">Katalog Produk & Tawaran</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Katalog Produk & Tawaran Telco
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl">
            Bandingkan pelan gentian optik (Fibre), Business Fibre, 5G Wireless Broadband, pascabayar mobile, Astro kombo, penapis air, peralatan rumah dan solar kediaman di Malaysia.
          </p>
        </div>

        {/* Search & Comprehensive Filters Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          {/* Main search and quick actions */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pelan, kelajuan, atau jenama (cth: TIME, 300Mbps, Cuckoo)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Provider Filter */}
            <div className="w-full md:w-52">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full py-3 px-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                {PROVIDERS.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov === 'ALL' ? 'Semua Pembekal' : prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-52">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-3 px-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="popularity">Paling Popular</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="newest">Promosi Terkini</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar (9 Real Categories) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-900/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Secondary Quick Filters: Price, Promo, Availability */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold mr-1">Tapis Mengikut:</span>

              {/* Price Filter Pill */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="py-1.5 px-3 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Julat Harga</option>
                <option value="under100">Bawah RM100 / bln</option>
                <option value="100-150">RM100 - RM150 / bln</option>
                <option value="over150">Melebihi RM150 / bln</option>
              </select>

              {/* Promo Only Check */}
              <button
                onClick={() => setPromoFilter(!promoFilter)}
                className={`py-1.5 px-3 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  promoFilter
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Pakej Promosi Sahaja</span>
              </button>

              {/* Availability Filter */}
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="py-1.5 px-3 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Jenis Premis</option>
                <option value="highrise">Kondominium / Bertingkat</option>
                <option value="plugandplay">Plug & Play (Tanpa Tebuk)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(category !== 'ALL' || provider !== 'ALL' || searchTerm || priceFilter !== 'ALL' || promoFilter || availabilityFilter !== 'ALL') && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Padam Penapis</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            Menjumpai <strong className="text-white font-mono text-sm">{filteredPlans.length}</strong> pelan
            {category !== 'ALL' && <span> dalam kategori <strong className="text-cyan-400">"{category}"</strong></span>}
            {provider !== 'ALL' && <span> bagi pembekal <strong className="text-cyan-400">"{provider}"</strong></span>}
          </div>
          <Link to="/compare" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Lihat Jadual Perbandingan</span>
          </Link>
        </div>

        {/* Product Cards Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <ProductCard
                key={plan.id}
                plan={plan}
                onApply={(selectedPlan) => {
                  setActivePlanForApply(selectedPlan);
                  setIsApplyModalOpen(true);
                  trackEvent('apply_open', { planId: selectedPlan.id, planName: selectedPlan.name });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Tiada Pakej Dijumpai</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Tiada pelan yang sepadan dengan kriteria tapisan anda. Sila ubah penapis atau hubungi perunding TelcoHauz untuk semakan manual.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Reset Semua Tapisan
            </button>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setActivePlanForApply(null);
        }}
        plan={activePlanForApply}
      />
    </div>
  );
}
