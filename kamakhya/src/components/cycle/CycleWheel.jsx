import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function CycleWheel({ selectedDay = 1, onSelectDay }) {
  // localStorage se user ka real data read karna
  const cycleData = useMemo(() => {
    try {
      const saved = localStorage.getItem('kamakhya_cycle_data');
      if (!saved) return { currentDay: selectedDay || 1, phaseName: 'Follicular', cycleLength: 28 };
      
      const parsed = JSON.parse(saved);
      const start = new Date(parsed.lastPeriodDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      const cycleLen = Number(parsed.cycleLength) || 28;
      const periodLen = Number(parsed.periodLength) || 5;
      const currentDay = diffDays >= 0 ? (diffDays % cycleLen) + 1 : 1;

      // Active display day: agar user ne calendar pe click kiya hai toh wo, nahi toh currentDay
      const activeDay = selectedDay || currentDay;

      let phaseName = 'Follicular';
      if (activeDay <= periodLen) phaseName = 'Menstrual';
      else if (activeDay < 14) phaseName = 'Follicular';
      else if (activeDay <= 16) phaseName = 'Ovulatory';
      else phaseName = 'Luteal';

      return {
        activeDay,
        phaseName,
        cycleLength: cycleLen
      };
    } catch {
      return { activeDay: selectedDay || 1, phaseName: 'Follicular', cycleLength: 28 };
    }
  }, [selectedDay]);

  // Circle progress angle (degree) calculate karna
  const angle = ((cycleData.activeDay - 1) / cycleData.cycleLength) * 360;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
        {/* Outer Circular SVG Ring */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-rose-100/60"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Menstrual segment */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#8E1F45"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray="264"
            strokeDashoffset="210"
            strokeLinecap="round"
          />
          {/* Ovulation segment */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#F7B267"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray="264"
            strokeDashoffset="235"
            transform="rotate(160 50 50)"
            strokeLinecap="round"
          />
          {/* Active pointer marker */}
          <motion.circle
            cx="50"
            cy="8"
            r="4.5"
            fill="#3A1D28"
            stroke="#FFF"
            strokeWidth="2"
            transform={`rotate(${angle} 50 50)`}
            transition={{ type: 'spring', damping: 20 }}
          />
        </svg>

        {/* Center Inner Circle with Dynamic Details */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/50">
            CYCLE DAY
          </p>
          <motion.p
            key={cycleData.activeDay}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-plum mt-0.5"
          >
            {cycleData.activeDay}
          </motion.p>
          <span className="mt-2 rounded-full bg-[#3A1D28] px-3.5 py-1 text-[10px] font-bold tracking-widest text-blush uppercase shadow-sm">
            {cycleData.phaseName}
          </span>
          <p className="text-[11px] font-semibold text-plum/50 mt-1.5">
            {cycleData.cycleLength}-day rhythm
          </p>
        </div>
      </div>
    </div>
  );
}