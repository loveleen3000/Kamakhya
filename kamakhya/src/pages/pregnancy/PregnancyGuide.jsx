import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadProfile, pregnancyInfo } from '@/lib/pregnancyStore';
import { WEEKS } from '@/data/pregnancy';
import { bi, TRIMESTERS, WEEKS_HI } from '@/data/pregnancyI18n';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

const weeksFor = (trimesterId, allWeeks) =>
  trimesterId === 1 ? allWeeks.slice(0, 13) : trimesterId === 2 ? allWeeks.slice(13, 27) : allWeeks.slice(27);

export default function PregnancyGuide() {
  const { lang } = useApp();
  const pt = usePregT();
  const [profile, setProfile] = useState(undefined);
  const [tab, setTab] = useState('t1');

  useEffect(() => setProfile(loadProfile()), []);

  const info = useMemo(() => pregnancyInfo(profile), [profile]);

  useEffect(() => {
    if (info?.trimester) setTab(`t${info.trimester}`);
  }, [info?.trimester]);

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-28 text-center text-sm font-semibold text-plum/45">{pt('loadingGuide')}</div>
    );
  }

  const current = info?.known ? info.guideWeek : null;
  const allWeeks = lang === 'hi' ? WEEKS_HI : WEEKS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('guideEyebrow')}</p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{pt('guideTitle')}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-plum/60">{pt('guideIntro')}</p>
      <p className="mt-4 inline-flex rounded-full glass px-4 py-2 text-xs font-bold shadow-soft">
        {current ? (
          <span className="text-berry">{pt('guideCurrent').replace('{n}', current)}</span>
        ) : (
          <span className="text-plum/50">{pt('guideAddDates')}</span>
        )}
      </p>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="glass h-auto rounded-full p-1.5">
          {TRIMESTERS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={`t${t.id}`}
              className="whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold text-plum/60 data-[state=active]:bg-plum data-[state=active]:text-blush sm:text-sm"
            >
              {bi(t.label, lang)}
            </TabsTrigger>
          ))}
        </TabsList>

        {TRIMESTERS.map((t) => (
          <TabsContent key={t.id} value={`t${t.id}`} className="mt-6">
            <div className="rounded-[1.5rem] glass p-5 shadow-soft">
              <p className="font-display text-xl text-plum">
                {bi(t.title, lang)} — {bi(t.weeks, lang)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-plum/65">{bi(t.focus, lang)}</p>
            </div>

            <div className="mt-5 space-y-4">
              {weeksFor(t.id, allWeeks).map((w) => (
                <article
                  key={w.w}
                  className={cn('rounded-[1.5rem] glass p-5 shadow-soft sm:p-6', current === w.w && 'ring-2 ring-lotus/60')}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-heading text-xl text-plum">
                      {pt('weekUnit')} {w.w}
                    </h2>
                    <span className="rounded-full bg-lotus-100 px-3 py-1 text-[11px] font-bold text-berry">
                      {pt('sizePrefix')} {w.size}
                    </span>
                  </div>
                  {current === w.w && (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lotus">{pt('currentWeek')}</p>
                  )}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/70 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lotus">{pt('yourBaby')}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-plum/75">{w.baby}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum/45">{pt('youMayNotice')}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-plum/75">{w.you}</p>
                    </div>
                    <div className="rounded-2xl bg-peach-200 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A5B1F]">{pt('selfCare')}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-plum/75">{w.care}</p>
                    </div>
                    <div className="rounded-2xl bg-lavender-100 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-berry">{pt('askTeam')}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-plum/75">{w.ask}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-plum/40">{pt('guideDisclaimer')}</p>
    </div>
  );
}