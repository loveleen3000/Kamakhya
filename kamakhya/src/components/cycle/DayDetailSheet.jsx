import React from 'react';
import { Droplet, Moon, Sparkles, Thermometer } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import MoodFace from '@/components/journal/MoodFace';
import { CYCLE, dayInfo, SYMPTOMS } from '@/data/kamakhya';
import { useApp } from '@/lib/AppContext';

export default function DayDetailSheet({ day, open, onOpenChange }) {
  const { t, mask } = useApp();
  if (day == null) return null;
  const info = dayInfo(day);
  const symptomLabels = info.symptoms.map((key) => SYMPTOMS.find((s) => s.key === key)?.label ?? key);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-white/60 bg-blush/95 backdrop-blur-xl sm:max-w-sm">
        <SheetHeader className="text-left">
          <SheetDescription className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">
            {t('dayDetail')}
          </SheetDescription>
          <SheetTitle className="font-display text-3xl text-plum">
            {CYCLE.monthShort} {day}
          </SheetTitle>
          <p className="text-sm text-plum/55">
            Cycle day <span className={mask}>{info.cycleDay}</span> · {info.phase.name}
          </p>
        </SheetHeader>

        <div className="mt-7 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full brand-gradient px-3.5 py-1.5 text-[11px] font-bold text-blush">
              {info.phase.name}
            </span>
            {info.isToday && (
              <span className="rounded-full bg-plum px-3.5 py-1.5 text-[11px] font-bold text-blush">Today</span>
            )}
            {info.isPeriod && (
              <span className="flex items-center gap-1 rounded-full bg-lotus-100 px-3.5 py-1.5 text-[11px] font-bold text-berry">
                <Droplet className="h-3 w-3" /> {info.flow} flow
              </span>
            )}
            {info.isPredicted && (
              <span className="rounded-full border border-dashed border-lotus px-3.5 py-1.5 text-[11px] font-bold text-berry">
                Predicted window
              </span>
            )}
            {info.isOvulation && (
              <span className="flex items-center gap-1 rounded-full bg-peach px-3.5 py-1.5 text-[11px] font-bold text-[#9A5B1F]">
                <Sparkles className="h-3 w-3" /> Ovulation
              </span>
            )}
          </div>

          <div className="rounded-3xl glass p-5 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">Mood & energy</p>
            <div className="mt-4 flex items-center gap-4">
              <MoodFace mood={info.mood} className="h-14 w-14" />
              <div>
                <p className="font-heading text-xl text-plum">{info.mood.label}</p>
                <p className="text-xs text-plum/50">{info.mood.hint}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`h-2 flex-1 rounded-full ${n <= info.energy ? 'brand-gradient' : 'bg-plum/10'}`}
                />
              ))}
              <span className={`ml-2 text-xs font-bold text-plum/60 ${mask}`}>Energy {info.energy}/5</span>
            </div>
          </div>

          <div className="rounded-3xl glass p-5 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/40">Symptoms</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {symptomLabels.length ? (
                symptomLabels.map((label) => (
                  <span key={label} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-plum/70 shadow-soft">
                    {label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-plum/45">Nothing logged — a clear day.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl glass p-4 shadow-soft">
              <Thermometer className="h-4 w-4 text-lotus" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-plum/40">Basal temp</p>
              <p className={`font-heading text-xl text-plum ${mask}`}>{info.temperature}°C</p>
            </div>
            <div className="rounded-3xl glass p-4 shadow-soft">
              <Moon className="h-4 w-4 text-lavender" />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-plum/40">Next period</p>
              <p className="font-heading text-xl text-plum">{CYCLE.nextPeriod}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-plum p-5 shadow-lift">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-peach">Your note</p>
            <p className={`mt-2 text-sm leading-relaxed text-blush/85 ${mask}`}>{info.note}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}