import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '@/lib/i18n';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('kamakhya_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [discreet, setDiscreetState] = useState(() => {
    try {
      return localStorage.getItem('kamakhya:discreet') === 'true';
    } catch {
      return false;
    }
  });

  const [ritviOpen, setRitviOpen] = useState(false);
  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem('kamakhya:mode') || 'cycle';
    } catch {
      return 'cycle';
    }
  });

  // Language update karne ke sath localStorage me save karna
  const handleSetLang = useCallback((newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('kamakhya_lang', newLang);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Discreet switch toggle karna aur HTML body par sidha blur class lagana
  const setDiscreet = useCallback((val) => {
    setDiscreetState((prev) => {
      const next = typeof val === 'boolean' ? val : !prev;
      try {
        localStorage.setItem('kamakhya:discreet', String(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  // Jaise hi discreet mode on/off ho, pooray page par blur sync ho jaye
  useEffect(() => {
    if (discreet) {
      document.documentElement.classList.add('discreet-on');
    } else {
      document.documentElement.classList.remove('discreet-on');
    }
  }, [discreet]);

  const setMode = useCallback((m) => {
    setModeState(m);
    try {
      localStorage.setItem('kamakhya:mode', m);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang],
  );

  const value = useMemo(
    () => ({
      lang,
      setLang: handleSetLang,
      t,
      discreet,
      setDiscreet,
      mask: discreet ? 'blur-[7px] select-none transition-all' : '',
      ritviOpen,
      openRitvi: () => setRitviOpen(true),
      closeRitvi: () => setRitviOpen(false),
      mode,
      setMode,
    }),
    [lang, handleSetLang, t, discreet, setDiscreet, ritviOpen, mode, setMode],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}