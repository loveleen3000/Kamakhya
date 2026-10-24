import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Thermometer } from 'lucide-react';
import MoodFace from '@/components/journal/MoodFace';
import { useApp } from '@/lib/AppContext';
import { MOODS, SYMPTOMS } from '@/data/kamakhya';

function PainGauge({ level }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-5 rounded-full ${n <= level ? (level >= 4 ? 'bg-berry' : 'bg-lotus') : 'bg-plum/12'}`}
        />
      ))}
    </div>
  );
}

export default function JournalTimeline({ entries }) {
  const { mask } = useApp();

  return (
    <div className="relative">
      <span className="absolute left-[27px] top-3 bottom-3 w-px bg-gradient-to-b from-lotus/50 via-plum/15 to-transparent" />

      <div className="space-y-5">
        {entries.map((entry, i) => {
          const mood = MOODS.find((m) => m.key === entry.moodKey) ?? MOODS[0];
          return (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-16"
            >
              <span className="absolute left-0 top-4 grid h-14 w-14 place-items-center rounded-full glass shadow-soft">
                <MoodFace mood={mood} className="h-9 w-9" />
              </span>

              <div className="rounded-[1.75rem] glass p-5 shadow-soft transition hover:shadow-lift">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg text-plum">
                      {entry.date} <span className="text-xs font-body font-semibold text-plum/45">· {entry.label}</span>
                    </p>
                    <p className="text-[11px] font-semibold text-lotus">
                      Cycle day <span className={mask}>{entry.cycleDay}</span> · {entry.phase}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-soft"
                      style={{ backgroundImage: `linear-gradient(120deg, ${mood.from}, ${mood.to})` }}>
                      {mood.label}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-bold text-plum/55 ${mask}`}>
                      <Thermometer className="h-3.5 w-3.5 text-lotus" /> {entry.temperature}°C
                    </span>
                  </div>
                </div>

                <p className={`mt-3.5 text-sm leading-relaxed text-plum/70 ${mask}`}>“{entry.note}”</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-plum/10 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum/40">Pain</span>
                    <PainGauge level={entry.pain} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum/40">Energy</span>
                    <span className={`text-xs font-bold text-plum/60 ${mask}`}>{entry.energy}/5</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.symptoms.map((key) => (
                      <span key={key} className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-plum/60 shadow-soft">
                        {SYMPTOMS.find((s) => s.key === key)?.label ?? key}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-plum/45">
                    <Droplet className="h-3.5 w-3.5 text-lotus/70" /> {entry.ritual}
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}