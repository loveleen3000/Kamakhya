import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { ArrowLeft, SlidersHorizontal, Sparkles, CalendarDays, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CycleWheel from '@/components/cycle/CycleWheel';
import CycleLegend from '@/components/cycle/CycleLegend';
import { Trash2, RotateCcw } from 'lucide-react';

// Real Month & Date-aware Calendar Component
function RealMonthCycleCalendar({ onSelectDay, selectedDay, cycleData }) {

const handleEraseAllData = () => {
  const confirmed = window.confirm(
    "Are you sure to Delete data permanently...."
  );

  if (confirmed) {
    // Browser memory se data delete karein
    localStorage.removeItem('kamakhya_cycle_data');
    localStorage.removeItem('kamakhya_reflections');

    // Page refresh karke reset karein
    window.location.reload();
  }
};
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed (9 for October)
  const todayDateNum = today.getDate(); // 24

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Current month grid calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay();

  const blanks = Array.from({ length: firstDayWeekday });
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Check phase type for each calendar date based on user's last period date
  const getPhaseForDate = (dayNum) => {
    if (!cycleData?.lastPeriodDate) return 'normal';
    const cellDate = new Date(currentYear, currentMonth, dayNum);
    const startDate = new Date(cycleData.lastPeriodDate);

    const diffDays = Math.floor((cellDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'normal';

    const cycleDay = (diffDays % (Number(cycleData.cycleLength) || 28)) + 1;
    const periodLen = Number(cycleData.periodLength) || 5;

    if (cycleDay <= periodLen) return 'period';
    if (cycleDay >= 12 && cycleDay <= 16) return 'ovulation';
    return 'normal';
  };

  return (
    <div className="rounded-3xl glass p-6 shadow-soft border border-plum/10 bg-white/80">
      <div className="flex items-center justify-between pb-4 border-b border-plum/10 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-lotus" />
          <h3 className="font-heading text-lg font-bold text-plum">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          Today: {todayDateNum} {monthNames[currentMonth].slice(0, 3)}
        </span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-plum/50 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-9 w-full" />
        ))}

        {monthDays.map((dayNum) => {
          const isToday = dayNum === todayDateNum;
          const isSelected = selectedDay === dayNum;
          const phase = getPhaseForDate(dayNum);

          let bgClass = "hover:bg-rose-50 text-plum/80";
          if (phase === 'period') {
            bgClass = "bg-rose-100/90 text-rose-800 font-bold";
          } else if (phase === 'ovulation') {
            bgClass = "bg-purple-100/90 text-purple-800 font-bold";
          }

          if (isToday) {
            bgClass = "bg-rose-500 text-white font-bold shadow-md scale-105 z-10";
          } else if (isSelected) {
            bgClass = "border-2 border-rose-400 bg-rose-50 text-rose-900 font-bold";
          }

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => onSelectDay && onSelectDay(dayNum)}
              className={`relative h-9 w-full rounded-xl text-xs flex items-center justify-center transition-all ${bgClass}`}
            >
              {dayNum}
              {isToday && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
      {/* Data Erasure Card */}
<div className="mt-8 rounded-[2rem] border border-rose-200/80 bg-rose-50/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h4 className="text-xs font-bold uppercase tracking-wider text-plum flex items-center gap-2">
      <Trash2 className="h-4 w-4 text-rose-600" />
      Privacy & Data Erasure
    </h4>
    <p className="text-xs text-plum/60 mt-1">
      Apne device se sabhi logged period dates aur rhythms ko permanently delete karein.
    </p>
  </div>

  <button
    type="button"
    onClick={handleEraseAllData}
    className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-5 py-2.5 text-xs font-bold text-rose-600 shadow-sm hover:bg-rose-50 hover:border-rose-400 transition cursor-pointer shrink-0"
  >
    <RotateCcw className="h-3.5 w-3.5" />
    Erase All Cycle Data
  </button>
</div>

      {/* Legend Footer */}
      <div className="mt-5 flex items-center justify-center gap-4 text-[10px] font-semibold text-plum/65 border-t border-plum/10 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /> Period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-300" /> Ovulation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Today (Active)
        </span>
      </div>
    </div>
  );
}

export default function CycleTracker() {
  const navigate = useNavigate();
  const { t } = useApp();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cycleData, setCycleData] = useState(null);

  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load cycle data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kamakhya_cycle_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCycleData(parsed);
        if (parsed.lastPeriodDate) setLastPeriodDate(parsed.lastPeriodDate);
        if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
        if (parsed.periodLength) setPeriodLength(parsed.periodLength);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Cycle Calculations & Delayed Check
  const cycleStatus = useMemo(() => {
    if (!cycleData?.lastPeriodDate) {
      return { isSet: false, currentCycleDay: 1, isDelayed: false, daysLate: 0 };
    }

    const start = new Date(cycleData.lastPeriodDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const cLen = Number(cycleData.cycleLength) || 28;

    if (diffDays < 0) {
      return { isSet: true, currentCycleDay: 1, isDelayed: false, daysLate: 0 };
    }

    const isDelayed = diffDays >= cLen;
    const daysLate = isDelayed ? diffDays - cLen + 1 : 0;
    const currentCycleDay = (diffDays % cLen) + 1;

    return {
      isSet: true,
      currentCycleDay,
      isDelayed,
      daysLate,
      diffDays
    };
  }, [cycleData]);

  const handleSaveDates = (e) => {
    e.preventDefault();
    if (!lastPeriodDate) return;

    const data = {
      lastPeriodDate,
      cycleLength: Number(cycleLength),
      periodLength: Number(periodLength),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('kamakhya_cycle_data', JSON.stringify(data));
    setCycleData(data);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF8] pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum/60 hover:text-plum transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="press inline-flex items-center gap-2 rounded-full border border-plum/15 bg-white/80 px-5 py-2.5 text-xs font-bold text-plum shadow-soft hover:border-lotus/40 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-lotus" />
            Set / Edit Cycle Dates
          </button>
        </div>

        {/* Delayed Alert Banner */}
        {cycleStatus.isDelayed && (
          <div className="mb-8 rounded-3xl border border-rose-300 bg-rose-50/90 p-5 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-200/80 text-rose-800">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  Period Delayed by {cycleStatus.daysLate} Day{cycleStatus.daysLate > 1 ? 's' : ''}
                </h4>
                <p className="text-xs text-rose-700/80 mt-0.5">
                  Your expected {cycleData?.cycleLength}-day cycle has passed. Log your new period date below if bleeding has started.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition shrink-0"
            >
              Log New Period Date
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500">
            NATURAL RHYTHM
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-plum sm:text-4xl">
            Cycle Tracker & Rhythm Wheel
          </h1>
          <p className="mt-2 text-sm text-plum/60 max-w-xl">
            {cycleData?.lastPeriodDate
              ? `Last Period Started: ${cycleData.lastPeriodDate} • Cycle: ${cycleData.cycleLength || 28} Days`
              : 'Set your period date to start tracking your dynamic cycle schedule.'}
          </p>
        </div>

        {/* Main Grid: Wheel + Real Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wheel & Legend */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-3xl glass p-6 sm:p-8 shadow-soft border border-plum/10">
            <CycleWheel selectedDay={cycleStatus.currentCycleDay} />
            <div className="w-full mt-6">
              <CycleLegend />
            </div>
          </div>

          {/* Real Calendar View */}
          <div className="lg:col-span-5 space-y-6">
            <RealMonthCycleCalendar
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              cycleData={cycleData}
            />

            <div className="rounded-3xl border border-rose-200/60 bg-rose-50/60 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" /> Selected Date: Oct {selectedDay}
              </div>
              <p className="text-xs text-plum/70 leading-relaxed">
                Click on any date across the calendar to review phase shifts, fertility indicators, and tailored wellness guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Setup Modal Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-plum/10">
            <div className="flex items-center justify-between pb-4 border-b border-plum/10">
              <h3 className="font-heading text-lg font-bold text-plum">Cycle Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full p-1 text-plum/50 hover:bg-rose-50 hover:text-plum transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDates} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1.5">
                  First Day of Last Period
                </label>
                <input
                  type="date"
                  required
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full rounded-2xl border border-plum/15 px-4 py-2.5 text-sm font-medium text-plum focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1.5">
                    Cycle Length (Days)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="45"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className="w-full rounded-2xl border border-plum/15 px-4 py-2.5 text-sm font-medium text-plum focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1.5">
                    Period Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(e.target.value)}
                    className="w-full rounded-2xl border border-plum/15 px-4 py-2.5 text-sm font-medium text-plum focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-full brand-gradient py-3.5 text-xs font-bold text-blush shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Saved & Updated!
                  </>
                ) : (
                  'Save & Apply Dates'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}