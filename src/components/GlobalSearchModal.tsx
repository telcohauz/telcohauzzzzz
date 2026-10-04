import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShieldCheck, Building2, Package, Globe, Users, FileText, CheckCircle2, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { SearchResultItem } from '../types/index.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: SearchResultItem) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredResults = activeFilter === 'ALL'
    ? results
    : results.filter(r => r.type.toLowerCase().includes(activeFilter.toLowerCase()));

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'entity':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'product':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'domain':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'social account':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'claim':
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case 'evidence':
      case 'source':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'review':
        return <MessageSquare className="w-4 h-4 text-teal-400" />;
      case 'timeline event':
        return <Clock className="w-4 h-4 text-sky-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const categories = ['ALL', 'Entity', 'Product', 'Domain', 'Social', 'Claim', 'Evidence', 'Review'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Master Index (exact names, @handles, phone, domains, SKUs, claims, evidence)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC to close
          </span>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 text-[11px] mr-1">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-0.5 rounded-full transition-all text-xs ${
                activeFilter === cat
                  ? 'bg-blue-600 text-white font-medium shadow-xs shadow-blue-500/50'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-3 divide-y divide-slate-800/40 flex-1">
          {loading && (
            <div className="py-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Scanning cross-relational indexes...
            </div>
          )}

          {!loading && query && filteredResults.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching verified or recorded entries found for <span className="text-white font-mono">"{query}"</span>.
              <p className="text-slate-500 mt-1">Try searching by partial name, domain name, phone number or SKU.</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-10 text-center text-slate-500 text-xs font-mono space-y-2">
              <div>Type to query the unified TELCOHAUZ Master Forensic Index</div>
              <div className="flex justify-center gap-2 text-[11px] text-slate-600">
                <span>• TELCOHAUZ</span>
                <span>• Telcohauz Phone Enterprise</span>
                <span>• telcohauz.com</span>
                <span>• @telcohauz</span>
              </div>
            </div>
          )}

          {!loading && filteredResults.map((item, idx) => (
            <button
              key={`${item.type}-${item.id}-${idx}`}
              onClick={() => {
                onSelectResult(item);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-800/70 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:border-blue-500/40 transition">
                  {getTypeIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold">{item.type}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-medium text-white group-hover:text-blue-400 transition truncate">
                      {item.title}
                    </span>
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between items-center">
          <span>Results: {filteredResults.length} records</span>
          <span className="text-slate-400">Canonical Identity Match: High Confidence</span>
        </div>
      </div>
    </div>
  );
};
