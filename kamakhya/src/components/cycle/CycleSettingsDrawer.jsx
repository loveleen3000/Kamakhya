import React, { useState } from 'react';
import { Check, EyeOff, Bell, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/lib/AppContext';
import { CYCLE } from '@/data/kamakhya';

export default function CycleSettingsDrawer({ open, onOpenChange }) {
  const { t, discreet, setDiscreet } = useApp();
  const { toast } = useToast();
  const [cycleLength, setCycleLength] = useState(CYCLE.cycleLength);
  const [periodLength, setPeriodLength] = useState(CYCLE.periodLength);
  const [reminders, setReminders] = useState({ period: true, ovulation: true, log: false });
  const [hideWidget, setHideWidget] = useState(true);

  const save = () => {
    onOpenChange(false);
    toast({
      title: 'Cycle settings saved',
      description: `${cycleLength}-day cycle · ${periodLength}-day period`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/60 bg-blush/95 backdrop-blur-xl sm:max-w-md"
      >
        <SheetHeader className="text-left">
          <span className="mb-2 grid h-11 w-11 place-items-center rounded-2xl brand-gradient text-blush shadow-glow-soft">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <SheetTitle className="font-display text-2xl text-plum">{t('settingsTitle')}</SheetTitle>
          <SheetDescription className="text-sm text-plum/55">
            Fine-tune your rhythm — Kamakhya adjusts predictions around it.
          </SheetDescription>
        </SheetHeader>

        <Accordion type="multiple" defaultValue={['basics']} className="mt-6">
          <AccordionItem value="basics" className="border-plum/10">
            <AccordionTrigger className="text-sm font-bold text-plum hover:no-underline">
              Cycle basics
            </AccordionTrigger>
            <AccordionContent className="space-y-7 pb-6 pt-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-plum/75">Cycle length</p>
                  <p className="font-heading text-xl text-plum">{cycleLength} days</p>
                </div>
                <Slider
                  className="mt-4"
                  min={21}
                  max={45}
                  step={1}
                  value={[cycleLength]}
                  onValueChange={(v) => setCycleLength(v[0])}
                />
                <p className="mt-2 text-[11px] text-plum/45">Between 21 and 45 days is considered typical.</p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-plum/75">Period length</p>
                  <p className="font-heading text-xl text-plum">{periodLength} days</p>
                </div>
                <Slider
                  className="mt-4"
                  min={2}
                  max={9}
                  step={1}
                  value={[periodLength]}
                  onValueChange={(v) => setPeriodLength(v[0])}
                />
                <p className="mt-2 text-[11px] text-plum/45">Bleeding beyond 8 days is worth a doctor’s check-in.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reminders" className="border-plum/10">
            <AccordionTrigger className="text-sm font-bold text-plum hover:no-underline">
              Gentle reminders
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-6 pt-2">
              {[
                { key: 'period', label: 'Period heads-up', hint: 'Two days before your window opens' },
                { key: 'ovulation', label: 'Fertile window', hint: 'When ovulation is likely' },
                { key: 'log', label: 'Daily log nudge', hint: 'A quiet reminder at 9pm' },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-4 w-4 text-lotus" />
                    <div>
                      <p className="text-sm font-semibold text-plum/80">{row.label}</p>
                      <p className="text-[11px] text-plum/45">{row.hint}</p>
                    </div>
                  </div>
                  <Switch
                    checked={reminders[row.key]}
                    onCheckedChange={(v) => setReminders((r) => ({ ...r, [row.key]: v }))}
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="discretion" className="border-plum/10">
            <AccordionTrigger className="text-sm font-bold text-plum hover:no-underline">
              Discretion
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pb-6 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <EyeOff className="mt-0.5 h-4 w-4 text-lotus" />
                  <div>
                    <p className="text-sm font-semibold text-plum/80">Discreet Diary mode</p>
                    <p className="text-[11px] text-plum/45">Blurs cycle days, notes and scores instantly</p>
                  </div>
                </div>
                <Switch checked={discreet} onCheckedChange={setDiscreet} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-plum/80">Hide from lock screen</p>
                  <p className="text-[11px] text-plum/45">Widgets show a soft pattern instead</p>
                </div>
                <Switch checked={hideWidget} onCheckedChange={setHideWidget} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <button
          type="button"
          onClick={save}
          className="press mt-8 flex w-full items-center justify-center gap-2 rounded-full brand-gradient px-6 py-4 text-sm font-bold text-blush shadow-glow"
        >
          <Check className="h-4 w-4" /> Save cycle settings
        </button>
      </SheetContent>
    </Sheet>
  );
}