import React from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';
import { CYCLE, dayInfo } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

function DynamicCycleCalendar({ onSelectDay, selectedDay, cycleData }) {
  const today = new Date(); // Aaj ki date: 24 Oct 2026
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Current month (0-11)
  const currentRealDate = today.getDate(); // 24

  // Mahine ke total din aur pehle din ka vaar
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay();

  const blanks = Array.from({ length: firstDayWeekday });
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="rounded-3xl glass p-6 shadow-soft border border-plum/10">
      <div className="flex items-center justify-between pb-4 border-b border-plum/10 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-lotus" />
          <h3 className="font-heading text-lg font-bold text-plum">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <span className="text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full">
          Today: {currentRealDate} {monthNames[currentMonth].slice(0, 3)}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-plum/50 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-9 w-full" />
        ))}

        {monthDays.map((dateNum) => {
          const isToday = dateNum === currentRealDate;
          const isSelected = selectedDay === dateNum;

          return (
            <button
              key={dateNum}
              type="button"
              onClick={() => onSelectDay && onSelectDay(dateNum)}
              className={`relative h-9 w-full rounded-xl text-xs flex items-center justify-center transition-all ${
                isToday
                  ? 'bg-rose-500 text-white font-bold shadow-md scale-105'
                  : isSelected
                  ? 'bg-rose-100 text-rose-700 font-semibold'
                  : 'hover:bg-rose-50 text-plum/80'
              }`}
            >
              {dateNum}
              {isToday && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-plum/60 border-t border-plum/5 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Aaj ka din ({currentRealDate} Oct)
        </span>
        <span className="text-[10px] text-plum/45">Real-time sync</span>
      </div>
    </div>
  );
}