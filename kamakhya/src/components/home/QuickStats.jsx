import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, CalendarClock, Activity, ArrowUpRight, Sparkles } from 'lucide-react';

export default function QuickStats() {
  const navigate = useNavigate();

  // Dynamic user cycle calculations
  const stats = useMemo(() => {
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
      const pLen = Number(periodLength);
      const currentDay = (diffDays % cLen) + 1;
      const daysUntilNext = cLen - currentDay;
      const isLate = diffDays >= cLen && daysUntilNext <= 0;

      let phaseName = 'Follicular energy';
      let phaseColor = 'text-rose-500';
      if (currentDay <= pLen) {
        phaseName = 'Menstrual rest';
        phaseColor = 'text-berry';
      } else if (currentDay >= 12 && currentDay <= 16) {
        phaseName = 'Ovulatory peak';
        phaseColor = 'text-amber-500';
      } else if (currentDay > 16) {
        phaseName = 'Luteal wind-down';
        phaseColor = 'text-purple-600';
      }

      return {
        configured: true,
        currentDay,
        phaseName,
        phaseColor,
        daysUntilNext: Math.max(daysUntilNext, 0),
        isLate,
        daysLate: isLate ? diffDays - cLen + 1 : 0,
        cycleProgress: Math.min(Math.round((currentDay / cLen) * 100), 100),
      };
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Cycle Day & Current Phase */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/cycle')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-plum/10 bg-white/75 p-6 shadow-soft backdrop-blur-md transition-all hover:border-lotus/40 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-berry shadow-inner transition group-hover:bg-rose-100">
              <Moon className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-plum/40 group-hover:text-lotus transition">
              View Wheel <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/50">
              CYCLE DAY
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tracking-tight text-plum">
                {stats ? stats.currentDay : '--'}
              </span>
              <span className="text-xs font-semibold text-plum/50">
                {stats ? `/ ${stats.cycleProgress}% elapsed` : 'not tracked'}
              </span>
            </div>
            <p className={`mt-1 text-xs font-semibold tracking-wide ${stats?.phaseColor || 'text-plum/50'}`}>
              {stats ? stats.phaseName : 'Set dates to reveal phase'}
            </p>
          </div>

          {/* Mini progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-plum/5">
            <div
              className="h-full rounded-full brand-gradient transition-all duration-700"
              style={{ width: `${stats?.cycleProgress || 0}%` }}
            />
          </div>
        </motion.div>

        {/* Card 2: Next Period Forecast */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/cycle')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-plum/10 bg-white/75 p-6 shadow-soft backdrop-blur-md transition-all hover:border-lotus/40 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner transition group-hover:bg-amber-100">
              <CalendarClock className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-amber-100/70 px-3 py-1 text-[10px] font-bold text-amber-800">
              {stats?.isLate
                ? `Delayed ${stats.daysLate}d`
                : stats
                ? `In ${stats.daysUntilNext} days`
                : 'Forecast pending'}
            </span>
          </div>

          <div className="mt-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/50">
              NEXT PERIOD
            </span>
            <div className="mt-1">
              <span className="font-display text-3xl font-bold tracking-tight text-plum">
                {stats?.isLate ? (
                  <span className="text-rose-600">Period Overdue</span>
                ) : stats ? (
                  `In ${stats.daysUntilNext} Days`
                ) : (
                  'Dates Needed'
                )}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-plum/55">
              {stats?.isLate
                ? 'Cycle limit reached • Tap to log new period'
                : stats
                ? 'Calculated via natural rhythmic orbit'
                : 'Tap to configure last period date'}
            </p>
          </div>
        </motion.div>

        {/* Card 3: Cycle Status / Health Pulse */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/cycle')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-plum/10 bg-white/75 p-6 shadow-soft backdrop-blur-md transition-all hover:border-lotus/40 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-700 shadow-inner transition group-hover:bg-purple-100">
              <Activity className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats?.isLate ? 'Review Needed' : stats ? 'Active & Synced' : 'Awaiting Setup'}
            </span>
          </div>

          <div className="mt-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum/50">
              CYCLE STATUS
            </span>
            <div className="mt-1">
              <span className="font-display text-3xl font-bold tracking-tight text-plum">
                {stats?.isLate ? 'Attention' : stats ? 'Optimal' : 'Unassigned'}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-plum/55">
              {stats ? 'Hormonal alignment active' : 'Click to activate zero-knowledge tracker'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}