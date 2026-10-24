import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import { SYMPTOMS } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

const ICONS = {
  cramps: (
    <path d="M12 3c3 4 5 6.6 5 9.4A5 5 0 0 1 7 12.4C7 9.6 9 7 12 3Z" />
  ),
  headache: (
    <>
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </>
  ),
  acne: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  bloating: (
    <>
      <circle cx="12" cy="14" r="6" />
      <path d="M6 10c2-2.4 10-2.4 12 0" />
    </>
  ),
  fatigue: (
    <>
      <rect x="2.5" y="8" width="15" height="8.5" rx="2.5" />
      <path d="M21 11v2.5" />
      <path d="M6 12.2h4" />
    </>
  ),
  mood: (
    <>
      <path d="M3 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <path d="M3 16c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
    </>
  ),
};

export default function SymptomChips({ value = [], onToggle }) {
  const { t } = useApp();

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-plum/40">{t('symptomsTitle')}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {SYMPTOMS.map((symptom) => {
          const active = value.includes(symptom.key);
          return (
            <motion.button
              key={symptom.key}
              type="button"
              onClick={() => onToggle(symptom.key)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                'press flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                active
                  ? 'brand-gradient text-blush shadow-glow-soft'
                  : 'border border-plum/10 bg-white/70 text-plum/70 shadow-soft hover:border-lotus/40 hover:text-berry',
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONS[symptom.key]}
              </svg>
              {symptom.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}