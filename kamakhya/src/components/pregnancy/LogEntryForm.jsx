import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Chips, Scale } from '@/components/pregnancy/Pickers';
import { loadLogs, makeId, saveLogs } from '@/lib/pregnancyStore';
import { biList, MOODS, SYMPTOMS } from '@/data/pregnancyI18n';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';

export default function LogEntryForm({ open, onOpenChange, initial = null, onSaved }) {
  const { lang } = useApp();
  const pt = usePregT();
  const [date, setDate] = useState('');
  const [mood, setMood] = useState([]);
  const [energy, setEnergy] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setDate(initial?.date || format(new Date(), 'yyyy-MM-dd'));
      setMood(initial?.mood ? [initial.mood] : []);
      setEnergy(initial?.energy ?? null);
      setSleep(initial?.sleep ?? null);
      setSymptoms(initial?.symptoms || []);
      setNote(initial?.note || '');
      setError(null);
    }
  }, [open, initial]);

  const save = () => {
    if (!date) {
      setError(pt('errDate'));
      return;
    }
    if (!mood.length && !energy && !sleep && !symptoms.length && !note.trim()) {
      setError(pt('errEmpty'));
      return;
    }
    const record = {
      id: initial?.id || makeId(),
      date,
      mood: mood[0] || null,
      energy,
      sleep,
      symptoms,
      note: note.trim(),
    };
    const rest = loadLogs().filter((e) => e.id !== record.id);
    saveLogs([record, ...rest].sort((a, b) => b.date.localeCompare(a.date)));
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-[1.75rem] border-white/70 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-plum">
            {initial ? pt('logTitleEdit') : pt('logTitleNew')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="log-date">{pt('logDate')}</Label>
            <Input
              id="log-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className="mt-1.5 w-full rounded-2xl sm:max-w-[200px]"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-plum/50">{pt('mood')}</p>
            <Chips options={biList(MOODS, lang)} selected={mood} onChange={setMood} single />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Scale label={pt('energy')} value={energy} onChange={setEnergy} low={pt('energyLow')} high={pt('energyHigh')} />
            <Scale label={pt('sleep')} value={sleep} onChange={setSleep} low={pt('sleepLow')} high={pt('sleepHigh')} />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-plum/50">{pt('symptomsOptional')}</p>
            <Chips options={biList(SYMPTOMS, lang)} selected={symptoms} onChange={setSymptoms} />
          </div>

          <div>
            <Label htmlFor="log-note">{pt('logNote')}</Label>
            <Textarea
              id="log-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={pt('logNotePh')}
              className="mt-1.5 min-h-[80px] rounded-2xl"
            />
          </div>

          {error && <p className="rounded-2xl bg-lotus-100 px-4 py-3 text-xs font-semibold text-berry">{error}</p>}

          <Button onClick={save} className="w-full rounded-full brand-gradient py-3 shadow-glow-soft hover:opacity-95">
            {initial ? pt('logSaveEdit') : pt('logSaveNew')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}