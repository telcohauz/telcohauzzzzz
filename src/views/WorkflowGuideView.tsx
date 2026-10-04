import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Search, Database, GitFork, AlertTriangle, FileCheck, Archive } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
}

export const WorkflowGuideView: React.FC<Props> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: 1,
      title: 'DISCOVER',
      subtitle: 'Identify Online Footprints',
      icon: Search,
      color: 'text-blue-400 border-blue-500 bg-blue-950/40',
      description: 'Search publicly accessible directories, SSM registries, domain WHOIS records, and social platforms for mentions of TELCOHAUZ, Telcohauz Phone Enterprise, and @telcohauz.',
      actionLabel: 'Launch Master Index Search',
      targetTab: 'entities',
      checklist: [
        'Query Companies Commission of Malaysia (SSM) EzBiz portal',
        'Inspect ICANN / Cloudflare WHOIS records for telcohauz.com',
        'Scan Instagram, TikTok, Facebook, and Shopee for registered handles',
        'Record first-seen timestamp and raw source URLs',
      ],
    },
    {
      num: 2,
      title: 'CAPTURE',
      subtitle: 'Preserve Verifiable Artifacts',
      icon: Database,
      color: 'text-purple-400 border-purple-500 bg-purple-950/40',
      description: 'Capture verbatim evidentiary records—certificates, screenshots, WHOIS snapshots, and official filings. Generate cryptographic SHA256 hashes to guarantee provenance.',
      actionLabel: 'Open Evidence Vault',
      targetTab: 'evidence',
      checklist: [
        'Save official SSM corporate profile extract PDF',
        'Archive full-page screenshot of primary storefront and verified bio',
        'Record cryptographic reference hash (SHA256)',
        'Never overwrite or destroy historical captured evidence',
      ],
    },
    {
      num: 3,
      title: 'NORMALIZE',
      subtitle: 'Structure Identity Records',
      icon: CheckCircle2,
      color: 'text-cyan-400 border-cyan-500 bg-cyan-950/40',
      description: 'Parse raw text into standardized canonical formats: Phone numbers (+60), Company registration numbers (SSM format), addresses, and canonical brand wordmarks.',
      actionLabel: 'Review Entities & Contacts',
      targetTab: 'entities',
      checklist: [
        'Normalize phone numbers to international E.164 format (+6011...)',
        'Standardize business identity: 202103019842 (CA0312984-X)',
        'Catalog name variations (TELCOHAUZ, Telcohauz Mobile, etc.)',
        'Tag initial confidence level (Low, Medium, High)',
      ],
    },
    {
      num: 4,
      title: 'LINK',
      subtitle: 'Establish Relational Graph',
      icon: GitFork,
      color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40',
      description: 'Connect disparate nodes with explicit relational types (e.g. Enterprise Owns Brand; Brand Operates Domain; Brand Verifies Social Account). Never infer merely by similar spelling.',
      actionLabel: 'Open Relational Graph',
      targetTab: 'relationships',
      checklist: [
        'Link Telcohauz Phone Enterprise -> Brand -> TELCOHAUZ',
        'Link TELCOHAUZ -> Website -> telcohauz.com',
        'Link TELCOHAUZ -> Social -> @telcohauz',
        'Prevent accidental automated merging of distinct legal or digital entities',
      ],
    },
    {
      num: 5,
      title: 'CROSS-CHECK',
      subtitle: 'Detect Discrepancies & Conflicts',
      icon: AlertTriangle,
      color: 'text-orange-400 border-orange-500 bg-orange-950/40',
      description: 'Cross-reference statutory data against field observations. If the registered address differs from the active retail store, isolate the discrepancy into the Conflicts ledger.',
      actionLabel: 'Inspect Active Conflicts',
      targetTab: 'conflicts',
      checklist: [
        'Compare SSM registered address vs physical retail location',
        'Flag unverified third-party pages (e.g. suspicious promotional Facebook pages)',
        'Document both conflicting records without destructively overwriting either',
        'Specify mandatory required verification action for resolution',
      ],
    },
    {
      num: 6,
      title: 'VERIFY',
      subtitle: 'Apply Formal Attestation',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40',
      description: 'Senior auditor reviews primary proof and assigns formal verification verdict: DISAHKAN, BERKEMUNGKINAN, TIDAK DISAHKAN, BERCANGGAH, DIBATALKAN, or PERLU SEMAK SEMULA.',
      actionLabel: 'Audit Claims Matrix',
      targetTab: 'claims',
      checklist: [
        'Verify document against statutory source registry',
        'Assign definitive verification badge',
        'Record auditor username and timestamp in immutable change log',
        'Attach rationale and verification method notes',
      ],
    },
    {
      num: 7,
      title: 'CLASSIFY',
      subtitle: 'Categorize Channel Role & Risk',
      icon: FileCheck,
      color: 'text-indigo-400 border-indigo-500 bg-indigo-950/40',
      description: 'Classify each social handle, domain, and review into its operational posture: Official, Related, Impersonation, Inactive, or False Positive.',
      actionLabel: 'Review Digital Channels',
      targetTab: 'digital',
      checklist: [
        'Designate official brand accounts (@telcohauz)',
        'Isolate unauthorized promotional accounts under investigation',
        'Classify customer review sentiment and separate allegations from facts',
        'Tag preserved historical pricing in product catalogue',
      ],
    },
    {
      num: 8,
      title: 'ARCHIVE',
      subtitle: 'Lock Immutable Dossier Snapshot',
      icon: Archive,
      color: 'text-slate-400 border-slate-500 bg-slate-900/60',
      description: 'Commit findings into the TELCOHAUZ Master Dossier. Ensure all audit sessions, change logs, and evidence links remain permanently recoverable for future regulatory audits.',
      actionLabel: 'View Forensic Change Log',
      targetTab: 'changelog',
      checklist: [
        'Audit session sign-off by Lead Compliance Auditor',
        'Verify zero-invention policy adherence across all tables',
        'Confirm every important record contains valid source and evidence references',
        'Preserve historical baseline for periodic re-verification cycles',
      ],
    },
  ];

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          8-Stage Forensic Audit Workflow
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Methodological pipeline governing evidence-based data entry and verification for TELCOHAUZ.
        </p>
      </div>

      {/* Progress Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 scale-102'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold">STAGE {s.num}</span>
                <StepIcon className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-xs truncate">{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${current.color} shadow-lg shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                Stage {current.num} of 8 • Core Procedure
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{current.title}: {current.subtitle}</h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate(current.targetTab)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2 shadow-md shadow-blue-900/40 shrink-0 self-start md:self-auto"
          >
            <span>{current.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
          {current.description}
        </p>

        {/* Mandatory Auditor Checklist */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h3 className="font-mono uppercase text-slate-400 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Mandatory Verification Criteria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {current.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition font-medium"
          >
            ← Previous Stage
          </button>

          <span className="text-slate-500 font-mono text-[11px]">
            Workflow Pipeline: Discovery through Archive
          </span>

          <button
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep(prev => prev + 1)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-40 transition"
          >
            Next Stage →
          </button>
        </div>
      </div>
    </div>
  );
};
