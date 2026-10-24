import React from 'react';
import { motion } from 'framer-motion';
import MoodFace from '@/components/journal/MoodFace';
import { MOODS } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
      {MOODS.map((mood) => {
        const active = value === mood.key;
        return (
          <motion.button
            key={mood.key}
            type="button"
            onClick={() => onChange(mood.key)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'press relative min-w-[144px] shrink-0 snap-start rounded-[1.75rem] p-5 text-left transition duration-300',
              active ? 'glass shadow-lift' : 'glass-soft shadow-soft hover:-translate-y-1',
            )}
          >
            {active && (
              <span
                className="pointer-events-none absolute -inset-[2px] rounded-[1.85rem] opacity-70 blur-[6px]"
                style={{ background: `linear-gradient(120deg, ${mood.from}, ${mood.to})` }}
              />
            )}
            <span className="relative block">
              <MoodFace mood={mood} className={cn('h-14 w-14 transition-transform duration-300', active && 'scale-105')} />
              <p className="mt-3.5 text-sm font-bold text-plum">{mood.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-plum/50">{mood.hint}</p>
              <span
                className={cn(
                  'mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] transition',
                  active ? 'bg-plum text-blush' : 'bg-plum/5 text-plum/40',
                )}
              >
                {active ? 'Selected' : 'Tap to pick'}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}