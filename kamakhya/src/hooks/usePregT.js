import { useApp } from '@/lib/AppContext';
import { PREG } from '@/data/pregnancyI18n';

export default function usePregT() {
  const { lang } = useApp();
  return (key) => PREG[lang]?.[key] ?? PREG.en[key] ?? key;
}