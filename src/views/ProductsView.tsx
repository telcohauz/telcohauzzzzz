import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Tag, DollarSign, ShieldCheck, ExternalLink } from 'lucide-react';
import { Product } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const ProductsView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('TELCOHAUZ Certified');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Repairs');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stockStatus, setStockStatus] = useState('In Stock');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Physical Store & Shopee');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        setProductsList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          brand,
          model,
          category,
          sku,
          price,
          currency: 'MYR',
          stockStatus,
          description,
          platform,
          notes,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setProductName('');
        setModel('');
        setSku('');
        setPrice('');
        setDescription('');
        setNotes('');
        await fetchProducts();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['ALL', 'Repairs', 'Smartphones', 'Accessories', 'Telco Plans', 'Gadgets'];

  const filtered = productsList.filter((p) => {
    const matchSearch =
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.productId.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Hardware & Product Catalogue Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves historical SKU offerings and pricing versions rather than destructively overwriting price adjustments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or brand..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto font-mono">
          <span className="text-slate-500 text-[11px]">Category:</span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  categoryFilter === c
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading product records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No products match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{item.productId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <VerificationBadge status={item.verificationStatus} size="sm" />
                </div>

                <h2 className="text-base font-bold text-white line-clamp-2">{item.productName}</h2>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Brand: <strong className="text-slate-200">{item.brand}</strong> • SKU: <strong className="text-slate-300">{item.sku || 'N/A'}</strong>
                </div>

                {item.description && (
                  <p className="text-slate-300 text-[11px] mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    {item.currency} {item.price}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-900 font-mono text-[10px]">
                    {item.stockStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Channel: {item.platform || 'Direct'}</span>
                  <button
                    onClick={() => onInspectTrace({
                      recordName: item.productName,
                      recordType: `Product (${item.category})`,
                      claimText: `Catalog SKU ${item.sku || item.productId} listed at ${item.currency} ${item.price}`,
                      claimStatus: item.verificationStatus,
                      evidenceName: 'Storefront SKU Snapshot / Invoice Extract',
                      sourceName: item.platform || 'TELCOHAUZ Retail Catalogue',
                      entityName: 'TELCOHAUZ',
                      entityType: 'Brand',
                    })}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Trace Provenance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Catalog Product Entry</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Maintains historical catalog state.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Authentic iPhone 13 Screen Assembly"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Repairs">Repairs & Parts</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Telco Plans">Telco Plans</option>
                    <option value="Gadgets">Gadgets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">SKU / Model Number</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="TH-SKU-001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Price (MYR) *</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 299.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Platform Channels</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. Physical Store, Shopee Official, TikTok Shop"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specs, warranty terms, and origin..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
