import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { bi, DANGER_SIGNS } from '@/data/pregnancyI18n';
import usePregT from '@/hooks/usePregT';

export default function DangerSignsCard({ compact = false }) {
  const { lang } = useApp();
  const pt = usePregT();
  const signs = compact ? DANGER_SIGNS.slice(0, 5) : DANGER_SIGNS;

  return (
    <div className="rounded-[1.6rem] border border-berry/25 bg-white/85 p-5 shadow-soft">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-berry">
        <AlertTriangle className="h-4 w-4" /> {pt('dangerTitle')}
      </p>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {signs.map((s) => (
          <li key={s.en} className="text-[13px] leading-snug text-plum/70">
            • {bi(s, lang)}
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-relaxed text-plum/50">
        <PhoneCall className="h-3 w-3 shrink-0" />
        {pt('dangerFooter')}
      </p>
    </div>
  );
}