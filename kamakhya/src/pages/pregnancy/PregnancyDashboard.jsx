import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Baby, BookOpen, CalendarDays, NotebookPen, Pencil, Settings2, ShoppingBag, Sparkles, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PregnancyOnboarding from '@/components/pregnancy/PregnancyOnboarding';
import CheckInCard from '@/components/pregnancy/PregnancyCheckIn';
import DangerSignsCard from '@/components/pregnancy/DangerSignsCard';
import { loadAppointments, loadProfile, pregnancyInfo, fmtDate } from '@/lib/pregnancyStore';
import { bi, TRIMESTERS } from '@/data/pregnancyI18n';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

const QUICK = [
  { to: '/pregnancy/guide', icon: BookOpen, key: 'qaGuide' },
  { to: '/pregnancy/calendar', icon: CalendarDays, key: 'qaCalendar' },
  { to: '/pregnancy/journal', icon: NotebookPen, key: 'qaJournal' },
  { to: '/pregnancy/birth', icon: ShoppingBag, key: 'qaBirth' },
  { to: '/pregnancy/settings', icon: Settings2, key: 'qaSettings' },
];

const REMINDER_LABELS = { hydration: 'remHyd', rest: 'remRest', appointments: 'remApt' };

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'dashGm';
  if (h < 17) return 'dashGa';
  return 'dashGe';
}

export default function PregnancyDashboard() {
  const { mask, lang } = useApp();
  const pt = usePregT();
  const [profile, setProfile] = useState(undefined);
  const [appts, setAppts] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setAppts(loadAppointments());
  }, []);

  const info = useMemo(() => pregnancyInfo(profile), [profile]);

  const upcoming = useMemo(() => {
    const todayISO = format(new Date(), 'yyyy-MM-dd');
    return [...appts]
      .filter((a) => a.date >= todayISO)
      .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`))
      .slice(0, 3);
  }, [appts]);

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-28 text-center text-sm font-semibold text-plum/45">{pt('loading')}</div>
    );
  }

  if (!profile || editing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        <PregnancyOnboarding
          initial={editing ? profile : null}
          onSaved={(p) => {
            setProfile(p);
            setEditing(false);
          }}
          onCancel={editing ? () => setEditing(false) : null}
        />
      </div>
    );
  }

  const trimester = TRIMESTERS[(info?.trimester || 1) - 1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('pregMode')}</p>
          <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">
            {pt(greetingKey())}
            {profile.name ? `, ${profile.name}` : ''}.
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-plum/60">{pt('dashIntro')}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setEditing(true)}
          className="rounded-full border-plum/15 bg-white/70 shadow-soft hover:border-lotus/50 hover:text-berry"
        >
          <Pencil className="h-3.5 w-3.5" /> {pt('dashUpdate')}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.6rem] brand-gradient p-5 text-blush shadow-glow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blush/80">
            <Baby className="h-3.5 w-3.5" /> {pt('dashHere')}
          </p>
          {info?.known ? (
            <>
              <p className={cn('mt-3 font-display text-3xl leading-none', mask)}>
                {pt('weekUnit')} {info.week}
              </p>
              <p className={cn('mt-1.5 text-xs font-semibold text-blush/85', mask)}>
                {pt('dayOfWeek').replace('{d}', info.day)} • {bi(trimester.label, lang)}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-display text-2xl leading-tight">{pt('dashNoDates')}</p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="press mt-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30"
              >
                {pt('dashAddDates')}
              </button>
            </>
          )}
        </div>

        <div className="rounded-[1.6rem] glass p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-plum/45">{pt('dashDue')}</p>
          {info?.known ? (
            <>
              <p className={cn('mt-3 font-display text-2xl leading-tight text-plum', mask)}>{fmtDate(info.dueDate)}</p>
              <p className={cn('mt-1.5 text-xs font-semibold text-plum/55', mask)}>
                {info.daysLeft > 0 ? pt('dashDaysToGo').replace('{n}', info.daysLeft) : pt('dashAnyDay')}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-plum/55">{pt('dashDuePh')}</p>
          )}
          <p className="mt-3 text-[10px] leading-relaxed text-plum/35">{pt('dashDueNote')}</p>
        </div>

        <div className="rounded-[1.6rem] glass p-5 shadow-soft">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-plum/45">
            <Stethoscope className="h-3.5 w-3.5" /> {pt('dashNext')}
          </p>
          {upcoming.length ? (
            <ul className="mt-3 space-y-2.5">
              {upcoming.map((a) => (
                <li key={a.id} className="text-sm text-plum">
                  <span className="font-semibold">{a.title}</span>
                  <span className="block text-xs text-plum/50">
                    {fmtDate(a.date)}
                    {a.time ? ` • ${a.time}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-plum/55">{pt('dashNone')}</p>
          )}
          <Link to="/pregnancy/calendar" className="mt-3 inline-block text-xs font-bold text-berry hover:underline">
            {pt('dashManage')}
          </Link>
        </div>

        {profile.showTips ? (
          <div className="rounded-[1.6rem] glass p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-lotus">
              <Sparkles className="h-3.5 w-3.5" /> {pt('dashStage')}
            </p>
            <p className="mt-2 text-xs font-bold text-plum">
              {bi(trimester.title, lang)} — {bi(trimester.weeks, lang)}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-plum/65">{bi(trimester.tip, lang)}</p>
          </div>
        ) : (
          <div className="rounded-[1.6rem] glass p-5 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-plum/45">{pt('dashRem')}</p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-plum/65">
              {Object.entries(profile.reminders || {})
                .filter(([, on]) => on)
                .map(([k]) => (
                  <li key={k}>• {pt(REMINDER_LABELS[k] || k)}</li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {QUICK.map(({ to, icon: Icon, key }) => (
          <Link key={to} to={to} className="press rounded-[1.4rem] glass p-4 shadow-soft transition hover:shadow-lift">
            <Icon className="h-5 w-5 text-lotus" />
            <p className="mt-2.5 text-sm font-bold text-plum">{pt(key)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <CheckInCard />
      </div>

      <div className="mt-6">
        <DangerSignsCard compact />
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-plum/40">{pt('dashDisclaimer')}</p>
    </div>
  );
}