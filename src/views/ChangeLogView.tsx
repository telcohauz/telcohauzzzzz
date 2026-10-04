import React, { useState, useEffect } from 'react';
import { History, Search, ShieldCheck, Clock, User, ArrowRight } from 'lucide-react';
import { ChangeLogRecord } from '../types/index.ts';

export const ChangeLogView: React.FC = () => {
  const [logs, setLogs] = useState<ChangeLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/change-log');
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) =>
    l.recordId.toLowerCase().includes(search.toLowerCase()) ||
    l.recordTable.toLowerCase().includes(search.toLowerCase()) ||
    l.fieldChanged.toLowerCase().includes(search.toLowerCase()) ||
    l.changedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          Forensic Change Log & Immutable Audit Ledger
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete chain of custody. Every modification to verification verdicts, claims, and entity states is recorded for statutory traceability.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search change log by table, record ID, or auditor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 font-sans"
          />
        </div>
        <span className="font-mono text-slate-400 text-xs hidden sm:block">
          Recorded Transactions: <strong className="text-emerald-400">{logs.length}</strong>
        </span>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading audit ledger...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No modifications recorded yet. Baseline data is preserved.
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Table / Scope</th>
                <th className="pb-3 px-3">Record ID</th>
                <th className="pb-3 px-3">Field Changed</th>
                <th className="pb-3 px-3">State Transition</th>
                <th className="pb-3 px-3">Auditor</th>
                <th className="pb-3 px-3">Reason / Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(item.changedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-blue-400 font-bold uppercase text-[10px]">
                      {item.recordTable}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white font-semibold">
                    {item.recordId}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.fieldChanged}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-500 line-through truncate max-w-[120px]">
                        {item.previousValue || 'none'}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="text-emerald-400 font-bold truncate max-w-[150px]">
                        {item.newValue || 'created'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {item.changedBy}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                    {item.reason || 'Routine audit update'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
