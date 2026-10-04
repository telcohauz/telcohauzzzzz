import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, ShieldCheck, ArrowRight, ExternalLink, Filter } from 'lucide-react';
import { Entity } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onSelectEntity: (entityId: number) => void;
  onInspectTrace: (item: any) => void;
  onRefreshStats: () => void;
}

export const EntitiesView: React.FC<Props> = ({ onSelectEntity, onInspectTrace, onRefreshStats }) => {
  const [entitiesList, setEntitiesList] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [officialName, setOfficialName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [entityType, setEntityType] = useState('Business');
  const [usernameHandle, setUsernameHandle] = useState('');
  const [description, setDescription] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('PERLU SEMAK SEMULA');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/entities');
      if (res.ok) {
        const data = await res.json();
        setEntitiesList(data);
      }
    } catch (err) {
      console.error('Failed to load entities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officialName,
          tradingName,
          entityType,
          usernameHandle,
          description,
          verificationStatus,
          confidence: 'Medium',
          notes,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setOfficialName('');
        setTradingName('');
        setDescription('');
        setUsernameHandle('');
        setNotes('');
        await fetchEntities();
        onRefreshStats();
      }
    } catch (err) {
      console.error('Failed to create entity:', err);
    } finally {
      setCreating(false);
    }
  };

  const filtered = entitiesList.filter((e) => {
    const matchQuery =
      e.officialName.toLowerCase().includes(search.toLowerCase()) ||
      (e.tradingName && e.tradingName.toLowerCase().includes(search.toLowerCase())) ||
      (e.usernameHandle && e.usernameHandle.toLowerCase().includes(search.toLowerCase())) ||
      e.entityId.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'ALL' || e.entityType.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus = statusFilter === 'ALL' || e.verificationStatus.toUpperCase() === statusFilter.toUpperCase();

    return matchQuery && matchType && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Master Entities Registry & Identity Table
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central repository of canonical entities. Entities are never assumed to be separate legal companies without relational validation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Capture New Entity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, handle, or ID (e.g. ENT-001)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Types</option>
              <option value="Brand">Brand</option>
              <option value="Business">Business</option>
              <option value="Digital Asset">Digital Asset</option>
              <option value="Person">Person</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="DISAHKAN">DISAHKAN</option>
              <option value="BERKEMUNGKINAN">BERKEMUNGKINAN</option>
              <option value="PERLU SEMAK SEMULA">PERLU SEMAK SEMULA</option>
              <option value="BERCANGGAH">BERCANGGAH</option>
              <option value="TIDAK DISAHKAN">TIDAK DISAHKAN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entity Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading canonical entities...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No entity records matching current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50">
                      {item.entityId}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      {item.entityType}
                    </span>
                  </div>
                  <VerificationBadge status={item.verificationStatus} size="sm" />
                </div>

                <h2
                  onClick={() => onSelectEntity(item.id)}
                  className="text-lg font-bold text-white group-hover:text-blue-400 cursor-pointer transition flex items-center gap-1.5"
                >
                  {item.officialName}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-400" />
                </h2>

                {item.tradingName && item.tradingName !== item.officialName && (
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Trading Name: <strong className="text-slate-200">{item.tradingName}</strong>
                  </div>
                )}

                {item.description && (
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-slate-500">
                    First Seen: <span className="text-slate-300">{item.firstSeenDate || 'N/A'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Confidence: <span className="text-emerald-400">{item.confidence}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectTrace({
                      recordName: item.officialName,
                      recordType: `Entity (${item.entityType})`,
                      claimText: `Master record for ${item.officialName} (${item.entityId})`,
                      claimStatus: item.verificationStatus,
                      evidenceName: 'Canonical Identity Registry Verification',
                      sourceName: 'Statutory Registry / Cross-Verification Engine',
                      entityName: item.officialName,
                      entityType: item.entityType,
                    })}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                  >
                    Trace
                  </button>
                  <button
                    onClick={() => onSelectEntity(item.id)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Entity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Capture New Canonical Entity</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Traceable provenance required. Do not invent missing data.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Official Name *</label>
                  <input
                    type="text"
                    required
                    value={officialName}
                    onChange={(e) => setOfficialName(e.target.value)}
                    placeholder="e.g. Telcohauz Retail Sdn Bhd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Trading Name</label>
                  <input
                    type="text"
                    value={tradingName}
                    onChange={(e) => setTradingName(e.target.value)}
                    placeholder="e.g. TELCOHAUZ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Entity Type</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 font-sans"
                  >
                    <option value="Business">Business (Enterprise / Sdn Bhd)</option>
                    <option value="Brand">Brand (Trade Brand)</option>
                    <option value="Digital Asset">Digital Asset (Domain / Handle)</option>
                    <option value="Person">Person (Director / Proprietor)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Username / Handle</label>
                  <input
                    type="text"
                    value={usernameHandle}
                    onChange={(e) => setUsernameHandle(e.target.value)}
                    placeholder="@handle or domain"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objective factual description with source references..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Verification Status</label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 font-sans"
                  >
                    <option value="PERLU SEMAK SEMULA">PERLU SEMAK SEMULA</option>
                    <option value="BERKEMUNGKINAN">BERKEMUNGKINAN</option>
                    <option value="DISAHKAN">DISAHKAN</option>
                    <option value="BERCANGGAH">BERCANGGAH</option>
                    <option value="TIDAK DISAHKAN">TIDAK DISAHKAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Auditor Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reference initial source (e.g. SRC-001)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save Canonical Entity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
