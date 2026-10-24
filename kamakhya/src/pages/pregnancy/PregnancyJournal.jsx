import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import LogEntryForm from '@/components/pregnancy/LogEntryForm';
import DangerSignsCard from '@/components/pregnancy/DangerSignsCard';
import { fmtDate, loadLogs, saveLogs } from '@/lib/pregnancyStore';
import { tpl, txValue } from '@/data/pregnancyI18n';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

export default function PregnancyJournal() {
  const { toast } = useToast();
  const { lang } = useApp();
  const pt = usePregT();
  const [entries, setEntries] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => setEntries(loadLogs()), []);

  const trends = useMemo(() => {
    const counts = {};
    (entries || []).forEach((e) => (e.symptoms || []).forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [entries]);

  const maxCount = trends.length ? trends[0][1] : 1;

  const remove = (id) => {
    const next = (entries || []).filter((e) => e.id !== id);
    saveLogs(next);
    setEntries(next);
    toast({ title: pt('toastEntryDeleted'), description: pt('toastEntryDeletedDesc') });
  };

  const openEdit = (e) => {
    setEditing(e);
    setFormOpen(true);
  };

  if (entries === null) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-28 text-center text-sm font-semibold text-plum/45">{pt('loadingJournal')}</div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('pregMode')}</p>
          <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{pt('jrTitle')}</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-plum/60">{pt('jrIntro')}</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="press rounded-full brand-gradient px-6 shadow-glow-soft hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> {pt('jrNew')}
        </Button>
      </div>

      {trends.length > 0 && (
        <div className="mt-8 rounded-[1.6rem] glass p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-plum/45">{pt('jrTrends')}</p>
          <div className="mt-3 space-y-2.5">
            {trends.map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <p className="w-36 shrink-0 text-xs font-semibold text-plum/70">{txValue(name, lang)}</p>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/70">
                  <div className="h-full rounded-full brand-gradient" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <p className="w-6 text-right text-xs font-bold text-plum/50">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {entries.length ? (
          entries.map((e) => {
            const summary = [
              e.mood && txValue(e.mood, lang),
              e.energy ? `${pt('energy')} ${e.energy}/5` : null,
              e.sleep ? `${pt('sleep')} ${e.sleep}/5` : null,
            ]
              .filter(Boolean)
              .join(' • ');
            return (
              <div key={e.id} className="rounded-[1.5rem] glass p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg text-plum">{fmtDate(e.date, 'EEEE, d MMM yyyy')}</p>
                    {summary && <p className="mt-0.5 text-xs text-plum/60">{summary}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
                      aria-label={pt('logTitleEdit')}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
                          aria-label={pt('delEntryTitle')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[1.6rem] border-white/70">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{pt('delEntryTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>{tpl(pt('delEntryDesc'), { d: fmtDate(e.date) })}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">{pt('keep')}</AlertDialogCancel>
                          <AlertDialogAction className="rounded-full bg-berry text-blush hover:bg-plum" onClick={() => remove(e.id)}>
                            {pt('del')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {e.symptoms?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.symptoms.map((s) => (
                      <span key={s} className="rounded-full bg-lotus-100 px-2.5 py-1 text-[10px] font-bold text-berry">
                        {txValue(s, lang)}
                      </span>
                    ))}
                  </div>
                )}
                {e.note && (
                  <p className="mt-3 rounded-2xl bg-white/80 p-3.5 text-[13px] leading-relaxed text-plum/75">{e.note}</p>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.75rem] glass p-8 text-center shadow-soft">
            <p className="font-heading text-xl text-plum">{pt('jrEmptyTitle')}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-plum/60">{pt('jrEmptyIntro')}</p>
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="press mt-5 rounded-full brand-gradient px-6 shadow-glow-soft hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> {pt('jrFirst')}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <DangerSignsCard />
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-plum/40">{pt('jrDisclaimer')}</p>

      <LogEntryForm
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing}
        onSaved={() => {
          setEntries(loadLogs());
          toast({ title: pt(editing ? 'toastEntryUpdated' : 'toastEntrySaved'), description: pt('toastPrivate') });
        }}
      />
    </div>
  );
}