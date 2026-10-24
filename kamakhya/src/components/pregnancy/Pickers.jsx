import React from 'react';
import { cn } from '@/lib/utils';

export function Chips({ options, selected = [], onChange, single = false }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const toggle = (value) => {
    if (single) {
      onChange(selected[0] === value ? [] : [value]);
    } else {
      onChange(selected.includes(value) ? selected.filter((s) => s !== value) : [...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            aria-pressed={on}
            className={cn(
              'press rounded-full border px-3.5 py-1.5 text-[12px] font-semibold shadow-soft transition',
              on
                ? 'border-transparent brand-gradient text-blush shadow-glow-soft'
                : 'border-plum/12 bg-white/70 text-plum/65 hover:border-lotus/40 hover:text-berry',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Scale({ label, value, onChange, low = 'Low', high = 'High' }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-plum/50">{label}</p>
        <p className="text-[10px] font-semibold text-plum/35">
          {low} … {high}
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            aria-pressed={value === n}
            className={cn(
              'press h-9 flex-1 rounded-xl text-sm font-bold shadow-soft transition',
              value === n ? 'brand-gradient text-blush shadow-glow-soft' : 'bg-white/70 text-plum/50 hover:text-berry',
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}