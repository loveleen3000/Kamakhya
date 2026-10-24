import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Shield, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { useApp } from '@/lib/AppContext';
import { FEATURES } from '@/data/kamakhya';

const ICONS = { compass: Compass, sparkles: Sparkles, shield: Shield, book: BookOpen };

export default function Features() {
  const { t } = useApp();

  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Why Kamakhya" title={t('featureTitle')} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((feature, i) => {
          const Icon = ICONS[feature.icon] ?? Sparkles;
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[2rem] glass p-7 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lotus/15 blur-2xl transition group-hover:bg-lotus/25" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-plum text-blush shadow-glow-soft">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-6 font-display text-2xl text-plum">{feature.title}</h3>
              <p className="relative mt-3 max-w-md text-sm leading-relaxed text-plum/60">{feature.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}