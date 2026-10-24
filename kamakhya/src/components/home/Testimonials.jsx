import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { useApp } from '@/lib/AppContext';
import { TESTIMONIALS } from '@/data/kamakhya';

export default function Testimonials() {
  const { t } = useApp();

  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Real voices" title={t('testimonialsTitle')} />

      <div className="grid gap-5 lg:grid-cols-3">
        {TESTIMONIALS.map((item, i) => (
          <motion.figure
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="relative flex h-full flex-col justify-between rounded-[2rem] glass p-7 shadow-soft transition-shadow hover:shadow-lift"
          >
            <Quote className="h-7 w-7 text-lotus/40" />
            <blockquote className="mt-5 font-heading text-lg leading-relaxed text-plum/85">“{item.quote}”</blockquote>
            <figcaption className="mt-7 flex items-center justify-between border-t border-plum/10 pt-5">
              <div>
                <p className="text-sm font-bold text-plum">{item.name}</p>
                <p className="text-xs text-plum/50">
                  {item.city} • {item.detail}
                </p>
              </div>
              <div className="flex gap-0.5 text-gold">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-gold" />
                ))}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}