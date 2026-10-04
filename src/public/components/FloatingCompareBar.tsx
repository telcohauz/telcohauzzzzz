import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext.tsx';

export function FloatingCompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs shrink-0 max-w-[140px]"
              >
                <span className="font-semibold truncate">{plan.name}</span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(plan.id)}
                  className="p-0.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                  title="Keluarkan"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {compareList.length < 4 && (
              <span className="text-[11px] text-slate-400 whitespace-nowrap hidden md:inline">
                ({4 - compareList.length} lagi slot)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="p-2 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            title="Padam Semua"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/compare"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/40 transition-all"
          >
            <span>Bandingkan ({compareList.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
