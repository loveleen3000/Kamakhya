import React from 'react';
import { CloudSun, Sun } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { ENERGY_LABELS } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

export default function EnergySlider({ value, onChange }) {
  const { t } = useApp();

  return (
    <div className="rounded-[1.75rem] glass p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-plum/40">{t('energyTitle')}</p>
          <p className="mt-2 font-heading text-2xl text-plum">{ENERGY_LABELS[value]}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-peach/70 px-3 py-2">
          {[1, 2, 3, 4, 5].map((n) =>
            n <= value ? (
              <Sun key={n} className={cn('h-4 w-4 fill-gold text-gold', n === value && 'animate-float-slow')} />
            ) : (
              <CloudSun key={n} className="h-4 w-4 text-plum/20" />
            ),
          )}
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="kam-range mt-7 cursor-pointer"
        aria-label={t('energyTitle')}
      />

      <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-plum/40">
        <span>Empty</span>
        <span>Steady</span>
        <span>Radiant</span>
      </div>
    </div>
  );
}