import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Menu } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import ModeSwitch from '@/components/layout/ModeSwitch';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useApp } from '@/lib/AppContext';
import { LANGS } from '@/lib/i18n';
import { PREG } from '@/data/pregnancyI18n';
import { cn } from '@/lib/utils';

const CYCLE_LINKS = [
  { to: '/', key: 'navHome' },
  { to: '/cycle', key: 'navCycle' },
  { to: '/journal', key: 'navJournal' },
  { to: '/learn', key: 'navLearn' },
];

const PREGNANCY_LINKS = [
  { to: '/pregnancy', key: 'navDashboard' },
  { to: '/pregnancy/guide', key: 'navGuide' },
  { to: '/pregnancy/calendar', key: 'navCalendar' },
  { to: '/pregnancy/journal', key: 'navJournal' },
  { to: '/pregnancy/birth', key: 'navBirth' },
  { to: '/pregnancy/settings', key: 'navSettings' },
];

function LanguageToggle({ className }) {
  const { lang, setLang } = useApp();
  return (
    <div className={cn('flex items-center rounded-full border border-white/70 bg-white/60 p-1 shadow-soft', className)}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={cn(
            'relative rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors',
            lang === l.code ? 'text-blush' : 'text-plum/55 hover:text-plum',
          )}
        >
          {lang === l.code && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-plum"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
function DiscreetToggle({ compact = false }) {
  const { t, discreet, setDiscreet } = useApp();

  const handleToggle = (checked) => {
    // 1. Agar boolean aaya toh wo, nahi toh opposite toggle
    const nextVal = typeof checked === 'boolean' ? checked : !discreet;
    if (typeof setDiscreet === 'function') {
      setDiscreet(nextVal);
    }
    // 2. Pure document body par class toggle karein taaki har cheez blur ho sake
    if (nextVal) {
      document.body.classList.add('discreet-mode-active');
    } else {
      document.body.classList.remove('discreet-mode-active');
    }
  };

  return (
    <div
      onClick={() => handleToggle(!discreet)}
      className={cn(
        'flex items-center gap-2.5 rounded-full border border-white/70 bg-white/60 px-3.5 py-2 shadow-soft cursor-pointer select-none',
        compact && 'w-full justify-between',
      )}
    >
      {discreet ? <EyeOff className="h-3.5 w-3.5 text-lotus" /> : <Eye className="h-3.5 w-3.5 text-plum/50" />}
      <span className="text-xs font-semibold text-plum/70">{t('discreet') || 'गुप्त मोड'}</span>
      <Switch 
        checked={!!discreet} 
        onCheckedChange={handleToggle} 
        aria-label={t('discreet') || 'Discreet'} 
      />
    </div>
  );
}

export default function Navbar() {
  const { t, mode, lang } = useApp();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const pt = (key) => PREG[lang]?.[key] ?? PREG.en[key] ?? key;
  const links =
    mode === 'pregnancy'
      ? PREGNANCY_LINKS.map((l) => ({ to: l.to, label: pt(l.key) }))
      : CYCLE_LINKS.map((l) => ({ to: l.to, label: t(l.key) }));

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/60">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 py-2 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="press shrink-0" aria-label="Kamakhya home">
            <Logo size={48} withWordmark />
          </Link>

          <nav className="hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/70 bg-white/60 p-1.5 shadow-soft lg:flex">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active ? 'text-blush' : 'text-plum/65 hover:text-plum',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full brand-gradient shadow-glow-soft"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ModeSwitch className="hidden md:flex" />
            <LanguageToggle className="hidden sm:flex" />
            <div className="hidden xl:block">
              <DiscreetToggle />
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="press grid h-10 w-10 place-items-center rounded-full glass shadow-soft lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4 text-plum" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86%] max-w-sm border-white/60 bg-blush/95 pt-14 backdrop-blur-xl">
                <div className="flex flex-col gap-6">
                  <Logo size={48} withWordmark />
                  <nav className="flex flex-col gap-1.5">
                    {links.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'rounded-2xl px-4 py-3.5 font-heading text-xl transition',
                          pathname === l.to ? 'brand-gradient text-blush shadow-glow-soft' : 'text-plum hover:bg-white/70',
                        )}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                  <ModeSwitch />
                  <LanguageToggle />
                  <DiscreetToggle compact />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}