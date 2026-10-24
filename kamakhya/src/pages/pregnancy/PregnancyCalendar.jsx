import React, { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { CalendarPlus, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppointmentForm from '@/components/pregnancy/AppointmentForm';
import { fmtDate, loadAppointments, saveAppointments } from '@/lib/pregnancyStore';
import { tpl } from '@/data/pregnancyI18n';
import { useToast } from '@/components/ui/use-toast';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function PregnancyCalendar() {
  const { toast } = useToast();
  const pt = usePregT();
  const [viewDate, setViewDate] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [appts, setAppts] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => setAppts(loadAppointments()), []);

  const byDate = useMemo(() => {
    const map = {};
    (appts || []).forEach((a) => {
      (map[a.date] = map[a.date] || []).push(a);
    });
    return map;
  }, [appts]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate));
    const end = endOfWeek(endOfMonth(viewDate));
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  const selectedISO = format(selected, 'yyyy-MM-dd');
  const dayAppts = byDate[selectedISO] || [];

  const upcomingAll = useMemo(() => {
    const todayISO = format(new Date(), 'yyyy-MM-dd');
    return [...(appts || [])]
      .filter((a) => a.date >= todayISO)
      .sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`));
  }, [appts]);

  const openEdit = (a) => {
    setEditing(a);
    setFormDate(a.date);
    setFormOpen(true);
  };

  const remove = (id, title) => {
    const next = (appts || []).filter((a) => a.id !== id);
    saveAppointments(next);
    setAppts(next);
    toast({ title: pt('toastApptRemoved'), description: tpl(pt('toastRemovedDesc'), { t: title }) });
  };

  const AppointmentRow = ({ a }) => (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-white/75 p-4 shadow-soft">
      <div>
        <p className="text-sm font-bold text-plum">{a.title}</p>
        <p className="mt-0.5 text-xs font-semibold text-berry">
          {fmtDate(a.date)}
          {a.time ? ` • ${a.time}` : ''}
        </p>
        {a.provider && (
          <p className="mt-1 text-xs text-plum/60">
            {a.provider}
            {a.location ? ` • ${a.location}` : ''}
          </p>
        )}
        {a.notes && <p className="mt-1.5 text-xs leading-relaxed text-plum/55">{a.notes}</p>}
        {a.questions && (
          <p className="mt-2 rounded-xl bg-lavender-100 p-2.5 text-xs leading-relaxed text-plum/70">
            <span className="font-bold text-berry">{pt('toAsk')}</span>
            {a.questions}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={() => openEdit(a)}
          className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
          aria-label={`Edit ${a.title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
              aria-label={`Delete ${a.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[1.6rem] border-white/70">
            <AlertDialogHeader>
              <AlertDialogTitle>{pt('delApptTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {tpl(pt('delApptDesc'), { t: a.title, d: fmtDate(a.date) })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">{pt('keep')}</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full bg-berry text-blush hover:bg-plum"
                onClick={() => remove(a.id, a.title)}
              >
                {pt('del')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('pregMode')}</p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{pt('calTitle')}</h1>
      <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-plum/60">{pt('calIntro')}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(subMonths(viewDate, 1))}
              className="press grid h-9 w-9 place-items-center rounded-full bg-white/80 text-plum/60 shadow-soft hover:text-berry"
              aria-label={pt('calPrev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="font-heading text-lg text-plum">{format(viewDate, 'MMMM yyyy')}</p>
              <button
                type="button"
                onClick={() => {
                  setViewDate(new Date());
                  setSelected(new Date());
                }}
                className="text-[11px] font-bold text-berry hover:underline"
              >
                {pt('calToday')}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="press grid h-9 w-9 place-items-center rounded-full bg-white/80 text-plum/60 shadow-soft hover:text-berry"
              aria-label={pt('calNext')}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <p key={d} className="pb-1 text-center text-[10px] font-bold uppercase tracking-wider text-plum/35">
                {d}
              </p>
            ))}
            {days.map((day) => {
              const iso = format(day, 'yyyy-MM-dd');
              const dayItems = byDate[iso] || [];
              const inMonth = isSameMonth(day, viewDate);
              const sel = isSameDay(day, selected);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(day)}
                  aria-label={format(day, 'd MMMM yyyy')}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-semibold transition',
                    inMonth ? 'text-plum' : 'text-plum/25',
                    sel ? 'brand-gradient text-blush shadow-glow-soft' : 'bg-white/60 hover:bg-white',
                    isToday(day) && !sel && 'ring-2 ring-lotus/50',
                  )}
                >
                  {format(day, 'd')}
                  {dayItems.length > 0 && (
                    <span className={cn('mt-1 flex gap-0.5', sel && 'opacity-90')}>
                      {dayItems.slice(0, 3).map((a) => (
                        <span key={a.id} className={cn('h-1.5 w-1.5 rounded-full', sel ? 'bg-blush' : 'bg-lotus')} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            onClick={() => {
              setEditing(null);
              setFormDate(selectedISO);
              setFormOpen(true);
            }}
            className="press mt-5 w-full rounded-full brand-gradient py-3 shadow-glow-soft hover:opacity-95"
          >
            <CalendarPlus className="h-4 w-4" /> {tpl(pt('calAddOn'), { d: format(selected, 'd MMM') })}
          </Button>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
            <p className="font-heading text-lg text-plum">{format(selected, 'EEEE, d MMMM yyyy')}</p>
            {dayAppts.length ? (
              <div className="mt-4 space-y-3">
                {dayAppts.map((a) => (
                  <AppointmentRow key={a.id} a={a} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-plum/55">{pt('calNothingDay')}</p>
            )}
          </div>

          <div className="rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-plum/45">{pt('calUpcoming')}</p>
            {upcomingAll.length ? (
              <div className="mt-4 space-y-3">
                {upcomingAll.map((a) => (
                  <AppointmentRow key={a.id} a={a} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-plum/55">{pt('calNone')}</p>
            )}
          </div>
        </div>
      </div>

      <AppointmentForm
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing}
        defaultDate={formDate}
        onSaved={(next) => {
          setAppts(next);
          toast({
            title: pt(editing ? 'toastApptUpdated' : 'toastApptAdded'),
            description: pt('toastPrivate'),
          });
        }}
      />
    </div>
  );
}