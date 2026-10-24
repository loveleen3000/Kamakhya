import React from 'react';
import { cn } from '@/lib/utils';

const MOUTHS = {
  calm: 'M28 60 q12 7 24 0',
  radiant: 'M26 56 q14 16 28 0',
  sensitive: 'M28 63 q12 4 24 0',
  crampy: 'M28 65 q12 -7 24 0',
  low: 'M28 65 q12 -6 24 0',
};

export default function MoodFace({ mood, className }) {
  return (
    <svg viewBox="0 0 80 80" className={cn('h-14 w-14', className)} aria-hidden="true">
      <defs>
        <linearGradient id={`mood-${mood.key}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mood.from} />
          <stop offset="100%" stopColor={mood.to} />
        </linearGradient>
      </defs>

      <circle cx="40" cy="40" r="36" fill={`url(#mood-${mood.key})`} />

      {mood.key === 'radiant' && (
        <>
          <path d="M24 33 q6 -8 12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M44 33 q6 -8 12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood.key === 'calm' && (
        <>
          <path d="M25 34 q6 5 12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M43 34 q6 5 12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {(mood.key === 'sensitive' || mood.key === 'crampy' || mood.key === 'low') && (
        <>
          <circle cx="31" cy="35" r="3.2" fill="#fff" />
          <circle cx="49" cy="35" r="3.2" fill="#fff" />
        </>
      )}

      <path d={MOUTHS[mood.key]} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />

      {mood.key === 'sensitive' && <circle cx="23" cy="48" r="3.4" fill="#fff" opacity="0.9" />}
      {mood.key === 'low' && <path d="M30 66 q10 -4 20 0" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.4" />}
    </svg>
  );
}