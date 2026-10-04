import React, { useState, useEffect } from 'react';
import { CopyX, Plus, Search, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { DuplicateRecord, DuplicateDecision } from '../types/index.ts';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const DuplicatesControlView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [duplicatesList, setDuplicatesList] = useState<DuplicateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [recordTable, setRecordTable] = useState('entities');
  const [recordId, setRecordId] = useState('');
  const [possibleDuplicateId, setPossibleDuplicateId] = useState('');
  const [matchReason, setMatchReason] = useState('');
  const [decision, setDecision] = useState<DuplicateDecision>('Needs Review');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/duplicates');
      if (res.ok) {
        setDuplicatesList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load duplicates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId.trim() || !possibleDuplicateId.trim()) return;

    try {
      const res = await fetch('/api/duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordTable,
          recordId,
          possibleDuplicateId,
          matchReason,
          decision,
          notes,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setRecordId('');
        setPossibleDuplicateId('');
        setMatchReason('');
        setNotes('');
        await fetchDuplicates();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const decisions: DuplicateDecision[] = ['Merge', 'Keep Separate', 'False Positive', 'Needs Review'];

  const filtered = duplicatesList.filter((d) => {
    const matchSearch =
      d.recordId.toLowerCase().includes(search.toLowerCase()) ||
      d.possibleDuplicateId.toLowerCase().includes(search.toLowerCase()) ||
      d.matchReason.toLowerCase().includes(search.toLowerCase());

    const matchDecision = decisionFilter === 'ALL' || d.decision === decisionFilter;

    return matchSearch && matchDecision;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CopyX className="w-5 h-5 text-rose-400" />
            Duplicate & False Positive Prevention Control
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict Standard: Never automatically merge entities based only on matching names. Retain distinct identity records with documented rationale.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-rose-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Flag Potential Duplicate</span>
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
            placeholder="Search records or match reasons..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500 text-[11px]">Decision:</span>
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Decisions</option>
            {decisions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Duplicates List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          Analyzing duplicate control ledger...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No records currently flagged as duplicates or false positives.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400 uppercase">
                    Table: {item.recordTable}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-mono">Reviewer: {item.reviewer || 'Forensic Auditor'}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border ${
                  item.decision === 'Keep Separate'
                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                    : item.decision === 'False Positive'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : item.decision === 'Merge'
                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  Decision: {item.decision}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Primary Record:</span>
                  <span className="font-bold text-white font-mono text-sm">{item.recordId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Potential Match / Duplicate:</span>
                  <span className="font-bold text-slate-300 font-mono text-sm">{item.possibleDuplicateId}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                <div><strong className="text-slate-400 font-mono">Match Factor:</strong> {item.matchReason}</div>
                {item.notes && <div><strong className="text-slate-400 font-mono">Auditor Verdict:</strong> {item.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Flag Duplicate or False Positive</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Prevents erroneous data merges and tracks deliberate identity separation.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Record Identifier *</label>
                  <input
                    type="text"
                    required
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="e.g. ENT-003 (@telcohauz)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Potential Match *</label>
                  <input
                    type="text"
                    required
                    value={possibleDuplicateId}
                    onChange={(e) => setPossibleDuplicateId(e.target.value)}
                    placeholder="e.g. ENT-001 (TELCOHAUZ)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Match Reason / Similarity *</label>
                <input
                  type="text"
                  required
                  value={matchReason}
                  onChange={(e) => setMatchReason(e.target.value)}
                  placeholder="e.g. Identical wordmark string with different asset role"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Auditor Determination</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as DuplicateDecision)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  <option value="Keep Separate">Keep Separate (Distinct legal or asset types)</option>
                  <option value="False Positive">False Positive (Unrelated entity / coincidence)</option>
                  <option value="Merge">Merge (Identical duplicate created in error)</option>
                  <option value="Needs Review">Needs Review (Under forensic investigation)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Auditor Justification</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain why these records should remain distinct or merged..."
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
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Save Control Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
