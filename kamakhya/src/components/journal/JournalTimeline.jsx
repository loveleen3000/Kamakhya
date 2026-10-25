import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Thermometer, Trash2, CheckSquare, Square, Sparkles } from 'lucide-react';
import MoodFace from '@/components/journal/MoodFace';
import { useApp } from '@/lib/AppContext';
import { MOODS, SYMPTOMS } from '@/data/kamakhya';

function PainGauge({ level }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-5 rounded-full ${n <= level ? (level >= 4 ? 'bg-berry' : 'bg-lotus') : 'bg-plum/12'}`}
        />
      ))}
    </div>
  );
}

export default function JournalTimeline({ entries, onDeleteSelected, onDeleteSingle }) {
  const { mask, language } = useApp();
  const isHindi = language === 'hi';

  const [selectedIds, setSelectedIds] = useState([]);

  // Single select / unselect toggle
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all
  const toggleSelectAll = () => {
    if (selectedIds.length === entries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(entries.map((e) => e.id));
    }
  };

  // Multiple delete handler
  const handleBatchDelete = () => {
    if (!selectedIds.length) return;
    if (onDeleteSelected) {
      onDeleteSelected(selectedIds);
      setSelectedIds([]);
    }
  };

  // Hindi phase mapping
  const phaseTranslations = {
    Follicular: 'फॉलिक्युलर (Follicular)',
    Luteal: 'ल्यूटियल (Luteal)',
    Menstrual: 'मासिक धर्म (Menstrual)',
    Ovulatory: 'ओव्यूलेशन (Ovulation)',
  };

  return (
    <div className="relative">
      {/* Top Action Bar: Sirf tabhi aayega jab entries hongi */}
      {entries.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2.5 backdrop-blur-md shadow-sm border border-plum/10">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-plum/70 hover:text-plum transition cursor-pointer"
          >
            {selectedIds.length === entries.length ? (
              <CheckSquare className="h-4 w-4 text-lotus" />
            ) : (
              <Square className="h-4 w-4 text-plum/40" />
            )}
            <span>
              {selectedIds.length === entries.length
                ? isHindi ? 'सभी अनसेलेक्ट करें' : 'Deselect All'
                : isHindi ? 'सभी चुनें' : 'Select All'}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white cursor-pointer shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>
                {isHindi
                  ? `${selectedIds.length} हटाएं`
                  : `Delete (${selectedIds.length})`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Timeline Vertical Track Line */}
      {entries.length > 0 && (
        <span className="absolute left-[27px] top-14 bottom-3 w-px bg-gradient-to-b from-lotus/50 via-plum/15 to-transparent pointer-events-none" />
      )}

      {/* Main Container with Scrollable Area */}
      <div className="space-y-5 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {entries.length === 0 ? (
            /* Attractive Empty State Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-[2.5rem] glass p-8 text-center shadow-soft border border-lotus/25"
            >
              {/* Background Glow Orbs */}
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-lotus/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-peach/40 blur-3xl pointer-events-none" />

              {/* Central Floating Badge */}
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-lotus/20 via-peach/30 to-white shadow-soft text-2xl">
                🌸
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl text-plum">
                {isHindi ? 'आपकी डायरी अभी खाली है' : 'Your Sacred Space is Quiet'}
              </h3>

              {/* Description */}
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-plum/65 font-body">
                {isHindi
                  ? 'आज आप कैसा महसूस कर रही हैं? बाईं तरफ से अपना मूड और ऊर्जा चुनें और अपना पहला रिफ्लेक्शन दर्ज करें।'
                  : 'Take a mindful pause. Log your mood, feelings, and symptoms on the left to begin your wellness journey today.'}
              </p>

              {/* Subtle Callout Pill */}
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-lotus/10 px-4 py-1.5 text-[11px] font-bold text-lotus border border-lotus/20 shadow-soft">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isHindi ? 'पहला कदम: आज का अनुभव लिखें' : 'Step 1: Save today’s check-in'}</span>
              </div>
            </motion.div>
          ) : (
            entries.map((entry, i) => {
              const mood = MOODS.find((m) => m.key === entry.moodKey) ?? MOODS[0];
              const isSelected = selectedIds.includes(entry.id);

              return (
                <motion.article
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="relative pl-16"
                >
                  {/* Mood Face Icon */}
                  <span className="absolute left-0 top-4 grid h-14 w-14 place-items-center rounded-full glass shadow-soft z-10">
                    <MoodFace mood={mood} className="h-9 w-9" />
                  </span>

                  <div
                    className={`relative rounded-[1.75rem] glass p-5 shadow-soft transition hover:shadow-lift ${
                      isSelected ? 'ring-2 ring-lotus/80 bg-white/95' : ''
                    }`}
                  >
                    {/* Header: Select Checkbox, Date & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleSelect(entry.id)}
                            className="text-plum/50 hover:text-lotus transition cursor-pointer"
                            title={isHindi ? 'चुनें' : 'Select'}
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-lotus" />
                            ) : (
                              <Square className="h-4 w-4 text-plum/30" />
                            )}
                          </button>
                          <p className="font-heading text-lg text-plum">
                            {entry.date}{' '}
                            <span className="text-xs font-body font-semibold text-plum/45">
                              · {entry.label === 'Today' && isHindi ? 'आज' : entry.label}
                            </span>
                          </p>
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-lotus pl-6">
                          {isHindi ? 'चक्र दिवस' : 'Cycle day'}{' '}
                          <span className={mask}>{entry.cycleDay}</span> ·{' '}
                          {isHindi ? phaseTranslations[entry.phase] || entry.phase : entry.phase}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          className="rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-soft"
                          style={{ backgroundImage: `linear-gradient(120deg, ${mood.from}, ${mood.to})` }}
                        >
                          {mood.label}
                        </span>
                        <span className={`flex items-center gap-1 text-[11px] font-bold text-plum/55 ${mask}`}>
                          <Thermometer className="h-3.5 w-3.5 text-lotus" /> {entry.temperature}°C
                        </span>

                        {/* Individual Card Delete Trash Icon */}
                        {onDeleteSingle && (
                          <button
                            type="button"
                            onClick={() => onDeleteSingle(entry.id)}
                            className="ml-1 rounded-full p-1.5 text-plum/35 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                            title={isHindi ? 'हटाएं' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reflection Note */}
                    <p className={`mt-3.5 text-sm leading-relaxed text-plum/70 font-body ${mask}`}>
                      “{entry.note}”
                    </p>

                    {/* Card Footer: Pain, Energy, Symptoms & Ritual */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-plum/10 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum/40">
                          {isHindi ? 'दर्द' : 'Pain'}
                        </span>
                        <PainGauge level={entry.pain} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum/40">
                          {isHindi ? 'ऊर्जा' : 'Energy'}
                        </span>
                        <span className={`text-xs font-bold text-plum/60 ${mask}`}>{entry.energy}/5</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {entry.symptoms.map((key) => (
                          <span
                            key={key}
                            className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-plum/60 shadow-soft"
                          >
                            {SYMPTOMS.find((s) => s.key === key)?.label ?? key}
                          </span>
                        ))}
                      </div>

                      <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-plum/45">
                        <Droplet className="h-3.5 w-3.5 text-lotus/70" /> {entry.ritual}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}