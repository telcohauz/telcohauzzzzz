import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  MessageSquare,
  Scale,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  Database
} from 'lucide-react';
import { useCompare } from '../context/CompareContext.tsx';

import { TELCOHAUZ_BUSINESS } from '../../data/telcoData.ts';

interface PublicHeaderProps {
  onOpenGlobalSearch?: () => void;
}

export function PublicHeader({ onOpenGlobalSearch }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { compareList } = useCompare();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Promotions', path: '/promotions' },
    { label: 'Compare', path: '/compare', badge: compareList.length > 0 ? compareList.length : undefined },
    { label: 'Berita Telco', path: '/news' },
    { label: 'Panduan', path: '/guides' },
    { label: 'Providers', path: '/providers' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const waHeaderUrl = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
    'Salam TelcoHauz, saya ingin bertanyakan tentang tawaran pelan internet dan promosi terkini.'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top micro-bar for market context & official enterprise branding */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-b border-slate-800/60 py-1.5 px-4 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">TelcoHauz Phone Enterprise</span>
            <span className="hidden sm:inline text-slate-400">• Malaysia Independent Telco & Home Services Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/audit"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50"
              title="Portal Audit Dalaman & Pengesahan Rekod"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Internal Audit Hub</span>
            </Link>
            <span className="text-slate-400 hidden sm:inline">Bandingkan. Pilih. Mohon.</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl tracking-tighter">TH</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Telco<span className="text-cyan-400">Hauz</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold -mt-1">
                  Banding & Mohon
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-cyan-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions & CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Compare shortcut button */}
            <Link
              to="/compare"
              className="relative p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
              title="Perbandingan Pelan"
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Secondary CTA: WhatsApp */}
            <a
              href={waHeaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 font-semibold text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Kami</span>
            </a>

            {/* Primary CTA: Semak & Dapatkan Tawaran */}
            <Link
              to="/eligibility"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 hover:shadow-cyan-800/40 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semak & Dapatkan Tawaran</span>
            </Link>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={waHeaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30"
              title="WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/eligibility"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center font-bold text-xs shadow-md"
            >
              Semak Kelayakan
            </Link>
            <a
              href={waHeaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-xl bg-emerald-600 text-white text-center font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-cyan-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="text-cyan-400 flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              Internal Audit Hub
            </Link>
            <Link
              to="/recommend"
              onClick={() => setMobileMenuOpen(false)}
              className="text-amber-400 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Pencari Pelan Pintar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
