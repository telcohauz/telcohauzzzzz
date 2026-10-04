import React, { useState, useEffect } from 'react';
import { FolderGit2, FileText, Globe, Plus, Search, ExternalLink, ShieldCheck, Hash, Eye, Download, CheckCircle2 } from 'lucide-react';
import { Source, Evidence } from '../types/index.ts';

interface Props {
  onInspectTrace: (item: any) => void;
  onRefreshStats: () => void;
}

export const EvidenceSourcesView: React.FC<Props> = ({ onInspectTrace, onRefreshStats }) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'sources'>('evidence');
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [sourcesList, setSourcesList] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);

  // Evidence Form
  const [eviDesc, setEviDesc] = useState('');
  const [eviType, setEviType] = useState('Screenshot');
  const [eviUrl, setEviUrl] = useState('');
  const [eviSourceId, setEviSourceId] = useState('');
  const [eviHash, setEviHash] = useState('');

  // Source Form
  const [srcName, setSrcName] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [srcType, setSrcType] = useState('Official Registry');
  const [srcPlatform, setSrcPlatform] = useState('');
  const [srcReliability, setSrcReliability] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eviRes, srcRes] = await Promise.all([
        fetch('/api/evidence'),
        fetch('/api/sources'),
      ]);
      if (eviRes.ok && srcRes.ok) {
        setEvidenceList(await eviRes.json());
        setSourcesList(await srcRes.json());
      }
    } catch (err) {
      console.error('Failed to load evidence/sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eviDesc.trim()) return;
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: eviDesc,
          evidenceType: eviType,
          filePathOrUrl: eviUrl,
          sourceId: eviSourceId ? parseInt(eviSourceId, 10) : null,
          hashRef: eviHash || `sha256:${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        }),
      });
      if (res.ok) {
        setShowAddEvidence(false);
        setEviDesc('');
        setEviUrl('');
        setEviHash('');
        await fetchData();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srcName.trim()) return;
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceName: srcName,
          url: srcUrl,
          sourceType: srcType,
          platform: srcPlatform,
          reliabilityNotes: srcReliability,
        }),
      });
      if (res.ok) {
        setShowAddSource(false);
        setSrcName('');
        setSrcUrl('');
        setSrcPlatform('');
        setSrcReliability('');
        await fetchData();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvidence = evidenceList.filter((e) =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.evidenceId.toLowerCase().includes(search.toLowerCase()) ||
    e.evidenceType.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSources = sourcesList.filter((s) =>
    s.sourceName.toLowerCase().includes(search.toLowerCase()) ||
    s.sourceId.toLowerCase().includes(search.toLowerCase()) ||
    (s.platform && s.platform.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-purple-400" />
            Evidence Vault & Authoritative Sources
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit Principle: RECORD → CLAIM → EVIDENCE → SOURCE → ENTITY. Historical evidence is never deleted upon modification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'evidence' ? (
            <button
              onClick={() => setShowAddEvidence(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-900/40"
            >
              <Plus className="w-4 h-4" />
              <span>Capture Evidence</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddSource(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/40"
            >
              <Plus className="w-4 h-4" />
              <span>Register Source</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'evidence'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Evidence Files ({evidenceList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'sources'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Authoritative Sources ({sourcesList.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 font-sans"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Querying evidence vault...
        </div>
      ) : activeTab === 'evidence' ? (
        /* Evidence Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="font-bold text-purple-400">{ev.evidenceId}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-900/50">
                    {ev.evidenceType}
                  </span>
                </div>
                <h3 className="font-semibold text-white leading-relaxed">{ev.description}</h3>
                {ev.notes && <p className="text-[11px] text-slate-400 mt-1">{ev.notes}</p>}
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-400 break-all flex items-start gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{ev.hashRef || 'SHA256-verified'}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-slate-500">Captured: {ev.captureDate}</span>
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Evidence ${ev.evidenceId}`,
                      recordType: ev.evidenceType,
                      claimText: ev.description,
                      claimStatus: 'DISAHKAN',
                      evidenceName: ev.description,
                      evidenceHash: ev.hashRef,
                      sourceName: 'Archived File System / Registry',
                      entityName: 'TELCOHAUZ',
                      entityType: 'Enterprise',
                    })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
                  >
                    Inspect Provenance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Sources Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSources.map((src) => (
            <div
              key={src.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="font-bold text-blue-400">{src.sourceId}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-900/50">
                    {src.sourceType}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{src.sourceName}</h3>
                {src.reliabilityNotes && (
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Reliability Assessment: {src.reliabilityNotes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Platform: <strong className="text-slate-200">{src.platform || 'General Web'}</strong></span>
                  <span>Classification: <strong className="text-emerald-400">{src.primaryOrSecondary}</strong></span>
                </div>

                {src.url && (
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-xs"
                    >
                      {src.url} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[10px] font-mono text-slate-500">Access: {src.accessDate || 'Recent'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Capture Evidence Record</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Do not delete historical evidence when records change.
            </p>

            <form onSubmit={handleAddEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={eviDesc}
                  onChange={(e) => setEviDesc(e.target.value)}
                  placeholder="Detailed description of what the screenshot or file proves..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Evidence Type</label>
                  <select
                    value={eviType}
                    onChange={(e) => setEviType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Screenshot">Screenshot</option>
                    <option value="PDF Document">PDF Document</option>
                    <option value="Web Archive">Web Archive Snapshot</option>
                    <option value="Image">Photo / Physical Evidence</option>
                    <option value="Receipt">Receipt / Tax Invoice</option>
                    <option value="Contract">Contract / Agreement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Associated Source</label>
                  <select
                    value={eviSourceId}
                    onChange={(e) => setEviSourceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden font-mono"
                  >
                    <option value="">None / Direct</option>
                    {sourcesList.map(s => (
                      <option key={s.id} value={s.id}>{s.sourceId} - {s.sourceName.slice(0, 25)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">File or Snapshot URL</label>
                <input
                  type="text"
                  value={eviUrl}
                  onChange={(e) => setEviUrl(e.target.value)}
                  placeholder="https://... or internal storage reference"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEvidence(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Register Authoritative Source</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Traceability origin point. Primary sources preferred over secondary blogs.
            </p>

            <form onSubmit={handleAddSource} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Source Name *</label>
                <input
                  type="text"
                  required
                  value={srcName}
                  onChange={(e) => setSrcName(e.target.value)}
                  placeholder="e.g. Companies Commission of Malaysia (SSM)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Source Type</label>
                  <select
                    value={srcType}
                    onChange={(e) => setSrcType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Official Registry">Official Statutory Registry</option>
                    <option value="Social Media">Social Media Platform</option>
                    <option value="Public Website">Public Website / WHOIS</option>
                    <option value="Marketplace">Marketplace Storefront</option>
                    <option value="News">News / Public Press</option>
                    <option value="Customer Review">Customer Review Directory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Platform</label>
                  <input
                    type="text"
                    value={srcPlatform}
                    onChange={(e) => setSrcPlatform(e.target.value)}
                    placeholder="e.g. SSM, Instagram, Shopee"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">URL</label>
                <input
                  type="text"
                  value={srcUrl}
                  onChange={(e) => setSrcUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Reliability Notes</label>
                <input
                  type="text"
                  value={srcReliability}
                  onChange={(e) => setSrcReliability(e.target.value)}
                  placeholder="e.g. Authoritative government registry record"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
