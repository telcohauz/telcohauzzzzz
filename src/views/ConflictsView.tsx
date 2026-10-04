import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Search, AlertTriangle, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { ConflictItem } from '../types/index.ts';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const ConflictsView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [conflictsList, setConflictsList] = useState<ConflictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [infoA, setInfoA] = useState('');
  const [infoB, setInfoB] = useState('');
  const [conflictType, setConflictType] = useState('Address Discrepancy');
  const [requiredVerification, setRequiredVerification] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/conflicts');
      if (res.ok) {
        setConflictsList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !infoA.trim() || !infoB.trim()) return;

    try {
      const res = await fetch('/api/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          informationA: infoA,
          informationB: infoB,
          conflictType,
          currentStatus: 'Active Conflict',
          requiredVerification,
          notes,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setSubject('');
        setInfoA('');
        setInfoB('');
        setRequiredVerification('');
        setNotes('');
        await fetchConflicts();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = conflictsList.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.conflictId.toLowerCase().includes(search.toLowerCase()) ||
    c.informationA.toLowerCase().includes(search.toLowerCase()) ||
    c.informationB.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            Contradictory Information & Conflict Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Core Data Quality Rule: Never silently overwrite conflicting information. Document discrepancies side-by-side until definitively verified.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Conflict</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conflicts by subject or mismatched details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-orange-500 font-sans"
          />
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Active Discrepancies: <strong className="text-orange-400">{conflictsList.length}</strong>
        </div>
      </div>

      {/* Conflicts List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Scanning contradictory findings...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No conflicts currently recorded. Data hygiene healthy.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/40 shadow-lg shadow-orange-950/20 space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800/60">
                    {item.conflictId}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {item.conflictType}
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border ${
                  item.currentStatus === 'Resolved'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-orange-950 text-orange-300 border-orange-800 animate-pulse'
                }`}>
                  {item.currentStatus}
                </span>
              </div>

              <h2 className="text-base font-bold text-white tracking-wide">{item.subject}</h2>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-blue-400 font-bold uppercase">Record / Source A</span>
                    <span className="text-slate-500">Statutory Baseline</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">{item.informationA}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-amber-400 font-bold uppercase">Record / Source B</span>
                    <span className="text-slate-500">Field / Online Data</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">{item.informationB}</p>
                </div>
              </div>

              {/* Required Verification Resolution */}
              {item.requiredVerification && (
                <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-900/50 text-[11px] text-orange-200 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-orange-300 block mb-0.5">Verification Action Required:</strong>
                    {item.requiredVerification}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>Rule: Both values preserved in historical ledger</span>
                <button
                  onClick={() => onInspectTrace({
                    recordName: `Conflict ${item.conflictId}`,
                    recordType: item.conflictType,
                    claimText: item.subject,
                    claimStatus: 'BERCANGGAH',
                    evidenceName: 'Contradictory Source Cross-Comparison',
                    sourceName: 'SSM vs Live Operational Listing',
                    entityName: 'TELCOHAUZ',
                    entityType: 'Enterprise',
                  })}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Trace Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Conflict Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Record Information Conflict</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Preserves contradictory findings for formal auditor reconciliation.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Subject / Mismatch Title *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Registered Office vs Walk-in Storefront Location"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Conflict Type</label>
                <select
                  value={conflictType}
                  onChange={(e) => setConflictType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  <option value="Address Discrepancy">Address Discrepancy</option>
                  <option value="Ownership Mismatch">Ownership Mismatch</option>
                  <option value="Date Discrepancy">Date Discrepancy</option>
                  <option value="Price Conflict">Price Conflict</option>
                  <option value="Legal Name Discrepancy">Legal Name Discrepancy</option>
                  <option value="Identity Overlap">Identity Overlap</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Information A (Baseline / Statutory) *</label>
                <textarea
                  required
                  rows={2}
                  value={infoA}
                  onChange={(e) => setInfoA(e.target.value)}
                  placeholder="State verbatim finding A and source..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Information B (Contradictory / Field) *</label>
                <textarea
                  required
                  rows={2}
                  value={infoB}
                  onChange={(e) => setInfoB(e.target.value)}
                  placeholder="State verbatim finding B and source..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Required Verification Step</label>
                <input
                  type="text"
                  value={requiredVerification}
                  onChange={(e) => setRequiredVerification(e.target.value)}
                  placeholder="Action necessary to reconcile (e.g. Request SSM Form 13)..."
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
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Log Conflict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
