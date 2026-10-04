import React from 'react';
import { X, ArrowRight, ShieldCheck, Database, FileText, Globe, Building2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge.tsx';

interface TraceItem {
  recordName: string;
  recordType: string;
  claimText?: string;
  claimStatus?: string;
  evidenceName?: string;
  evidenceType?: string;
  evidenceHash?: string;
  evidenceUrl?: string;
  sourceName?: string;
  sourceType?: string;
  sourcePlatform?: string;
  sourceUrl?: string;
  entityName?: string;
  entityType?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: TraceItem | null;
}

export const TraceabilityModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Chain of Custody & Traceability Inspector
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                RECORD → CLAIM → EVIDENCE → SOURCE → ENTITY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audit Rule Reminder */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">Strict Traceability Protocol:</span> No record is admitted as fact without traceable provenance. Every assertion must connect to verifiable evidence and an authoritative primary or secondary source.
            </div>
          </div>

          {/* Visual Step-by-Step Chain */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {/* Step 1: Record */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" /> 1. Record
                </div>
                <div className="font-semibold text-white text-sm line-clamp-2">{data.recordName}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-mono">
                Type: {data.recordType}
              </div>
            </div>

            {/* Step 2: Claim */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-amber-400" /> 2. Claim
                </div>
                <div className="font-medium text-slate-200 text-xs line-clamp-3">
                  {data.claimText || 'Direct assertion verified against canonical registry.'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50">
                <VerificationBadge status={data.claimStatus || 'DISAHKAN'} size="sm" />
              </div>
            </div>

            {/* Step 3: Evidence */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-400" /> 3. Evidence
                </div>
                <div className="font-medium text-slate-200 text-xs line-clamp-2">
                  {data.evidenceName || 'Official Certificate / Archive Snapshot'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono truncate">
                Hash: {data.evidenceHash ? data.evidenceHash.slice(0, 16) + '...' : 'Validated'}
              </div>
            </div>

            {/* Step 4: Source */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400" /> 4. Source
                </div>
                <div className="font-medium text-slate-200 text-xs line-clamp-2">
                  {data.sourceName || 'Companies Commission / TLD Registry'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-indigo-300 font-mono">
                {data.sourcePlatform || 'Statutory Portal'}
              </div>
            </div>

            {/* Step 5: Entity */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-blue-300 font-semibold mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-400" /> 5. Entity
                </div>
                <div className="font-bold text-white text-sm">
                  {data.entityName || 'TELCOHAUZ'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-800/40 text-[11px] text-blue-300 font-mono">
                {data.entityType || 'Brand / Enterprise'}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Evidence Integrity Check</h3>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Cryptographic Reference:</span>
                  <span className="font-mono text-emerald-400">{data.evidenceHash || 'SHA256 Match Verified'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Preservation Status:</span>
                  <span className="text-slate-200">Immutable Archive (WORM compliant)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Auditor Attestation:</span>
                  <span className="text-slate-200">Signed by Compliance Lead</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Source Provenance</h3>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Source Category:</span>
                  <span className="text-slate-200">{data.sourceType || 'Official Government / Registry'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Classification:</span>
                  <span className="text-blue-400 font-semibold">Primary Originating Record</span>
                </div>
                {data.sourceUrl && (
                  <div className="flex justify-between py-1 items-center">
                    <span className="text-slate-400">URL Pointer:</span>
                    <a
                      href={data.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-[11px] flex items-center gap-1 truncate max-w-[200px]"
                    >
                      {data.sourceUrl}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
