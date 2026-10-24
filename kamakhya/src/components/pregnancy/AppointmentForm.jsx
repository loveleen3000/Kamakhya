import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { loadAppointments, makeId, saveAppointments } from '@/lib/pregnancyStore';
import usePregT from '@/hooks/usePregT';

export default function AppointmentForm({ open, onOpenChange, initial = null, defaultDate, onSaved }) {
  const pt = usePregT();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [provider, setProvider] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [questions, setQuestions] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setDate(initial?.date || defaultDate || '');
      setTime(initial?.time || '');
      setProvider(initial?.provider || '');
      setLocation(initial?.location || '');
      setNotes(initial?.notes || '');
      setQuestions(initial?.questions || '');
      setError(null);
    }
  }, [open, initial, defaultDate]);

  const save = () => {
    if (!title.trim()) {
      setError(pt('apptErrName'));
      return;
    }
    if (!date) {
      setError(pt('apptErrDate'));
      return;
    }
    const record = {
      id: initial?.id || makeId(),
      title: title.trim(),
      date,
      time: time.trim(),
      provider: provider.trim(),
      location: location.trim(),
      notes: notes.trim(),
      questions: questions.trim(),
    };
    const list = loadAppointments();
    const next = initial ? list.map((a) => (a.id === initial.id ? record : a)) : [...list, record];
    next.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
    saveAppointments(next);
    onSaved?.(next);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-[1.75rem] border-white/70 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-plum">
            {initial ? pt('apptTitleEdit') : pt('apptTitleNew')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ap-title">{pt('apptName')}</Label>
            <Input
              id="ap-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder={pt('apptNamePh')}
              className="mt-1.5 rounded-2xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ap-date">{pt('apptDate')}</Label>
              <Input
                id="ap-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(null);
                }}
                className="mt-1.5 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="ap-time">{pt('apptTime')}</Label>
              <Input id="ap-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 rounded-2xl" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ap-provider">{pt('apptProvider')}</Label>
              <Input
                id="ap-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder={pt('apptProviderPh')}
                className="mt-1.5 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="ap-location">{pt('apptLocation')}</Label>
              <Input
                id="ap-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={pt('apptLocationPh')}
                className="mt-1.5 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ap-notes">{pt('apptNotes')}</Label>
            <Textarea
              id="ap-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={pt('apptNotesPh')}
              className="mt-1.5 min-h-[70px] rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="ap-questions">{pt('apptQuestions')}</Label>
            <Textarea
              id="ap-questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder={pt('apptQuestionsPh')}
              className="mt-1.5 min-h-[70px] rounded-2xl"
            />
          </div>

          {error && <p className="rounded-2xl bg-lotus-100 px-4 py-3 text-xs font-semibold text-berry">{error}</p>}

          <Button onClick={save} className="w-full rounded-full brand-gradient py-3 shadow-glow-soft hover:opacity-95">
            {initial ? pt('apptSaveEdit') : pt('apptSaveNew')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}