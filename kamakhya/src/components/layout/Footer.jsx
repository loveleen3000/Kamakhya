import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Linkedin, Youtube } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useApp } from '@/lib/AppContext';

export default function Footer() {
  const { t, openRitvi } = useApp();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-plum/10 bg-cream/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo size={56} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-plum/55">
            {t('tagline')} — cycle intelligence, private journalling and gentle education, made for Indian women.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Youtube, Linkedin].map((Icon, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-full glass text-plum/60 shadow-soft transition hover:text-lotus"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">Track</p>
          <ul className="space-y-3 text-sm text-plum/65">
            <li><Link className="transition hover:text-lotus" to="/cycle">{t('cycleTitle')}</Link></li>
            <li><Link className="transition hover:text-lotus" to="/journal">{t('journalTitle')}</Link></li>
            <li><Link className="transition hover:text-lotus" to="/learn">{t('learnTitle')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">Understand</p>
          <ul className="space-y-3 text-sm text-plum/65">
            <li><Link className="transition hover:text-lotus" to="/learn">PCOS &amp; Hormones</Link></li>
            <li><Link className="transition hover:text-lotus" to="/learn">Period Pain Hacks</Link></li>
            <li><Link className="transition hover:text-lotus" to="/learn">Sustainable Care</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">Ask</p>
          <ul className="space-y-3 text-sm text-plum/65">
            <li>
              <button type="button" onClick={openRitvi} className="press transition hover:text-lotus">
                Talk to Ritvi
              </button>
            </li>
            <li className="text-plum/45">Privacy first — your log stays yours.</li>
            <li className="text-plum/45">Made with care in India.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-plum/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-plum/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Kamakhya. Educational wellness guidance only — not a substitute for medical advice.</p>
          <p className="flex items-center gap-1.5">
            Built for her, with <Heart className="h-3.5 w-3.5 fill-lotus text-lotus" />
          </p>
        </div>
      </div>
    </footer>
  );
}