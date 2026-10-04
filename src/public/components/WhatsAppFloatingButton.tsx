import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { TELCOHAUZ_BUSINESS } from '../../data/telcoData.ts';

export function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const waUrl = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
    'Salam TelcoHauz, saya ingin bertanyakan tentang semakan liputan internet dan tawaran pakej terkini.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="relative bg-slate-900 border border-emerald-500/40 text-slate-200 text-xs px-3.5 py-2 rounded-xl shadow-xl shadow-emerald-950/30 flex items-center gap-2 max-w-xs animate-in fade-in duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium text-[11px]">Perunding Online • Klik untuk WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Tutup tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Perunding TelcoHauz"
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-950/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group border-2 border-emerald-300/30"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
      </a>
    </div>
  );
}
