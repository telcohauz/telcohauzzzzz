import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Radio,
  Smartphone,
  Tv,
  Droplets,
  Building,
  Sun,
  Cpu,
  Scale,
  Zap,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react';
import {
  TELCO_PLANS,
  PROMOTIONS,
  TELCO_NEWS,
  CONSUMER_GUIDES,
  QUICK_CATEGORIES,
  PROVIDERS_INFO,
  TelcoPlan,
  Promotion
} from '../../data/telcoData.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { PromotionCard } from '../components/PromotionCard.tsx';
import { ApplyModal } from '../components/ApplyModal.tsx';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalPlan, setActiveModalPlan] = useState<TelcoPlan | null>(null);
  const [activeModalPromo, setActiveModalPromo] = useState<Promotion | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Quick eligibility inline form state
  const [quickAddress, setQuickAddress] = useState('');
  const [quickService, setQuickService] = useState('Fibre Internet');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleOpenApplyPlan = (plan: TelcoPlan) => {
    setActiveModalPlan(plan);
    setActiveModalPromo(null);
    setIsApplyModalOpen(true);
  };

  const handleOpenApplyPromo = (promo: Promotion) => {
    setActiveModalPromo(promo);
    setActiveModalPlan(null);
    setIsApplyModalOpen(true);
  };

  const filteredFeaturedPlans = TELCO_PLANS.filter((p) => {
    if (selectedCategory === 'ALL') return p.isFeatured || p.isPopular;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return <Wifi className="w-5 h-5 text-cyan-400" />;
      case 'Radio': return <Radio className="w-5 h-5 text-emerald-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'Tv': return <Tv className="w-5 h-5 text-fuchsia-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-sky-400" />;
      case 'Building': return <Building className="w-5 h-5 text-amber-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      default: return <Cpu className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleQuickEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/eligibility?address=${encodeURIComponent(quickAddress)}&service=${encodeURIComponent(quickService)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ========================================================
          1. HERO SECTION (Mobile-First)
          ======================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Market Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-md shadow-cyan-950/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Pusat Perbandingan & Pendaftaran Bebas Malaysia</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
              Bandingkan Tawaran.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Pilih Yang Sesuai.
              </span>{' '}
              Mohon Dengan TelcoHauz.
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Cari internet rumah, fibre, 5G, mobile, Astro, appliance, water purifier, solar dan tawaran digital yang sesuai untuk anda.
            </p>

            {/* Search Bar (Homepage Section 2) */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-2xl shadow-cyan-950/40 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/95 focus-within:border-cyan-500 transition-colors p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Apa yang anda cari? (Contoh: Fibre RM100, 5G, Astro, Cuckoo...)"
                  className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer shadow-md"
                >
                  Cari Tawaran
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
                <span className="text-slate-400 mr-1">Cadangan:</span>
                {[
                  'Fibre RM99',
                  'TIME 200Mbps',
                  'Unifi 300Mbps',
                  '5G Wireless RM58',
                  'Cuckoo RM60',
                  'Astro Kombo',
                ].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sugg);
                      navigate(`/products?q=${encodeURIComponent(sugg)}`);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-[11px] transition-colors cursor-pointer"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </form>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-900/40 hover:shadow-cyan-800/60 transition-all flex items-center justify-center gap-2"
              >
                <span>JELAJAHI TAWARAN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/eligibility"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>SEMAK KELAYAKAN</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pilihan Pelbagai Jenama</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Semakan Liputan Percuma</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bantuan Pendaftaran Rasmi</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sifar Caj Tersembunyi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. POPULAR CATEGORIES (Quick Categories)
          ======================================================== */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Pilih Kategori Anda
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Kategori Produk & Perkhidmatan
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-2 sm:mt-0"
            >
              Lihat Semua Kategori <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.id)}`}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-cyan-500/40 flex items-center justify-center mb-3 transition-colors">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold">{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-300 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. PROMOTIONS SECTION
          ======================================================== */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Rebat & Tawaran Terhad 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Promosi & Rebat Jimat Terkini
              </h2>
            </div>
            <Link
              to="/promotions"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-2 sm:mt-0"
            >
              Semua Promosi ({PROMOTIONS.length}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOTIONS.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                onApply={handleOpenApplyPromo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED PRODUCTS (Product Catalogue Preview)
          ======================================================== */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Pilihan Terbaik Pengguna
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Pelan & Pakej Paling Popular
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Kadar bulanan rasmi tanpa sebarang penambahan caj tersembunyi.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'Fibre', '5G', 'Mobile', 'Astro', 'Water Purifier', 'Solar'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Pilihan' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeaturedPlans.slice(0, 6).map((plan) => (
              <ProductCard
                key={plan.id}
                plan={plan}
                onApply={handleOpenApplyPlan}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors"
            >
              <span>Terokai Katalog Lengkap Pelan ({TELCO_PLANS.length} Pakej)</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. COMPARE ENGINE PREVIEW
          ======================================================== */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-cyan-950/40 border border-blue-800/40 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80">
                Alat Perbandingan Bebas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">
                Bandingkan 2 Hingga 4 Pelan Sebelah-Menyebelah
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Ketahui perbezaan kelajuan muat naik, penjimatan rebat bulanan, model router WiFi 6 yang disertakan, dan tempoh kontrak tanpa berat sebelah.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/compare"
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-colors shadow-lg shadow-cyan-900/40 flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  Buka Enjin Perbandingan
                </Link>
                <Link
                  to="/products"
                  className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4"
                >
                  Pilih Pelan Untuk Dibandingkan
                </Link>
              </div>
            </div>

            {/* Interactive Preview Table Snippet */}
            <div className="mt-8 lg:mt-0 lg:absolute lg:top-8 lg:right-8 lg:w-96 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-4 text-xs space-y-3 shadow-xl pointer-events-none">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Contoh Perbandingan</span>
                <span className="text-emerald-400">Auto-Matrix</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-pink-400">TIME 200M</div>
                  <div className="text-lg font-black text-white mt-1">RM99</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Simetri 200M Up</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-orange-400">Unifi 300M</div>
                  <div className="text-lg font-black text-white mt-1">RM129</div>
                  <div className="text-[10px] text-cyan-400 font-semibold">Liputan Terluas</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                Klik ikon "Bandingkan" pada mana-mana kad untuk bandingkan segera.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. ELIGIBILITY CHECKER (Inline Module)
          ======================================================== */}
      <section className="py-16 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Semakan Pantas Dalam 5 Minit
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Semak Kelayakan Port Fibre & Rangkaian Di Lokasi Anda
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Sebelum membuat keputusan, pastikan jenis kabel gentian kaca atau isyarat 5G yang sampai ke alamat anda. TelcoHauz membuat semakan silang dengan pangkalan data pembekal.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Liputan gentian optik TIME dotCom, TM HSBB, Maxis Fibre & ALLO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Kekuatan isyarat 5G Wireless Home Broadband (YES & U Mobile)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Semakan baki port tanpa perlu beratur di kaunter</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleQuickEligibilitySubmit}
                className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Pemeriksa Kelayakan Alamat Percuma
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-mono font-semibold">100% Percuma</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Alamat Rumah / Bangunan / Poskod Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={quickAddress}
                    onChange={(e) => setQuickAddress(e.target.value)}
                    placeholder="Contoh: Kondo Seri Maya, Jalan Jelatek, 54200 KL"
                    className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Jenis Perkhidmatan Yang Dicari
                  </label>
                  <select
                    value={quickService}
                    onChange={(e) => setQuickService(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Fibre Internet">Internet Rumah Fibre (TIME / Unifi / Maxis / CelcomDigi)</option>
                    <option value="5G Wireless">5G Wireless Broadband (Plug & Play Tanpa Wayar)</option>
                    <option value="Mobile 5G">Pelan Telefon 5G / Tukar Telco (MNP)</option>
                    <option value="Astro Kombo">Astro TV & Internet Fibre</option>
                    <option value="Water Purifier">Penapis Air (Cuckoo / Coway)</option>
                    <option value="Business Fibre">Business Fibre Pejabat</option>
                    <option value="Solar">Solar Bumbung Rumah</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mula Semak Kelayakan Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. RECOMMENDATION ENGINE CALLOUT
          ======================================================== */}
      <section className="py-14 bg-gradient-to-r from-blue-950/50 via-slate-900 to-cyan-950/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Kuiz Padanan Pintar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Tidak Pasti Berapa Kelajuan Mbps Yang Anda Perlukan?
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Jawab 3 soalan mudah mengenai bilangan pengguna dan kegunaan di rumah untuk mendapatkan cadangan pelan yang 100% tepat mengikut bajet anda.
              </p>
            </div>

            <Link
              to="/recommend"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-amber-950/40 flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buka Pencari Pelan Pintar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. TELCO NEWS & UPDATES
          ======================================================== */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Pemberitahuan Industri & Pasaran
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Berita & Analisis Telco Malaysia
              </h2>
            </div>
            <Link
              to="/news"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-2 sm:mt-0"
            >
              Semua Berita <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TELCO_NEWS.map((item) => (
              <article
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span className="text-cyan-400 font-semibold">{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>

                  <Link to={`/news/${item.slug}`} className="block group-hover:text-cyan-300 transition-colors">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                      {item.headline}
                    </h3>
                  </Link>

                  <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/news/${item.slug}`}
                    className="text-slate-400 hover:text-white inline-flex items-center gap-1 text-[11px]"
                  >
                    Baca <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10. CONSUMER GUIDES (Panduan Pengguna)
          ======================================================== */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Pendidikan Pengguna Telus
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Panduan Telco & Internet Rumah
              </h2>
            </div>
            <Link
              to="/guides"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-2 sm:mt-0"
            >
              Semua Panduan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONSUMER_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between transition-colors group"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                    {guide.category}
                  </span>

                  <Link to={`/guides/${guide.slug}`} className="block group-hover:text-emerald-300 transition-colors mt-3">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                      {guide.title}
                    </h3>
                  </Link>

                  <p className="mt-2.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="font-semibold text-slate-300">Langkah Utama:</div>
                    <div className="truncate text-slate-400">1. {guide.steps[0]?.title}</div>
                    <div className="truncate text-slate-400">2. {guide.steps[1]?.title}</div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{guide.readTime}</span>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    Buka Panduan <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          11. WHY TELCOHAUZ (Nilai & Kepercayaan)
          ======================================================== */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Kelebihan Menggunakan TelcoHauz
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Mengapa Beribu Rakyat Malaysia Memilih TelcoHauz?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Kami memudahkan urusan permohonan tanpa sebarang komplikasi dan sentiasa mendahulukan keperluan pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Perbandingan Bebas</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Kami tidak terikat secara eksklusif dengan mana-mana telco tunggal, membolehkan kami memberi cadangan pakej yang benar-benar menjimatkan poket anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Harga Asas Rasmi</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Semua harga pelan dan promosi rebat yang dipaparkan adalah sama seperti terbitan rasmi pembekal tanpa sebarang penambahan surcaj ejen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Sokongan WhatsApp Pantas</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Bantuan terus melalui sembang WhatsApp tanpa perlu menunggu nombor giliran atau melalui sistem telefon automatik IVR yang merumitkan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Entiti Sah Berdaftar</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Dikendalikan oleh <strong>TelcoHauz Phone Enterprise</strong> dengan rekod pendaftaran perniagaan sah di Malaysia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          12. WHATSAPP CONVERSION CTA SECTION
          ======================================================== */}
      <section className="py-16 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-t border-emerald-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ada Sebarang Soalan Atau Mahu Bantuan Pendaftaran Pantas?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Perunding TelcoHauz sedia menjawab soalan mengenai port fibre, pertukaran nombor MNP, tarikh pemasangan, dan rebat terbaik untuk alamat kediaman anda.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/601123456789?text=${encodeURIComponent(
                'Salam TelcoHauz, saya ingin bantuan semakan pakej internet dan promosi terkini di kawasan saya.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Sembang di WhatsApp Sekarang</span>
            </a>

            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm tracking-wide transition-colors"
            >
              Borang Semakan Online
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            Waktu Operasi Perunding: Isnin - Ahad, 9:00 AM - 10:00 PM (Termasuk Cuti Umum)
          </div>
        </div>
      </section>

      {/* Global Application Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        plan={activeModalPlan}
        promotion={activeModalPromo}
      />
    </div>
  );
}
