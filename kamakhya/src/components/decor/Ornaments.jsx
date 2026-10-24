import React from 'react';
import { cn } from '@/lib/utils';

export function Lotus({ className, tone = 'lotus' }) {
  const colors = {
    lotus: ['#E85D75', '#F7A5B4'],
    plum: ['#3D141E', '#8E1F45'],
    gold: ['#F7B267', '#FFD9A0'],
    lavender: ['#8B5CF6', '#E9D5FF'],
  }[tone] || ['#E85D75', '#F7A5B4'];

  return (
    <svg viewBox="0 0 140 120" className={cn('h-auto w-auto', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`lotus-${tone}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <g transform="translate(70 78)" fill={`url(#lotus-${tone})`}>
        {[-58, -30, 0, 30, 58].map((angle) => (
          <ellipse key={angle} cx="0" cy="-30" rx="10" ry="30" transform={`rotate(${angle})`} opacity="0.92" />
        ))}
        <ellipse cx="0" cy="6" rx="26" ry="9" opacity="0.35" />
      </g>
    </svg>
  );
}

export function Crescent({ className }) {
  return (
    <svg viewBox="0 0 80 80" className={cn('h-auto w-auto', className)} aria-hidden="true">
      <defs>
        <linearGradient id="crescent-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF6E9" />
          <stop offset="100%" stopColor="#F7B267" />
        </linearGradient>
      </defs>
      <path
        d="M44 6a34 34 0 1 0 24 58A40 40 0 0 1 44 6Z"
        fill="url(#crescent-grad)"
        opacity="0.95"
      />
    </svg>
  );
}

export function Sparkle({ className, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-auto w-auto animate-float-slow', className)}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <path
        d="M12 0c1.1 6.6 5.4 10.9 12 12-6.6 1.1-10.9 5.4-12 12-1.1-6.6-5.4-10.9-12-12C6.6 10.9 10.9 6.6 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Blob({ className, from = '#E85D75', to = '#E9D5FF', opacity = 0.55 }) {
  return (
    <div
      className={cn('pointer-events-none rounded-full blur-3xl', className)}
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle at 30% 30%, ${from} 0%, ${to} 65%, transparent 100%)`,
      }}
    />
  );
}

export default function Ornaments({ variant = 'hero' }) {
  if (variant === 'band') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Blob className="absolute -left-20 top-10 h-64 w-64 animate-float-slower" from="#E85D75" to="#8B5CF6" opacity={0.4} />
        <Blob className="absolute -right-16 bottom-0 h-72 w-72 animate-float-slow" from="#F7B267" to="#E85D75" opacity={0.32} />
        <Sparkle className="absolute left-[12%] top-[22%] h-4 w-4 text-peach" delay={400} />
        <Sparkle className="absolute right-[18%] top-[30%] h-3 w-3 text-lavender" delay={1200} />
        <Lotus tone="lotus" className="absolute -bottom-4 right-[8%] h-28 w-28 opacity-25" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Blob className="absolute -left-24 -top-16 h-80 w-80 animate-float-slower" from="#E85D75" to="#E9D5FF" opacity={0.45} />
      <Blob className="absolute right-[-6rem] top-24 h-96 w-96 animate-float-slow" from="#FFEDD5" to="#F7B267" opacity={0.4} />
      <Blob className="absolute bottom-[-8rem] left-1/3 h-72 w-72 animate-float-slower" from="#8E1F45" to="#8B5CF6" opacity={0.28} />
      <Sparkle className="absolute left-[8%] top-[18%] h-4 w-4 text-lotus/70" delay={200} />
      <Sparkle className="absolute left-[46%] top-[6%] h-3 w-3 text-gold/80" delay={900} />
      <Sparkle className="absolute right-[10%] bottom-[16%] h-4 w-4 text-lavender" delay={1500} />
      <Crescent className="absolute right-[6%] top-[10%] h-14 w-14 animate-float-slow opacity-90" />
      <Crescent className="absolute left-[12%] bottom-[10%] h-9 w-9 animate-float-slower opacity-60" />
      <Lotus tone="lavender" className="absolute right-[26%] bottom-[-2rem] h-24 w-24 opacity-20" />
    </div>
  );
}