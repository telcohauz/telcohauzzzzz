import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  ShieldAlert,
  FileCheck2,
  Clock,
  Package,
  Globe2,
  MessageSquareQuote,
  CheckSquare2,
  CopyX,
  History,
  FolderGit2,
  Compass,
  FileText,
  Lock,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openTasksCount?: number;
  activeConflictsCount?: number;
  pendingVerificationCount?: number;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  openTasksCount = 0,
  activeConflictsCount = 0,
  pendingVerificationCount = 0,
}) => {
  const { currentUser, auditorProfile, signInWithGoogle, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entities', label: 'Entities & Dossier', icon: Building2 },
    { id: 'relationships', label: 'Relationships Map', icon: GitFork },
    {
      id: 'evidence',
      label: 'Evidence & Sources',
      icon: FolderGit2,
    },
    {
      id: 'claims',
      label: 'Claims & Verification',
      icon: FileCheck2,
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'conflicts',
      label: 'Conflicts Control',
      icon: ShieldAlert,
      badge: activeConflictsCount > 0 ? activeConflictsCount : undefined,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
    { id: 'timeline', label: 'Digital Timeline', icon: Clock },
    { id: 'products', label: 'Products & Services', icon: Package },
    { id: 'digital', label: 'Digital Presence', icon: Globe2 },
    { id: 'reviews', label: 'Reputation & Reviews', icon: MessageSquareQuote },
    {
      id: 'tasks',
      label: 'Audit Tasks',
      icon: CheckSquare2,
      badge: openTasksCount > 0 ? openTasksCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    { id: 'duplicates', label: 'Duplicates & False Positives', icon: CopyX },
    { id: 'workflow', label: 'Workflow Assistant', icon: Compass },
    { id: 'documents', label: 'Brand & SOP Documents', icon: FileText },
    { id: 'changelog', label: 'Forensic Change Log', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-900/40 border border-blue-400/30">
              TH
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                TELCOHAUZ
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  HUB
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                DIGITAL AUDIT SYSTEM
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>LIVE CANONICAL AUDIT • PRODUCTION</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Audit Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border font-bold ${
                      isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auditor Profile & Auth Controls */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-700/60 flex items-center justify-center text-blue-300 shrink-0 font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">
                {currentUser?.displayName || auditorProfile.displayName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {auditorProfile.role}
              </div>
            </div>
          </div>
          {currentUser ? (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              title="Authenticate via Google"
              className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
