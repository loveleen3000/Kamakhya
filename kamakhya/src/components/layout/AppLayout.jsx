import React from 'react';
import { Outlet } from 'react-router-dom';
import { EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RitviAssistant from '@/components/ritvi/RitviAssistant';
import { useApp } from '@/lib/AppContext';

export default function AppLayout() {
  const { discreet } = useApp();

  return (
    <div
      className="relative min-h-screen bg-blush text-plum"
      style={{
        backgroundImage:
          'radial-gradient(58% 46% at 12% 0%, #FFE7EC 0%, transparent 62%), radial-gradient(48% 40% at 100% 8%, #FFEDD5 0%, transparent 58%), radial-gradient(46% 42% at 55% 100%, #F5EBFF 0%, transparent 62%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <RitviAssistant />

      {discreet && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full glass-dark px-4 py-2 shadow-lift">
            <EyeOff className="h-3.5 w-3.5 text-peach" />
            <span className="text-xs font-semibold text-blush">Discreet mode on — sensitive details are blurred</span>
          </div>
        </div>
      )}
    </div>
  );
}