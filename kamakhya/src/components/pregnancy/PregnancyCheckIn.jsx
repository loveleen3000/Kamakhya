import React, { useState } from 'react';
import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Chips, Scale } from '@/components/pregnancy/Pickers';
import { loadLogs, makeId, saveLogs } from '@/lib/pregnancyStore';
import { biList, MOODS, SYMPTOMS } from '@/data/pregnancyI18n';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';

export default function CheckInCard() {
  const { toast } = useToast();
  const { lang } = useApp();
  const pt = usePregT();
  const [mood, setMood] = useState([]);
  const [energy, setEnergy] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  const save = () => {
    if (!mood.length && !energy && !sleep && !symptoms.length && !note.trim()) {
      setError(pt('errEmpty'));
      return;
    }
    saveLogs([
      {
        id: makeId(),
        date: format(new Date(), 'yyyy-MM-dd'),
        mood: mood[0] || null,
        energy,
        sleep,
        symptoms,
        note: note.trim(),
      },
      ...loadLogs(),
    ]);
    setMood([]);
    setEnergy(null);
    setSleep(null);
    setSymptoms([]);
    setNote('');
    setError(null);
    toast({ title: pt('toastCheckin'), description: pt('toastPrivate') });
  };

  return (
    <div className="rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
      <p className="flex items-center gap-2 font-heading text-xl text-plum">
        <Sparkles className="h-4 w-4 text-lotus" /> {pt('checkinTitle')}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-plum/55">{pt('checkinIntro')}</p>

      <div className="mt-5 space-y-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-plum/50">{pt('mood')}</p>
          <Chips options={biList(MOODS, lang)} selected={mood} onChange={setMood} single />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Scale label={pt('energy')} value={energy} onChange={setEnergy} low={pt('energyLow')} high={pt('energyHigh')} />
          <Scale label={pt('sleep')} value={sleep} onChange={setSleep} low={pt('sleepLow')} high={pt('sleepHigh')} />
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-plum/50">{pt('symptomsOptional')}</p>
          <Chips options={biList(SYMPTOMS, lang)} selected={symptoms} onChange={setSymptoms} />
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={pt('notePh')}
          aria-label={pt('logNote')}
          className="min-h-[80px] rounded-2xl bg-white/80"
        />

        {error && <p className="rounded-2xl bg-lotus-100 px-4 py-3 text-xs font-semibold text-berry">{error}</p>}

        <Button onClick={save} className="press rounded-full brand-gradient px-7 shadow-glow-soft hover:opacity-95">
          {pt('saveCheckin')}
        </Button>
      </div>
    </div>
  );
}