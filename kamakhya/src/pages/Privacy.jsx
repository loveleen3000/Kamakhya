
import React, { useState } from 'react';
import { Download, Lock, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/lib/AppContext';
import { clearAllData, exportAllData, loadUserName, saveUserName } from '@/lib/userStore';
import { clearPregnancyData } from '@/lib/pregnancyStore';

const STR = {
  en: {
    eyebrow: 'Privacy & your data',
    title: 'Private by design',
    intro:
      'Kamakhya has no accounts and no sign-up. Everything you write stays on this device — nothing is uploaded, shared or sold.',
    points: [
      'No account, no email, no login — open the app and it simply works.',
      'Cycle, pregnancy, journal and check-in data live only in this device’s local storage.',
      'No servers, no analytics on your health entries, no ads following you.',
      'Kamakhya educates and supports — it never diagnoses or replaces your doctor.',
    ],
    nameTitle: 'Your name (optional)',
    nameIntro: 'Only to greet you. It is saved on this device and used nowhere else.',
    namePlaceholder: 'The name you’d love to be greeted by',
    nameSave: 'Save name',
    nameSaved: 'Name saved',
    nameSavedDesc: 'Kept privately on this device.',
    dataTitle: 'Control your data',
    dataIntro: 'Export everything as a file you own, or remove it from this device forever — your choice, always.',
    exportBtn: 'Export my data',
    exportDone: 'Data exported',
    exportDoneDesc: 'A JSON file was downloaded — open it or keep it safe.',
    clearPregBtn: 'Delete pregnancy data',
    clearPregDesc: 'Profile, appointments, journal entries and birth-prep lists.',
    clearAllBtn: 'Delete everything',
    clearAllDesc: 'Your name, cycle settings, pregnancy data — all of it.',
    confirmTitle: 'Delete this data?',
    confirmAll: 'Everything Kamakhya saved on this device will be permanently removed. This cannot be undone.',
    keep: 'Keep my data',
    confirm: 'Delete it all',
    deleted: 'Data deleted',
    deletedDesc: 'Removed from this device.',
    footer:
      'If a health question worries you, please speak with a healthcare professional — Kamakhya is educational, not medical advice.',
  },
  hi: {
    eyebrow: 'प्राइवेसी और आपका डेटा',
    title: 'शुरुआत से ही प्राइवेट',
    intro:
      'कामाख्या में कोई अकाउंट या साइन-अप नहीं है। जो भी आप लिखेंगी वह इसी डिवाइस पर रहता है — कहीं अपलोड, साझा या बेचा नहीं जाता।',
    points: [
      'कोई अकाउंट नहीं, कोई ईमेल नहीं, कोई लॉगिन नहीं — ऐप खोलिए, वह बस चलने लगता है।',
      'साइकिल, प्रेग्नेंसी, जर्नल और चेक-इन का डेटा सिर्फ़ इसी डिवाइस की लोकल स्टोरेज में रहता है।',
      'कोई सर्वर नहीं, आपकी हेल्थ एंट्री पर कोई एनालिटिक्स नहीं, कोई ऐड फ़ॉलो नहीं करता।',
      'कामाख्या समझाता और साथ देता है — वह कभी जाँच नहीं करता और डॉक्टर की जगह नहीं लेता।',
    ],
    nameTitle: 'आपका नाम (वैकल्पिक)',
    nameIntro: 'सिर्फ़ स्वागत के लिए। यह इसी डिवाइस पर सेव होता है और कहीं और इस्तेमाल नहीं होता।',
    namePlaceholder: 'जिस नाम से आपको स्वागत अच्छा लगे',
    nameSave: 'नाम सेव करें',
    nameSaved: 'नाम सेव हो गया',
    nameSavedDesc: 'इसी डिवाइस पर, प्राइवेट रूप से रखा गया।',
    dataTitle: 'अपने डेटा पर आपका कंट्रोल',
    dataIntro: 'सब कुछ एक फ़ाइल में एक्सपोर्ट करें, या इस डिवाइस से हमेशा के लिए हटा दें — फ़ैसला हमेशा आपका।',
    exportBtn: 'मेरा डेटा एक्सपोर्ट करें',
    exportDone: 'डेटा एक्सपोर्ट हो गया',
    exportDoneDesc: 'एक JSON फ़ाइल डाउनलोड हुई — खोलें या सुरक्षित रखें।',
    clearPregBtn: 'प्रेग्नेंसी डेटा हटाएँ',
    clearPregDesc: 'प्रोफ़ाइल, अपॉइंटमेंट, जर्नल एंट्री और बर्थ-प्रेप लिस्ट।',
    clearAllBtn: 'सब कुछ हटाएँ',
    clearAllDesc: 'आपका नाम, साइकिल सेटिंग्स, प्रेग्नेंसी डेटा — सब कुछ।',
    confirmTitle: 'यह डेटा हटाएँ?',
    confirmAll: 'इस डिवाइस पर कामाख्या की सेव की हर चीज़ हमेशा के लिए हट जाएगी। यह वापस नहीं होगा।',
    keep: 'मेरा डेटा रहने दें',
    confirm: 'सब हटा दें',
    deleted: 'डेटा हटा दिया गया',
    deletedDesc: 'इस डिवाइस से हटा दिया गया।',
    footer:
      'कोई भी हेल्थ की बात चिंता दे तो कृपया डॉक्टर से बात करें — कामाख्या शैक्षिक है, डॉक्टरी सलाह नहीं।',
  },
};

export default function Privacy() {
  const { toast } = useToast();
  const { lang } = useApp();
  const s = STR[lang] || STR.en;
  const [name, setName] = useState(loadUserName());

  const saveName = () => {
    saveUserName(name.trim());
    toast({ title: s.nameSaved, description: s.nameSavedDesc });
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(exportAllData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kamakhya-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: s.exportDone, description: s.exportDoneDesc });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{s.eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{s.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-plum/60">{s.intro}</p>

      <div className="mt-8 rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
        <p className="flex items-center gap-2 font-heading text-lg text-plum">
          <Lock className="h-4 w-4 text-lotus" /> {s.eyebrow}
        </p>
        <ul className="mt-4 space-y-2.5">
          {s.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-[13px] leading-relaxed text-plum/70">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lotus" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
        <p className="flex items-center gap-2 font-heading text-lg text-plum">
          <UserRound className="h-4 w-4 text-lotus" /> {s.nameTitle}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-plum/55">{s.nameIntro}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={s.namePlaceholder}
            aria-label={s.nameTitle}
            className="rounded-2xl bg-white/80"
          />
          <Button
            onClick={saveName}
            disabled={!name.trim()}
            className="press shrink-0 rounded-full brand-gradient px-6 shadow-glow-soft hover:opacity-95 disabled:opacity-40"
          >
            {s.nameSave}
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
        <p className="flex items-center gap-2 font-heading text-lg text-plum">
          <Download className="h-4 w-4 text-lotus" /> {s.dataTitle}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-plum/55">{s.dataIntro}</p>

        <Button
          variant="outline"
          onClick={download}
          className="press mt-4 rounded-full border-plum/15 bg-white/70 shadow-soft hover:border-lotus/50 hover:text-berry"
        >
          <Download className="h-4 w-4" /> {s.exportBtn}
        </Button>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              clearPregnancyData();
              toast({ title: s.deleted, description: s.deletedDesc });
            }}
            className="press h-auto flex-col items-start gap-1 rounded-2xl border-berry/25 bg-white/70 px-4 py-3.5 text-left shadow-soft hover:bg-white"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-berry">
              <Trash2 className="h-4 w-4" /> {s.clearPregBtn}
            </span>
            <span className="text-[11px] font-medium leading-snug text-plum/50">{s.clearPregDesc}</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="press h-auto flex-col items-start gap-1 rounded-2xl border-berry/25 bg-white/70 px-4 py-3.5 text-left shadow-soft hover:bg-white"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-berry">
                  <Trash2 className="h-4 w-4" /> {s.clearAllBtn}
                </span>
                <span className="text-[11px] font-medium leading-snug text-plum/50">{s.clearAllDesc}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[1.6rem] border-white/70">
              <AlertDialogHeader>
                <AlertDialogTitle>{s.confirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>{s.confirmAll}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">{s.keep}</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full bg-berry text-blush hover:bg-plum"
                  onClick={() => {
                    clearAllData();
                    window.location.reload();
                  }}
                >
                  {s.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-plum/40">{s.footer}</p>
    </div>
  );
}