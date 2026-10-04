import React, { useState, useEffect } from 'react';
import { GitFork, Plus, Search, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';
import { Relationship, Entity } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onInspectTrace: (item: any) => void;
  onRefreshStats: () => void;
  onSelectEntity: (entityId: number) => void;
}

export const RelationshipsView: React.FC<Props> = ({ onInspectTrace, onRefreshStats, onSelectEntity }) => {
  const [relationshipsList, setRelationshipsList] = useState<Relationship[]>([]);
  const [entitiesList, setEntitiesList] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [entityAId, setEntityAId] = useState('');
  const [entityBId, setEntityBId] = useState('');
  const [relType, setRelType] = useState('Brand');
  const [description, setDescription] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('DISAHKAN');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [relRes, entRes] = await Promise.all([
        fetch('/api/relationships'),
        fetch('/api/entities'),
      ]);
      if (relRes.ok && entRes.ok) {
        setRelationshipsList(await relRes.json());
        setEntitiesList(await entRes.json());
      }
    } catch (err) {
      console.error('Failed to load relationships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityAId || !entityBId) return;

    try {
      const res = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityAId,
          entityBId,
          relationshipType: relType,
          description,
          verificationStatus,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setDescription('');
        await fetchData();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getEntityName = (id: number) => {
    const ent = entitiesList.find(e => e.id === id);
    return ent ? ent.officialName : `Entity #${id}`;
  };

  const relationshipTypes = [
    'Owner',
    'Founder',
    'Director',
    'Employee',
    'Partner',
    'Vendor',
    'Distributor',
    'Customer',
    'Marketplace',
    'Website',
    'Social Account',
    'Product',
    'Brand',
    'Related Entity',
    'Mentioned Entity',
    'Other'
  ];

  const filtered = relationshipsList.filter((r) =>
    r.relationshipId.toLowerCase().includes(search.toLowerCase()) ||
    r.relationshipType.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
    getEntityName(r.entityAId).toLowerCase().includes(search.toLowerCase()) ||
    getEntityName(r.entityBId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-400" />
            Verified Relational Links & Identity Graph
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict Data Quality Standard: Never infer a relationship merely because names are similar. All relational links require traceable proof.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Link Entities</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by relationship type, entity name, or ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 font-sans"
          />
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Total Linked Relations: <strong className="text-blue-400">{relationshipsList.length}</strong>
        </div>
      </div>

      {/* Relationships Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading relational network...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No relationship links matching filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rel) => {
            const entAName = getEntityName(rel.entityAId);
            const entBName = getEntityName(rel.entityBId);

            return (
              <div
                key={rel.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50">
                      {rel.relationshipId}
                    </span>
                    <VerificationBadge status={rel.verificationStatus} size="sm" />
                  </div>

                  {/* Visual Node Link */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => onSelectEntity(rel.entityAId)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 font-bold text-white text-xs hover:text-blue-400 transition"
                    >
                      {entAName}
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 font-mono text-[11px] text-blue-300 font-bold uppercase tracking-wider">
                      <span>──</span>
                      <span>[{rel.relationshipType}]</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </div>

                    <button
                      onClick={() => onSelectEntity(rel.entityBId)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 font-bold text-white text-xs hover:text-blue-400 transition"
                    >
                      {entBName}
                    </button>
                  </div>

                  {rel.description && (
                    <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                      {rel.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 flex items-center justify-end shrink-0">
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `${entAName} → ${entBName}`,
                      recordType: `Relational Link (${rel.relationshipType})`,
                      claimText: rel.description || `Verified relationship of type ${rel.relationshipType}`,
                      claimStatus: rel.verificationStatus,
                      evidenceName: 'Verified Relationship Schedule',
                      sourceName: 'Cross-Entity Audit Registry',
                      entityName: entAName,
                      entityType: 'Enterprise Node',
                    })}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
                  >
                    Trace Evidence
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Create Relational Link</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Do not infer relationships without verifiable documentation.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Origin Entity (A) *</label>
                  <select
                    required
                    value={entityAId}
                    onChange={(e) => setEntityAId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="">Select Entity A</option>
                    {entitiesList.map(e => (
                      <option key={e.id} value={e.id}>{e.officialName} ({e.entityId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Entity (B) *</label>
                  <select
                    required
                    value={entityBId}
                    onChange={(e) => setEntityBId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="">Select Entity B</option>
                    {entitiesList.map(e => (
                      <option key={e.id} value={e.id}>{e.officialName} ({e.entityId})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Relationship Type</label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  {relationshipTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description & Provenance</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Document how this connection was verified..."
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
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Establish Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
