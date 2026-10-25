import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MoodSelector from '@/components/journal/MoodSelector';
import EnergySlider from '@/components/journal/EnergySlider';
import SymptomChips from '@/components/journal/SymptomChips';
import ReflectionNotebook from '@/components/journal/ReflectionNotebook';
import JournalTimeline from '@/components/journal/JournalTimeline';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/lib/AppContext';
import { CYCLE, JOURNAL, MOODS, phaseForCycleDay } from '@/data/kamakhya';

export default function Journal() {
  const { t, language } = useApp();
  const { toast } = useToast();
  const [mood, setMood] = useState('radiant');
  const [energy, setEnergy] = useState(4);
  const [symptoms, setSymptoms] = useState(['bloating']);
  const [note, setNote] = useState('');

  // Persisted reflections from localStorage, falling back to JOURNAL mock
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('kamakhya_reflections');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return JOURNAL;
  });

  // Keep reflections synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kamakhya_reflections', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  // Delete multiple entries (Selected items)
  const handleDeleteSelected = (idsToDelete) => {
    setEntries((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    if (toast) {
      toast({
        title: language === 'hi' ? 'रिफ्लेक्शन्स हटा दिए गए' : 'Reflections deleted',
        description: language === 'hi' ? 'चयनित एंट्रीज सफलतापूर्वक हटा दी गईं।' : 'Selected entries were successfully removed.',
      });
    }
  };

  // Delete single entry
  const handleDeleteSingle = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    if (toast) {
      toast({
        title: language === 'hi' ? 'एंट्री हटा दी गई' : 'Entry deleted',
        description: language === 'hi' ? 'यह एंट्री हटा दी गई है।' : 'Entry removed successfully.',
      });
    }
  };

  // Compute live cycle stats from user's logged period dates
  const liveCycle = useMemo(() => {
    try {
      const saved = localStorage.getItem('kamakhya_cycle_data');
      if (!saved) return null;

      const { lastPeriodDate, cycleLength = 28, periodLength = 5 } = JSON.parse(saved);
      if (!lastPeriodDate) return null;

      const start = new Date(lastPeriodDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return null;

      const cLen = Number(cycleLength);
      const cycleDay = (diffDays % cLen) + 1;
      const phase = typeof phaseForCycleDay === 'function' ? phaseForCycleDay(cycleDay) : null;

      return {
        cycleDay,
        phaseName: phase?.name || 'Follicular',
        monthShort: today.toLocaleDateString('en-US', { month: 'short' }),
        todayDate: today.getDate(),
      };
    } catch {
      return null;
    }
  }, []);

  const toggleSymptom = (key) =>
    setSymptoms((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));

  const save = () => {
    const cycleDay = liveCycle?.cycleDay || CYCLE?.cycleDay || 19;
    const phaseName = liveCycle?.phaseName || phaseForCycleDay?.(cycleDay)?.name || 'Follicular';
    const monthStr = liveCycle?.monthShort || CYCLE?.monthShort || 'Oct';
    const dayNum = liveCycle?.todayDate || CYCLE?.today || 24;

    const entry = {
      id: `new-${Date.now()}`,
      date: `${monthStr} ${dayNum}`,
      label: language === 'hi' ? 'आज' : 'Today',
      cycleDay,
      phase: phaseName,
      moodKey: mood,
      energy,
      pain: symptoms.includes('cramps') ? 3 : 1,
      temperature: (CYCLE?.basalTemp || 36.6).toString(),
      symptoms: symptoms.length ? symptoms : ['bloating'],
      note: note.trim() || (language === 'hi' ? 'त्वरित चेक-इन लॉग किया गया — कोई नोट नहीं।' : 'Logged a quick check-in — no notes today.'),
      ritual: 'Logged in Kamakhya',
    };

    setEntries((prev) => [entry, ...prev]);
    setNote('');

    if (toast) {
      const moodLabel = MOODS?.find((m) => m.key === mood)?.label || mood;
      toast({
        title: language === 'hi' ? 'रिफ्लेक्शन सुरक्षित किया गया' : 'Reflection saved',
        description: `${moodLabel} · ${language === 'hi' ? 'ऊर्जा' : 'energy'} ${energy}/5`,
      });
    }
  };

  const isHindi = language === 'hi';

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-lotus">
          {isHindi ? 'दैनिक लॉग' : 'Daily log'}
        </span>
        <h1 className="mt-3 font-display text-4xl leading-tight text-plum sm:text-5xl">{t('journalTitle')}</h1>
        <p className="mt-3 text-base text-plum/60">{t('journalSub')}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[2.25rem] glass p-6 shadow-soft sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-plum/40">{t('moodTitle')}</p>
            <div className="mt-5">
              <MoodSelector value={mood} onChange={setMood} />
            </div>
          </div>

          <EnergySlider value={energy} onChange={setEnergy} />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2.25rem] glass-soft p-6 shadow-soft sm:p-7"
          >
            <SymptomChips value={symptoms} onToggle={toggleSymptom} />
          </motion.div>

          <ReflectionNotebook value={note} onChange={setNote} onSave={save} />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-2xl text-plum">
              {isHindi ? 'आपकी हालिया प्रविष्टियाँ' : t('timelineTitle')}
            </h2>
            <span className="rounded-full bg-peach px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A5B1F]">
              {entries.length} {isHindi ? 'प्रविष्टियाँ' : 'entries'}
            </span>
          </div>
          
          <JournalTimeline 
            entries={entries} 
            onDeleteSelected={handleDeleteSelected}
            onDeleteSingle={handleDeleteSingle}
          />
        </div>
      </div>
    </div>
  );
}