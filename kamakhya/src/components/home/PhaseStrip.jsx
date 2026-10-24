import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { useApp } from '@/lib/AppContext';
import { CYCLE, PHASES } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

export default function PhaseStrip() {
  const { t } = useApp();
  const current = PHASES.find((p) => CYCLE.cycleDay >= p.from && CYCLE.cycleDay <= p.to);

  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Cycle intelligence" title={t('phaseTitle')} sub={t('phaseSub')} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PHASES.map((phase, i) => {
          const active = phase.key === current?.key;
          return (
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className={cn(
                'relative overflow-hidden rounded-[2rem] p-6 transition-shadow',
                active ? 'glass shadow-lift ring-1 ring-lotus/30' : 'glass-soft shadow-soft',
              )}
            >
              {active && (
                <span className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-plum px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blush">
                  <Check className="h-3 w-3" /> You are here
                </span>
              )}
              <span className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-blush shadow-glow-soft', phase.gradient)}>
                <span className="font-heading text-lg">{phase.from}</span>
              </span>
              <h3 className="mt-5 font-display text-2xl text-plum">{phase.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-lotus">{phase.range}</p>
              <p className="mt-4 text-sm font-semibold text-plum/75">{phase.note}</p>
              <p className="mt-2 text-sm leading-relaxed text-plum/55">{phase.detail}</p>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-plum/10">
                <div
                  className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', phase.gradient)}
                  style={{ width: active ? '62%' : `${(phase.days / CYCLE.cycleLength) * 100 + 24}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}