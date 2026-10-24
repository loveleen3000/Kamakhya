import React from 'react';
import { cn } from '@/lib/utils';

export default function SectionHeading({ eyebrow, title, sub, align = 'center', light = false, className }) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && (
        <span
          className={cn(
            'mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]',
            light ? 'border border-white/15 bg-white/10 text-peach' : 'glass text-lotus shadow-soft',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-display text-3xl leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.9rem]',
          light ? 'text-blush' : 'text-plum',
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className={cn('mt-5 text-base leading-relaxed', light ? 'text-blush/70' : 'text-plum/60')}>{sub}</p>
      )}
    </div>
  );
}