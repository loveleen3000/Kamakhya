import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, PlayCircle, Star, CalendarPlus } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Ornaments, { Crescent, Sparkle } from '@/components/decor/Ornaments';
import { useApp } from '@/lib/AppContext';
import { IMAGES } from '@/data/kamakhya';

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  }),
};

export default function Hero() {
  const { openRitvi, lang, language } = useApp();
  const navigate = useNavigate();

  // Screen par Hindi switch check
  const isHi = lang === 'hi' || language === 'hi' || localStorage.getItem('kamakhya_lang') === 'hi';

  // Trigger Ritvi Chat Drawer reliably
  const handleOpenRitvi = () => {
    if (typeof openRitvi === 'function') {
      openRitvi();
    }
    window.dispatchEvent(new CustomEvent('open-ritvi-chat'));
  };

  // Dynamic user cycle data from localStorage
  const userCycle = useMemo(() => {
    try {
      const saved = localStorage.getItem('kamakhya_cycle_data');
      if (!saved) return null;

      const { lastPeriodDate, cycleLength = 28, periodLength = 5 } = JSON.parse(saved);
      if (!lastPeriodDate) return null;

      const start = new Date(lastPeriodDate);
      const today = new Date();
      const diffTime = today.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return null;

      const currentDay = (diffDays % Number(cycleLength)) + 1;

      let phaseName = 'Follicular';
      let phaseTag = 'Follicular glow';
      let phaseSub = 'Oestrogen rising. Move, plan, begin.';

      if (currentDay <= Number(periodLength)) {
        phaseName = 'Menstrual';
        phaseTag = 'Rest & Recharge';
        phaseSub = 'Shedding phase. Rest and hydrate well.';
      } else if (currentDay < 14) {
        phaseName = 'Follicular';
        phaseTag = 'Follicular glow';
        phaseSub = 'Oestrogen rising. Move, plan, begin.';
      } else if (currentDay <= 16) {
        phaseName = 'Ovulation';
        phaseTag = 'Peak Fertility';
        phaseSub = 'Luteinizing surge. Peak radiant energy.';
      } else {
        phaseName = 'Luteal';
        phaseTag = 'Inward focus';
        phaseSub = 'Progesterone rising. Prioritize gentle flow.';
      }

      return {
        isConfigured: true,
        currentDay,
        phaseName,
        phaseTag,
        phaseSub,
      };
    } catch {
      return null;
    }
  }, []);

  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
      <Ornaments />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div className="relative">
          {/* Top Pill */}
          <motion.span
            variants={fade}
            initial="hidden"
            animate="show"
            custom={0}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-plum/70 shadow-soft"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lotus animate-aura" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lotus" />
            </span>
            {isHi ? "भारत भर की 50,000+ महिलाओं का भरोसा" : "ZERO-KNOWLEDGE WELLNESS"}
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={fade}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-7 font-display text-[2.6rem] leading-[1.04] tracking-tight text-plum sm:text-6xl lg:text-[4.35rem]"
          >
            {isHi ? (
              <>
                मासिक चक्र ट्रैकिंग,
                <br />
                <span className="gradient-text italic">आपके लिए समर्पित</span>
              </>
            ) : (
              <>
                Cycle Tracking,
                <br />
                <span className="gradient-text italic">Elevated for Her</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-plum/65 sm:text-lg"
          >
            {isHi
              ? "कामाख्या आपके चक्र, मनोदशा और लक्षणों को समझकर, आपकी AI सहेली ऋत्वी द्वारा शांत और व्यक्तिगत मार्गदर्शन देती है।"
              : "Kamakhya reads your rhythm — phases, moods, symptoms and questions — and turns them into calm, personal guidance from Ritvi, your AI companion."}
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fade} initial="hidden" animate="show" custom={3} className="mt-9 flex flex-wrap items-center gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/cycle')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="group relative overflow-hidden rounded-full brand-gradient px-7 py-4 text-sm font-bold text-blush shadow-glow cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isHi ? "फ्री ट्रैकिंग शुरू करें" : "Start Tracking Free"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleOpenRitvi}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="press rounded-full border border-plum/15 bg-white/80 px-7 py-4 text-sm font-bold text-plum shadow-soft backdrop-blur-md transition hover:border-lotus/40 hover:text-berry cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-lotus" />
                {isHi ? "ऋत्वी से कुछ भी पूछें" : "Ask Ritvi Anything"}
              </span>
            </motion.button>
          </motion.div>

          {/* Reviews Row */}
          <motion.div variants={fade} initial="hidden" animate="show" custom={4} className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['#8E1F45', '#E85D75', '#F7B267'].map((c, i) => (
                  <span
                    key={c}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-blush text-[11px] font-bold text-white shadow-soft"
                    style={{ background: c }}
                  >
                    {['A', 'N', 'R'][i]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-plum">4.9</span>
                </div>
                <p className="mt-0.5 text-xs text-plum/50">
                  {isHi ? "40+ शहरों में 12,400+ समीक्षाएं" : "12,400+ reviews from women in 40 cities"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Hero Visual Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[500px]"
        >
          <div className="absolute -left-10 top-8 h-56 w-56 animate-float-slower rounded-full bg-lotus/25 blur-3xl" />
          <div className="absolute -right-8 bottom-4 h-64 w-64 animate-float-slow rounded-full bg-lavender/50 blur-3xl" />

          <div className="relative rounded-[3rem] glass p-3 shadow-lift">
            <div className="relative overflow-hidden rounded-[2.4rem]">
              <Image
                src={IMAGES?.hero}
                alt="Kamakhya wellness companion"
                className="aspect-[5/6] w-full"
                fittingType="fill"
                focalPointY={0.42}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/55 via-plum/0 to-transparent" />

              {/* Bottom Phase Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-3xl border border-white/25 bg-white/20 p-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blush/90 text-berry">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blush/80">
                      {isHi ? "आज का चरण" : "Today’s phase"}
                    </p>
                    <p className="font-heading text-lg text-blush">
                      {userCycle ? userCycle.phaseName : (isHi ? "सेट नहीं है" : "Not Set")}
                    </p>
                  </div>
                </div>
                <p className="hidden text-right text-[11px] leading-snug text-blush/80 sm:block">
                  {userCycle ? (
                    userCycle.phaseSub
                  ) : (
                    <span 
                      onClick={() => navigate('/cycle')} 
                      className="cursor-pointer underline underline-offset-2 hover:text-white"
                    >
                      {isHi ? "तारीखें सेट करने के लिए टैप करें" : "Tap to set cycle dates"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Left Floating Card: Dynamic Cycle Day */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => !userCycle && navigate('/cycle')}
            className={`absolute -left-4 top-10 rounded-3xl glass px-4 py-3 shadow-lift sm:-left-10 ${
              !userCycle ? 'cursor-pointer hover:border-lotus/50 transition' : ''
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-plum/45">
              {isHi ? "चक्र दिवस" : "CYCLE DAY"}
            </p>
            {userCycle ? (
              <>
                <p className="font-heading text-2xl text-plum">{userCycle.currentDay}</p>
                <p className="text-[11px] font-semibold text-lotus">{userCycle.phaseTag}</p>
              </>
            ) : (
              <>
                <p className="font-heading text-xl text-plum/60 flex items-center gap-1.5 mt-0.5">
                  <CalendarPlus className="h-4 w-4 text-lotus" /> {isHi ? "सेटअप" : "Setup"}
                </p>
                <p className="text-[10px] font-semibold text-lotus">
                  {isHi ? "ट्रैक करने के लिए टैप करें" : "Tap to track"}
                </p>
              </>
            )}
          </motion.div>

          {/* Right Floating Card: Score */}
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-3 top-1/2 w-40 rounded-3xl glass px-4 py-3.5 shadow-lift sm:-right-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-plum/45">
              {isHi ? "वेलनेस स्कोर" : "WELLNESS SCORE"}
            </p>
            <p className="font-heading text-2xl text-plum">
              {userCycle ? '84' : '--'}
              {userCycle && <span className="text-base text-lotus">%</span>}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-plum/10">
              <div 
                className="h-full rounded-full brand-gradient transition-all duration-500" 
                style={{ width: userCycle ? '84%' : '0%' }} 
              />
            </div>
          </motion.div>

          <Crescent className="absolute -top-6 right-6 h-16 w-16 animate-float-slow opacity-90" />
          <Sparkle className="absolute left-6 top-1/2 h-4 w-4 text-lotus/70" delay={300} />
          <Sparkle className="absolute -bottom-2 right-16 h-3.5 w-3.5 text-gold" delay={1100} />
        </motion.div>
      </div>
    </section>
  );
}