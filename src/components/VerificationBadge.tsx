import React from 'react';
import { VerificationStatus } from '../types/index.ts';
import { ShieldCheck, AlertCircle, XCircle, AlertTriangle, Slash, RefreshCw } from 'lucide-react';

interface Props {
  status: VerificationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({ status, size = 'md', showIcon = true }) => {
  const normStatus = (status || 'PERLU SEMAK SEMULA').toUpperCase();

  const getTheme = () => {
    switch (normStatus) {
      case 'DISAHKAN':
        return {
          bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-emerald-950/50',
          dot: 'bg-emerald-400',
          icon: ShieldCheck,
          label: 'DISAHKAN'
        };
      case 'BERKEMUNGKINAN':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-950/50',
          dot: 'bg-amber-400',
          icon: AlertCircle,
          label: 'BERKEMUNGKINAN'
        };
      case 'TIDAK DISAHKAN':
        return {
          bg: 'bg-rose-950/80 text-rose-400 border-rose-500/40 shadow-rose-950/50',
          dot: 'bg-rose-400',
          icon: XCircle,
          label: 'TIDAK DISAHKAN'
        };
      case 'BERCANGGAH':
        return {
          bg: 'bg-orange-950/80 text-orange-400 border-orange-500/50 shadow-orange-950/50 animate-pulse',
          dot: 'bg-orange-400',
          icon: AlertTriangle,
          label: 'BERCANGGAH'
        };
      case 'DIBATALKAN':
        return {
          bg: 'bg-slate-900 text-slate-400 border-slate-700 shadow-slate-950/50',
          dot: 'bg-slate-500',
          icon: Slash,
          label: 'DIBATALKAN'
        };
      case 'PERLU SEMAK SEMULA':
      default:
        return {
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-cyan-950/50',
          dot: 'bg-cyan-400',
          icon: RefreshCw,
          label: 'PERLU SEMAK SEMULA'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold tracking-wider uppercase rounded-md border shadow-xs transition-all ${theme.bg} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{theme.label}</span>
    </span>
  );
};
