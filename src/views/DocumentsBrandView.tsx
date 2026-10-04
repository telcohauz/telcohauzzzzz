import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Palette, FileCheck2, ExternalLink } from 'lucide-react';
import { BrandAsset, SOPDocument } from '../types/index.ts';

export const DocumentsBrandView: React.FC = () => {
  const [subTab, setSubTab] = useState<'brand' | 'sop'>('brand');
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [sopDocs, setSopDocs] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [brandRes, sopRes] = await Promise.all([
        fetch('/api/brand-assets'),
        fetch('/api/sop'),
      ]);
      if (brandRes.ok && sopRes.ok) {
        setBrandAssets(await brandRes.json());
        setSopDocs(await sopRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Brand Assets, Trademarks & Standard Operating Procedures
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Audited corporate assets and internal investigation methodologies for the TELCOHAUZ Knowledge Hub.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('brand')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            subTab === 'brand'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand Assets & Trademarks ({brandAssets.length})</span>
        </button>
        <button
          onClick={() => setSubTab('sop')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            subTab === 'sop'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Investigation SOPs ({sopDocs.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading document repository...
        </div>
      ) : subTab === 'brand' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{asset.assetName}</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px] border border-blue-800">
                  {asset.assetType}
                </span>
              </div>

              {/* Color swatch demonstration */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-[#0052cc] border border-white/20 shadow-xs" title="Electric Cobalt #0052cc" />
                <div className="w-7 h-7 rounded-lg bg-[#0a192f] border border-white/20 shadow-xs" title="Navy Dark #0a192f" />
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-400 shadow-xs" title="Clean White" />
                <div className="text-[11px] font-mono text-slate-300 ml-2">
                  Palette: #0052CC • #0A192F • #FFFFFF
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Trademark Application:</span>
                  <span className="text-white font-semibold">{asset.trademarkNumber || 'Under Application'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Registration Status:</span>
                  <span className="text-amber-400">{asset.registrationStatus}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>First Observed Use:</span>
                  <span className="text-slate-200">{asset.firstSeen || '2021'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sopDocs.map((sop) => (
            <div
              key={sop.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">{sop.title}</h2>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-800">
                    {sop.version}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                  {sop.status}
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
                {sop.contentSummary}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Category: {sop.category} • Author: {sop.author || 'Compliance Directorate'}</span>
                <span>Last Reviewed: {sop.lastReviewed}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
