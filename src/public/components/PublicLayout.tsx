import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader.tsx';
import { PublicFooter } from './PublicFooter.tsx';
import { FloatingCompareBar } from './FloatingCompareBar.tsx';
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton.tsx';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingCompareBar />
      <WhatsAppFloatingButton />
      <PublicFooter />
    </div>
  );
}
