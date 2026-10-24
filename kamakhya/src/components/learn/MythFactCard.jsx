import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MythFactCard({ item }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped((f) => !f)}
      onClick={() => setFlipped((f) => !f)}
      className="flip-card h-[320px] cursor-pointer select-none"
    >
      <div className={cn('flip-inner', flipped && 'is-flipped')}>
        <div className="flip-face flex flex-col justify-between rounded-[2rem] glass p-7 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-berry/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-berry">
              Myth
            </span>
            <Sparkles className="h-4 w-4 text-lotus/60" />
          </div>
          <p className="font-display text-[1.7rem] leading-snug text-plum">{item.myth}</p>
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-plum/40">
            <RotateCcw className="h-3.5 w-3.5" /> Tap to reveal the truth
          </span>
        </div>

        <div className="flip-face flip-back flex flex-col justify-between rounded-[2rem] bg-plum p-7 shadow-lift">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-peach">
              Fact
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="text-sm leading-relaxed text-blush/85">{item.fact}</p>
          <span className="text-[11px] font-semibold text-blush/50">{item.source}</span>
        </div>
      </div>
    </div>
  );
}