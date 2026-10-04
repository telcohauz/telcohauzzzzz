import React, { useState, useEffect } from 'react';
import { FileCheck2, Plus, Search, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { Claim, VerificationStatus } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onInspectTrace: (item: any) => void;
  onRefreshStats: () => void;
}

export const ClaimsVerificationView: React.FC<Props> = ({ onInspectTrace, onRefreshStats }) => {
  const [claimsList, setClaimsList] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Verify Modal
  const [verifyingClaim, setVerifyingClaim] = useState<Claim | null>(null);
  const [newStatus, setNewStatus] = useState<VerificationStatus>('DISAHKAN');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifyMethod, setVerifyMethod] = useState('Direct Source Cross-check');
  const [submitting, setSubmitting] = useState(false);

  // New Claim Modal
  const [showAddClaim, setShowAddClaim] = useState(false);
  const [newClaimText, setNewClaimText] = useState('');
  const [newClaimType, setNewClaimType] = useState('Fact');
  const [newSupporting, setNewSupporting] = useState('');
  const [newContradicting, setNewContradicting] = useState('');
  const [newAuditorNotes, setNewAuditorNotes] = useState('');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/claims');
      if (res.ok) {
        setClaimsList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingClaim) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/claims/${verifyingClaim.id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: newStatus,
          verificationMethod: verifyMethod,
          notes: verifyNotes,
        }),
      });
      if (res.ok) {
        setVerifyingClaim(null);
        setVerifyNotes('');
        await fetchClaims();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimText.trim()) return;
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimText: newClaimText,
          claimType: newClaimType,
          supportingEvidence: newSupporting,
          contradictingEvidence: newContradicting,
          verificationStatus: 'PERLU SEMAK SEMULA',
          auditorNotes: newAuditorNotes,
        }),
      });
      if (res.ok) {
        setShowAddClaim(false);
        setNewClaimText('');
        setNewSupporting('');
        setNewContradicting('');
        setNewAuditorNotes('');
        await fetchClaims();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = claimsList.filter((c) => {
    const matchSearch =
      c.claimText.toLowerCase().includes(search.toLowerCase()) ||
      c.claimId.toLowerCase().includes(search.toLowerCase()) ||
      (c.auditorNotes && c.auditorNotes.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'ALL' || c.claimType === typeFilter;
    const matchStatus = statusFilter === 'ALL' || c.verificationStatus === statusFilter;

    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            Claims Engine & Verification Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit Rule: Do not present unverified claims as facts. Clearly distinguish between Fact, Claim, Opinion, and Analysis.
          </p>
        </div>

        <button
          onClick={() => setShowAddClaim(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Attribute New Claim</span>
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
            placeholder="Search claims or auditor remarks..."
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
              <option value="Fact">Fact</option>
              <option value="Claim">Claim</option>
              <option value="Opinion">Opinion</option>
              <option value="Analysis">Analysis</option>
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
              <option value="DIBATALKAN">DIBATALKAN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Analyzing claims ledger...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No claims matching the active criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50">
                      {item.claimId}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                      item.claimType === 'Fact'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                        : item.claimType === 'Claim'
                        ? 'bg-amber-950 text-amber-300 border-amber-800/60'
                        : item.claimType === 'Opinion'
                        ? 'bg-purple-950 text-purple-300 border-purple-800/60'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
                    }`}>
                      {item.claimType}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Confidence: <strong className="text-slate-200">{item.confidence}</strong>
                    </span>
                  </div>

                  <VerificationBadge status={item.verificationStatus} size="sm" />
                </div>

                <div className="text-sm font-semibold text-white leading-relaxed pt-1">
                  "{item.claimText}"
                </div>

                {/* Evidence links */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                  {item.supportingEvidence && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                      <strong className="block text-emerald-400 text-[10px] uppercase mb-0.5">Supporting Evidence:</strong>
                      {item.supportingEvidence}
                    </div>
                  )}
                  {item.contradictingEvidence && (
                    <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300">
                      <strong className="block text-rose-400 text-[10px] uppercase mb-0.5">Contradicting Evidence:</strong>
                      {item.contradictingEvidence}
                    </div>
                  )}
                </div>

                {item.auditorNotes && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Auditor Remarks:</span>
                    {item.auditorNotes}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-[10px] font-mono text-slate-500">
                  First Seen: {item.firstSeen || 'N/A'} • Last Checked: {item.lastChecked || 'N/A'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Claim ${item.claimId}`,
                      recordType: `Claim (${item.claimType})`,
                      claimText: item.claimText,
                      claimStatus: item.verificationStatus,
                      evidenceName: item.supportingEvidence || 'Statutory Source Extract',
                      sourceName: 'Cross-Verification Register',
                      entityName: 'TELCOHAUZ',
                      entityType: 'Enterprise',
                    })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
                  >
                    Trace
                  </button>
                  <button
                    onClick={() => {
                      setVerifyingClaim(item);
                      setNewStatus(item.verificationStatus);
                    }}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-xs"
                  >
                    Update Verification
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verify Claim Modal */}
      {verifyingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Update Verification Status</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Audit attestation will be permanently timestamped in the Forensic Change Log.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 text-xs font-medium text-slate-200">
              "{verifyingClaim.claimText}"
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">New Verification Verdict *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as VerificationStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden"
                >
                  <option value="DISAHKAN">DISAHKAN (Formally Verified Fact)</option>
                  <option value="BERKEMUNGKINAN">BERKEMUNGKINAN (Probable / Corroborated)</option>
                  <option value="PERLU SEMAK SEMULA">PERLU SEMAK SEMULA (Pending Audit)</option>
                  <option value="BERCANGGAH">BERCANGGAH (Contradictory Finding)</option>
                  <option value="TIDAK DISAHKAN">TIDAK DISAHKAN (Unverified Assertion)</option>
                  <option value="DIBATALKAN">DIBATALKAN (Revoked / Disproven)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Verification Method</label>
                <select
                  value={verifyMethod}
                  onChange={(e) => setVerifyMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  <option value="Direct Source Cross-check">Direct Source Cross-check</option>
                  <option value="Official Registry Check (SSM)">Official Registry Check (SSM)</option>
                  <option value="WHOIS / DNS Record Check">WHOIS / DNS Record Check</option>
                  <option value="Physical Premise On-site Inspection">Physical Premise On-site Inspection</option>
                  <option value="Document Comparison Analysis">Document Comparison Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Auditor Notes & Rationale *</label>
                <textarea
                  required
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Justification for verdict change and reference evidence..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVerifyingClaim(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Applying...' : 'Commit Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Claim Modal */}
      {showAddClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Attribute New Claim / Assertion</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Do not conflate unverified statements with verified facts.
            </p>

            <form onSubmit={handleAddClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Claim Text *</label>
                <textarea
                  required
                  rows={2}
                  value={newClaimText}
                  onChange={(e) => setNewClaimText(e.target.value)}
                  placeholder="State the assertion verbatim as observed..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Claim Classification</label>
                <select
                  value={newClaimType}
                  onChange={(e) => setNewClaimType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  <option value="Fact">Fact (Corroborated by primary registry)</option>
                  <option value="Claim">Claim (Self-asserted statement by entity)</option>
                  <option value="Opinion">Opinion (Customer or public sentiment)</option>
                  <option value="Analysis">Analysis (Auditor deductive synthesis)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Supporting Evidence Ref</label>
                <input
                  type="text"
                  value={newSupporting}
                  onChange={(e) => setNewSupporting(e.target.value)}
                  placeholder="e.g. EVI-001 (SSM Official Certificate)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Contradicting Evidence (if any)</label>
                <input
                  type="text"
                  value={newContradicting}
                  onChange={(e) => setNewContradicting(e.target.value)}
                  placeholder="e.g. Third-party listing with conflicting address"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Auditor Remarks</label>
                <textarea
                  rows={2}
                  value={newAuditorNotes}
                  onChange={(e) => setNewAuditorNotes(e.target.value)}
                  placeholder="Methodological notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClaim(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
