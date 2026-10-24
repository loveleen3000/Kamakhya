import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { saveProfile } from '@/lib/pregnancyStore';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

const METHODS = [
  { id: 'lmp', titleKey: 'onbLmp', hintKey: 'onbLmpHint' },
  { id: 'due', titleKey: 'onbDue', hintKey: 'onbDueHint' },
  { id: 'unknown', titleKey: 'onbUnknown', hintKey: 'onbUnknownHint' },
];

const REMINDERS = [
  { key: 'hydration', labelKey: 'onbRemHydration' },
  { key: 'rest', labelKey: 'onbRemRest' },
  { key: 'appointments', labelKey: 'onbRemAppts' },
];

export default function PregnancyOnboarding({ initial = null, onSaved, onCancel = null }) {
  const pt = usePregT();
  const [name, setName] = useState(initial?.name || '');
  const [method, setMethod] = useState(initial?.method || 'lmp');
  const [date, setDate] = useState(initial?.lmpDate || initial?.dueDate || '');
  const [reminders, setReminders] = useState(initial?.reminders || { hydration: true, rest: true, appointments: true });
  const [showTips, setShowTips] = useState(initial?.showTips ?? true);
  const [error, setError] = useState(null);

  const pick = (m) => {
    setMethod(m);
    setError(null);
    if (m === 'unknown') setDate('');
  };

  const save = () => {
    if (method !== 'unknown' && !date) {
      setError(pt('onbErrDate'));
      return;
    }
    const profile = {
      name: name.trim(),
      method,
      lmpDate: method === 'lmp' ? date : null,
      dueDate: method === 'due' ? date : null,
      reminders,
      showTips,
      updatedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    onSaved?.(profile);
  };

  return (
    <div className="rounded-[2rem] glass p-6 shadow-lift sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">
        {initial ? pt('onbEyebrowEdit') : pt('onbEyebrowNew')}
      </p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">
        {initial ? pt('onbTitleEdit') : pt('onbTitleNew')}
      </h1>
      <p className="mt-2.5 text-sm leading-relaxed text-plum/60">{pt('onbIntro')}</p>

      <div className="mt-6 space-y-5">
        <div>
          <Label htmlFor="pg-name">{pt('onbName')}</Label>
          <Input
            id="pg-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={pt('onbNamePh')}
            className="mt-1.5 rounded-2xl bg-white/80"
          />
        </div>

        <div>
          <Label>{pt('onbMethod')}</Label>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => pick(m.id)}
                className={cn(
                  'press rounded-2xl border p-4 text-left shadow-soft transition',
                  method === m.id ? 'border-lotus/60 ring-lotus-soft' : 'border-plum/10 bg-white/70 hover:border-lotus/35',
                )}
              >
                <p className="text-sm font-bold text-plum">{pt(m.titleKey)}</p>
                <p className="mt-1 text-[11px] leading-snug text-plum/55">{pt(m.hintKey)}</p>
              </button>
            ))}
          </div>
        </div>

        {method !== 'unknown' ? (
          <div>
            <Label htmlFor="pg-date">{pt(method === 'lmp' ? 'onbLmpDate' : 'onbDueDate')}</Label>
            <Input
              id="pg-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className="mt-1.5 w-full rounded-2xl bg-white/80 sm:max-w-xs"
            />
          </div>
        ) : (
          <p className="rounded-2xl bg-peach-200 p-4 text-[13px] leading-relaxed text-plum/70">{pt('onbUnknownNote')}</p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {REMINDERS.map(({ key, labelKey }) => (
            <div key={key} className="flex items-center justify-between gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-soft">
              <span className="text-xs font-semibold text-plum/70">{pt(labelKey)}</span>
              <Switch
                checked={!!reminders[key]}
                onCheckedChange={(on) => setReminders({ ...reminders, [key]: on })}
                aria-label={pt(labelKey)}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-soft">
          <span className="text-xs font-semibold text-plum/70">{pt('onbShowTips')}</span>
          <Switch checked={showTips} onCheckedChange={setShowTips} aria-label={pt('onbShowTips')} />
        </div>

        {error && <p className="rounded-2xl bg-lotus-100 px-4 py-3 text-xs font-semibold text-berry">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={save}
            className="press rounded-full brand-gradient px-7 shadow-glow-soft hover:opacity-95"
          >
            {initial ? pt('onbBtnEdit') : pt('onbBtnNew')}
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="rounded-full text-plum/60 hover:text-plum">
              {pt('onbCancel')}
            </Button>
          )}
        </div>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-plum/45">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lotus" />
          {pt('onbDisclaimer')}
        </p>
      </div>
    </div>
  );
}