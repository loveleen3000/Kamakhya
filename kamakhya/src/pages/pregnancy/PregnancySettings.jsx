import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

import PregnancyOnboarding from '@/components/pregnancy/PregnancyOnboarding';
import { clearPregnancyData, fmtDate, loadProfile, saveProfile } from '@/lib/pregnancyStore';
import { tpl } from '@/data/pregnancyI18n';
import { useToast } from '@/components/ui/use-toast';
import usePregT from '@/hooks/usePregT';
import { addDays, format } from 'date-fns';

const REMINDERS = [
  { key: 'hydration', labelKey: 'setRemHyd', hintKey: 'setRemHydHint' },
  { key: 'rest', labelKey: 'setRemRest', hintKey: 'setRemRestHint' },
  { key: 'appointments', labelKey: 'setRemApt', hintKey: 'setRemAptHint' },
];

export default function PregnancySettings() {
  const { toast } = useToast();
  const pt = usePregT();
  const [profile, setProfile] = useState(undefined);
  const [editing, setEditing] = useState(false);

  useEffect(() => setProfile(loadProfile()), []);

  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-28 text-center text-sm font-semibold text-plum/45">{pt('loadingSettings')}</div>
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

  const patch = (p) => {
    saveProfile(p);
    setProfile(p);
  };

  const due = profile.dueDate
    ? profile.dueDate
    : profile.lmpDate
      ? format(addDays(new Date(profile.lmpDate), 280), 'yyyy-MM-dd')
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('pregMode')}</p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{pt('setTitle')}</h1>

      <div className="mt-8 rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg text-plum">{pt('setDetails')}</p>
            <p className="mt-2 text-sm text-plum/65">
              {profile.name ? `${profile.name} • ` : ''}
              {profile.method === 'unknown'
                ? pt('setDatesUnknown')
                : profile.method === 'lmp'
                  ? tpl(pt('setLmp'), { d: fmtDate(profile.lmpDate) })
                  : tpl(pt('setDue'), { d: fmtDate(profile.dueDate) })}
            </p>
            {due && <p className="mt-1 text-xs text-plum/50">{tpl(pt('setEstDue'), { d: fmtDate(due) })}</p>}
          </div>
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            className="rounded-full border-plum/15 bg-white/70 shadow-soft hover:border-lotus/50 hover:text-berry"
          >
            {pt('setUpdate')}
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
        <p className="font-heading text-lg text-plum">{pt('setRemTitle')}</p>
        <div className="mt-4 space-y-3">
          {REMINDERS.map(({ key, labelKey, hintKey }) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3.5 shadow-soft">
              <div>
                <p className="text-sm font-semibold text-plum">{pt(labelKey)}</p>
                <p className="mt-0.5 text-[11px] text-plum/50">{pt(hintKey)}</p>
              </div>
              <Switch
                checked={!!profile.reminders?.[key]}
                onCheckedChange={(on) => patch({ ...profile, reminders: { ...profile.reminders, [key]: on } })}
                aria-label={pt(labelKey)}
              />
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3.5 shadow-soft">
            <div>
              <p className="text-sm font-semibold text-plum">{pt('setTips')}</p>
              <p className="mt-0.5 text-[11px] text-plum/50">{pt('setTipsHint')}</p>
            </div>
            <Switch checked={!!profile.showTips} onCheckedChange={(on) => patch({ ...profile, showTips: on })} aria-label={pt('setTips')} />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-berry/25 bg-white/85 p-5 shadow-soft sm:p-6">
        <p className="font-heading text-lg text-plum">{pt('setClearTitle')}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-plum/60">{pt('setClearIntro')}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="mt-4 rounded-full border-berry/30 text-berry hover:bg-berry hover:text-blush">
              <Trash2 className="h-4 w-4" /> {pt('setClearBtn')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[1.6rem] border-white/70">
            <AlertDialogHeader>
              <AlertDialogTitle>{pt('setClearConfTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{pt('setClearConfDesc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">{pt('setKeepData')}</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full bg-berry text-blush hover:bg-plum"
                onClick={() => {
                  clearPregnancyData();
                  setProfile(null);
                  toast({ title: pt('toastCleared'), description: pt('toastClearedDesc') });
                }}
              >
                {pt('setClearAll')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-plum/40">{pt('setPrivacy')}</p>
    </div>
  );
}