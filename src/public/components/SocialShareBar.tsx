import React, { useState } from 'react';
import { Share2, Link2, Check, MessageSquare } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  url?: string;
}

export function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-cyan-400" />
        Kongsi:
      </span>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={shareWhatsApp}
        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        WhatsApp
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={shareFacebook}
        className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
      >
        Facebook
      </button>

      {/* Telegram */}
      <button
        type="button"
        onClick={shareTelegram}
        className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
      >
        Telegram
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Disalin!
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" />
            Salin Pautan
          </>
        )}
      </button>
    </div>
  );
}
