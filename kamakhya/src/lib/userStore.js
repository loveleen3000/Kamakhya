
const NAME_KEY = 'kamakhya:user:name';

export const loadUserName = () => {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
};

export const saveUserName = (name) => {
  try {
    if (name) localStorage.setItem(NAME_KEY, name);
    else localStorage.removeItem(NAME_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const exportAllData = () => {
  const dump = { app: 'Kamakhya', exportedAt: new Date().toISOString(), deviceOnly: true };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('kamakhya:')) continue;
      const raw = localStorage.getItem(key);
      try {
        dump[key] = JSON.parse(raw);
      } catch {
        dump[key] = raw;
      }
    }
  } catch {
    /* noop */
  }
  return dump;
};

export const clearAllData = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('kamakhya:')) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
};