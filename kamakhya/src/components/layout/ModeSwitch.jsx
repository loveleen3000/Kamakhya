import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Baby, HeartPulse } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { PREG } from '@/data/pregnancyI18n';
import { cn } from '@/lib/utils';

export default function ModeSwitch({ className }) {
  const { mode, setMode, lang } = useApp();
  const navigate = useNavigate();
  const pt = (key) => PREG[lang]?.[key] ?? PREG.en[key] ?? key;

  const MODES = [
    { id: 'cycle', icon: HeartPulse, label: pt('modeCycle') },
    { id: 'pregnancy', icon: Baby, label: pt('modePregnancy') },
  ];

  const pick = (m) => {
    if (m === mode) return;
    setMode(m);
    navigate(m === 'pregnancy' ? '/pregnancy' : '/');
  };

  return (
    <div className={cn('flex shrink-0 items-center rounded-full border border-white/70 bg-white/60 p-1 shadow-soft', className)}>
      {MODES.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => pick(id)}
          className={cn(
            'relative whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors',
            mode === id ? 'text-blush' : 'text-plum/55 hover:text-plum',
          )}
          aria-pressed={mode === id}
        >
          {mode === id && (
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 rounded-full brand-gradient shadow-glow-soft"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <Icon className="relative z-10 mr-1 inline h-3.5 w-3.5" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}