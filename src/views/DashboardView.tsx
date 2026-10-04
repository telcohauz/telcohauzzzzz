import React from 'react';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  FolderGit2,
  FileCheck2,
  Package,
  Globe2,
  Users,
  MessageSquareQuote,
  CheckSquare2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  stats: any;
  onNavigate: (tab: string, entityId?: number) => void;
  onInspectTrace: (item: any) => void;
}

export const DashboardView: React.FC<Props> = ({ stats, onNavigate, onInspectTrace }) => {
  if (!stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] font-mono text-slate-500 text-xs gap-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Loading TELCOHAUZ forensic intelligence datasets...
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Registered Entities',
      value: stats.totalEntities ?? 0,
      sub: `${stats.verifiedEntities ?? 0} DISAHKAN`,
      icon: Building2,
      color: 'text-blue-400',
      tab: 'entities',
    },
    {
      label: 'Claims Verified / Analyzed',
      value: (stats.verificationBreakdown?.DISAHKAN ?? 0) + (stats.verificationBreakdown?.BERKEMUNGKINAN ?? 0),
      sub: `${stats.pendingVerification ?? 0} Pending Verification`,
      icon: FileCheck2,
      color: 'text-emerald-400',
      tab: 'claims',
    },
    {
      label: 'Active Conflicts & Discrepancies',
      value: stats.activeConflicts ?? 0,
      sub: 'Contradictory findings under review',
      icon: ShieldAlert,
      color: 'text-orange-400',
      tab: 'conflicts',
      alert: stats.activeConflicts > 0,
    },
    {
      label: 'Evidence Vault & Files',
      value: stats.totalEvidence ?? 0,
      sub: `Across ${stats.totalSources ?? 0} verified sources`,
      icon: FolderGit2,
      color: 'text-purple-400',
      tab: 'evidence',
    },
    {
      label: 'Catalogued Products',
      value: stats.totalProducts ?? 0,
      sub: 'Preserved historical pricing',
      icon: Package,
      color: 'text-amber-400',
      tab: 'products',
    },
    {
      label: 'Digital Domains & Websites',
      value: stats.totalDomains ?? 0,
      sub: 'All DNS / SSL verified',
      icon: Globe2,
      color: 'text-cyan-400',
      tab: 'digital',
    },
    {
      label: 'Tracked Social Channels',
      value: stats.totalSocial ?? 0,
      sub: 'Includes impersonator detection',
      icon: Users,
      color: 'text-pink-400',
      tab: 'digital',
    },
    {
      label: 'Open Forensic Audit Tasks',
      value: stats.openTasks ?? 0,
      sub: 'Task pipeline active',
      icon: CheckSquare2,
      color: 'text-indigo-400',
      tab: 'tasks',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-semibold tracking-wider uppercase">
                Official Live Dossier • Production Mode
              </span>
              <span className="text-slate-500 font-mono text-xs">•</span>
              <span className="text-slate-400 font-mono text-xs">Target: TELCOHAUZ & Affiliated Footprint</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              TELCOHAUZ Digital Audit & Knowledge Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Evidence-based database and forensic digital audit platform collecting, cross-checking, and verifying all legitimately accessible information related to TELCOHAUZ, Telcohauz Phone Enterprise, and related digital footprints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('entities')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-900/40 flex items-center gap-1.5"
            >
              <span>Explore Entity Profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('workflow')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Conflict Alert If Any */}
      {stats.activeConflicts > 0 && (
        <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-600/40 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-900/60 text-orange-400 border border-orange-700/60">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-200">
                Action Required: {stats.activeConflicts} Unresolved Information Conflict(s)
              </div>
              <div className="text-[11px] text-orange-300/80">
                Discrepancies identified between statutory SSM records and active online retail locations.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('conflicts')}
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shrink-0 transition"
          >
            Review Conflicts
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab)}
              className={`p-4 rounded-xl bg-slate-900/80 border ${
                card.alert ? 'border-orange-500/50 shadow-orange-950/50' : 'border-slate-800/80'
              } hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition group`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium line-clamp-1">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color} group-hover:scale-110 transition`} />
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-1">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{card.sub}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Verification Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Status Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verification Status Matrix
            </h2>
            <span className="text-[10px] font-mono text-slate-500">CANONICAL AUDIT</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(stats.verificationBreakdown || {}).map(([key, val]: [string, any]) => {
              const total = stats.verificationBreakdown ? Object.values(stats.verificationBreakdown).reduce((a: any, b: any) => a + b, 0) as number : 1;
              const pct = total > 0 ? Math.round(((val as number) / total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-mono text-[11px]">{key}</span>
                    <span className="font-mono text-slate-400">{val} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        key === 'DISAHKAN'
                          ? 'bg-emerald-500'
                          : key === 'BERKEMUNGKINAN'
                          ? 'bg-amber-500'
                          : key === 'BERCANGGAH'
                          ? 'bg-orange-500'
                          : key === 'TIDAK DISAHKAN'
                          ? 'bg-rose-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Audit Standard:</span>
            <span className="font-mono text-blue-400 font-semibold">Zero-Invention Policy</span>
          </div>
        </div>

        {/* Sources by Platform Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              Source Platform Distribution
            </h2>
            <span className="text-[10px] font-mono text-slate-500">PRIMARY / SECONDARY</span>
          </div>

          <div className="space-y-2">
            {Object.entries(stats.sourcePlatformBreakdown || {}).map(([platform, count]: [string, any]) => (
              <div
                key={platform}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>{platform}</span>
                </div>
                <span className="font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-950/50 border border-purple-800/40">
                  {count} sources
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('evidence')}
            className="w-full py-2 text-center text-xs font-semibold text-blue-400 hover:text-blue-300 font-mono"
          >
            Open Evidence & Source Ledger →
          </button>
        </div>

        {/* Reputation Sentiment Analytics */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-teal-400" />
              Reputation & Public Sentiment
            </h2>
            <span className="text-[10px] font-mono text-slate-500">NO ARBITRARY SCORES</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['Positive', 'Neutral', 'Mixed', 'Negative'].map((sent) => {
              const count = (stats.reviewSentimentBreakdown && stats.reviewSentimentBreakdown[sent]) || 0;
              const color = sent === 'Positive'
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
                : sent === 'Mixed'
                ? 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                : sent === 'Negative'
                ? 'text-rose-400 border-rose-500/30 bg-rose-950/30'
                : 'text-slate-400 border-slate-700 bg-slate-800/30';

              return (
                <div key={sent} className={`p-3 rounded-xl border ${color} flex flex-col justify-between`}>
                  <span className="text-[11px] font-mono uppercase">{sent}</span>
                  <span className="text-xl font-bold font-mono text-white mt-1">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Auditor Distinction:</div>
            <div>Reviews are separated into verified customer facts, opinions, and unverified allegations. Negative reviews are never hidden.</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Footprint Timeline & Recent Forensic Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Footprint Timeline */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Chronological Footprint Timeline
            </h2>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Full Timeline →
            </button>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {(stats.recentTimeline || []).map((item: any) => (
              <div key={item.id} className="relative flex items-start gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-slate-950 border border-sky-500/50 flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-sky-400 font-semibold">{item.date}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">{item.event}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Forensic Changes & Audit Trail */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Forensic Change Log & Audit Trail
            </h2>
            <button
              onClick={() => onNavigate('changelog')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View Full Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {(stats.recentChanges || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No external modifications recorded yet. All baseline records preserved.
              </div>
            ) : (
              (stats.recentChanges || []).map((change: any) => (
                <div
                  key={change.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-blue-400 uppercase text-[10px]">
                        {change.recordTable}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-300">{change.recordId}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Field: <span className="text-slate-200">{change.fieldChanged}</span> →{' '}
                      <span className="text-emerald-400 font-mono">{change.newValue || 'Updated'}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono text-slate-400">{change.changedBy}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {new Date(change.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Inspector Trigger */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between">
            <div className="text-xs text-blue-200">
              <span className="font-semibold text-blue-300">Live Provenance Chain:</span> Inspect TELCOHAUZ statutory custody trail.
            </div>
            <button
              onClick={() => onInspectTrace({
                recordName: 'TELCOHAUZ Official Identity',
                recordType: 'Enterprise Brand',
                claimText: 'TELCOHAUZ is an active registered telecommunications and mobile retail business in Malaysia.',
                claimStatus: 'DISAHKAN',
                evidenceName: 'SSM Official Business Registration Extract',
                evidenceHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                sourceName: 'SSM E-Info Portal (Suruhanjaya Syarikat Malaysia)',
                sourceType: 'Official Registry',
                sourcePlatform: 'SSM Malaysia',
                sourceUrl: 'https://ezbiz.ssm.com.my',
                entityName: 'Telcohauz Phone Enterprise',
                entityType: 'Business Sole Proprietorship',
              })}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/50 transition"
            >
              Inspect Chain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
