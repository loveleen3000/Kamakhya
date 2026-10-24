import { addDays, differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';

const KEYS = {
  profile: 'kamakhya:pregnancy:profile',
  appointments: 'kamakhya:pregnancy:appointments',
  logs: 'kamakhya:pregnancy:logs',
  tasks: 'kamakhya:pregnancy:tasks',
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const loadProfile = () => loadJSON(KEYS.profile, null);
export const saveProfile = (p) => saveJSON(KEYS.profile, p);
export const loadAppointments = () => loadJSON(KEYS.appointments, []);
export const saveAppointments = (list) => saveJSON(KEYS.appointments, list);
export const loadLogs = () => loadJSON(KEYS.logs, []);
export const saveLogs = (list) => saveJSON(KEYS.logs, list);
export const loadTasks = () => loadJSON(KEYS.tasks, []);
export const saveTasks = (list) => saveJSON(KEYS.tasks, list);

export const clearPregnancyData = () =>
  Object.values(KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* noop */
    }
  });

/**
 * Estimate gestational age from the profile.
 * Returns { known: false } when no usable date exists — never invents a week.
 */
export function pregnancyInfo(profile) {
  if (!profile) return null;
  let due = null;
  if (profile.dueDate) due = parseISO(profile.dueDate);
  else if (profile.lmpDate) due = addDays(parseISO(profile.lmpDate), 280);
  if (!due || !isValid(due)) return { known: false, profile };

  const daysLeft = differenceInCalendarDays(due, new Date());
  const elapsed = Math.max(0, 280 - daysLeft);
  const week = Math.min(42, Math.floor(elapsed / 7) + 1);
  const day = (elapsed % 7) + 1;
  const trimester = elapsed >= 189 ? 3 : elapsed >= 91 ? 2 : 1;
  return { known: true, profile, dueDate: due, daysLeft, week, day, trimester, guideWeek: Math.min(40, week) };
}

export const fmtDate = (value, pattern = 'd MMM yyyy') =>
  typeof value === 'string' ? format(parseISO(value), pattern) : format(value, pattern);