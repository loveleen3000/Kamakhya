import React from 'react';
import { CYCLE, PHASES } from '@/data/kamakhya';

const TONES = {
  menstrual: 'from-[#8E1F45] to-[#E85D75]',
  follicular: 'from-[#E85D75] to-[#F7B267]',
  ovulatory: 'from-[#F7B267] to-[#FFD9A0]',
  luteal: 'from-[#5C1D2E] to-[#8B5CF6]',
};

export default function CycleLegend() {
  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-plum/65">
          <span className="h-4 w-4 rounded-full brand-gradient shadow-glow-soft" />
          Logged period
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold text-plum/65">
          <span className="h-4 w-4 rounded-full border border-dashed border-lotus bg-lotus-100" />
          Predicted window
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold text-plum/65">
          <span className="h-4 w-4 rounded-full border-2 border-lotus bg-white ring-4 ring-lotus/20" />
          Today
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold text-plum/65">
          <span className="relative h-4 w-4 rounded-full bg-white ring-1 ring-plum/15">
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Ovulation
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PHASES.map((phase) => (
          <div key={phase.key} className="rounded-2xl glass-soft p-3">
            <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${TONES[phase.key]}`} />
            <p className="mt-2 text-xs font-bold text-plum">{phase.name}</p>
            <p className="text-[11px] text-plum/50">{phase.range}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-plum/45">
        Last period began {CYCLE.monthShort} 6 · next period expected {CYCLE.nextPeriod} · window opens {CYCLE.nextWindow}
      </p>
    </div>
  );
}