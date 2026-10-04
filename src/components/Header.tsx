import React from 'react';
import { Search, Plus, Database, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface Props {
  onOpenSearch: () => void;
  onOpenCreateRecord?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<Props> = ({
  onOpenSearch,
  onOpenCreateRecord,
  onRefresh,
  isRefreshing = false,
}) => {
  const { currentUser, signInWithGoogle } = useAuth();

  return (
    <header className="h-14 bg-slate-950/80 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Global Search Bar Trigger */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200 transition text-xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
            <span>Search entities, products, domains, @handles, phone, claims...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Database Live Connectivity */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>PostgreSQL Active</span>
        </div>

        {/* Refresh Data */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Datasets"
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        )}

        {/* Quick Add */}
        {onOpenCreateRecord && (
          <button
            onClick={onOpenCreateRecord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/50 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capture Record</span>
          </button>
        )}

        {/* Google Auth status */}
        {!currentUser && (
          <button
            onClick={signInWithGoogle}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
