import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Flower2, Leaf, Sparkles, Zap } from 'lucide-react';
import { CATEGORIES } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

const ICONS = { sparkle: Sparkles, flask: FlaskConical, zap: Zap, flower: Flower2, leaf: Leaf };

export default function CategoryCarousel({ value, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-3.5 overflow-x-auto px-1 pb-2">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon] ?? Sparkles;
        const active = value === cat.key;
        return (
          <motion.button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'press relative min-w-[210px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] p-5 text-left transition duration-300',
              active ? 'shadow-lift' : 'shadow-soft hover:-translate-y-1',
            )}
          >
            <span className={cn('absolute inset-0 bg-gradient-to-br', cat.gradient, active ? 'opacity-100' : 'opacity-90')} />
            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
            <span className="relative flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/20 text-white backdrop-blur-md">
                <Icon className="h-5 w-5" />
              </span>
              {active && (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-plum">
                  Showing
                </span>
              )}
            </span>
            <p className="relative mt-6 font-heading text-xl leading-snug text-white">{cat.label}</p>
            <p className="relative mt-1 text-xs font-semibold text-white/75">{cat.count} lessons</p>
          </motion.button>
        );
      })}
    </div>
  );
}