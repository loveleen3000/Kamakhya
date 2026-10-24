import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Sparkles } from 'lucide-react';
import { Lotus } from '@/components/decor/Ornaments';
import { useApp } from '@/lib/AppContext';

export default function ReflectionNotebook({ value, onChange, onSave }) {
  const { t } = useApp();
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({ x: x * 7, y: y * 5 });
  };

  const handleClick = () => {
    const id = Date.now();
    setRipples((r) => [...r, id]);
    setTimeout(() => setRipples((r) => r.filter((item) => item !== id)), 700);
    onSave();
  };

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] glass p-6 shadow-soft sm:p-7">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-plum/40">
          <Feather className="h-3.5 w-3.5 text-lotus" /> {t('reflectionTitle')}
        </p>
        <span className="text-[11px] font-semibold text-plum/40">{value.length} characters</span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-plum/10 bg-white/80">
        <Lotus tone="lotus" className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 opacity-[0.09]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 33px, rgba(61,20,30,0.06) 34px)',
          }}
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder="How did your body feel today? What did it ask for?"
          className="relative w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-[34px] text-plum placeholder:text-plum/35 focus:outline-none"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-[11px] font-semibold text-plum/45">
          <Sparkles className="h-3.5 w-3.5 text-lotus" /> Saved entries sharpen tomorrow’s guidance
        </p>

        <motion.button
          type="button"
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => setOffset({ x: 0, y: 0 })}
          onClick={handleClick}
          animate={{ x: offset.x, y: offset.y }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden rounded-full brand-gradient px-7 py-4 text-sm font-bold text-blush shadow-glow"
        >
          <span className="relative z-10 flex items-center gap-2">{t('saveReflection')}</span>
          {ripples.map((id) => (
            <motion.span
              key={id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            />
          ))}
        </motion.button>
      </div>
    </div>
  );
}