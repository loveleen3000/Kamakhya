import React, { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { bi, CATEGORIES, DEFAULT_TASKS, tpl, txValue } from '@/data/pregnancyI18n';
import { loadTasks, makeId, saveTasks } from '@/lib/pregnancyStore';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/lib/AppContext';
import usePregT from '@/hooks/usePregT';
import { cn } from '@/lib/utils';

export default function BirthPrep() {
  const { toast } = useToast();
  const { lang } = useApp();
  const pt = usePregT();
  const [tasks, setTasks] = useState(null);
  const [tab, setTab] = useState(CATEGORIES[0].id);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let list = loadTasks();
    if (list.length === 0) {
      list = DEFAULT_TASKS.map((t) => ({
        id: makeId(),
        category: t.category,
        label: t.en,
        note: t.noteEn || '',
        done: false,
      }));
      saveTasks(list);
    }
    setTasks(list);
  }, []);

  if (tasks === null) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center text-sm font-semibold text-plum/45">{pt('loadingLists')}</div>
    );
  }

  const update = (next) => {
    saveTasks(next);
    setTasks(next);
  };

  const activeCategory = CATEGORIES.find((c) => c.id === tab);
  const items = tasks.filter((t) => t.category === tab);
  const doneCount = items.filter((t) => t.done).length;

  const add = () => {
    if (!draft.trim()) return;
    update([{ id: makeId(), category: tab, label: draft.trim(), note: '', done: false }, ...tasks]);
    setDraft('');
    toast({ title: pt('toastAdded'), description: pt('toastPrivate') });
  };

  const toggle = (id) => update(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => {
    update(tasks.filter((t) => t.id !== id));
    toast({ title: pt('toastRemoved') });
  };

  const saveEdit = () => {
    if (!editing || !editing.label.trim()) return;
    update(
      tasks.map((t) =>
        t.id === editing.id ? { ...editing, label: editing.label.trim(), note: (editing.note || '').trim() } : t,
      ),
    );
    setEditOpen(false);
    setEditing(null);
    toast({ title: pt('toastItemUpdated') });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus">{pt('pregMode')}</p>
      <h1 className="mt-2 font-display text-3xl text-plum sm:text-4xl">{pt('birthTitle')}</h1>
      <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-plum/60">{pt('birthIntro')}</p>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="glass h-auto w-full flex-wrap justify-start gap-1 rounded-[1.4rem] p-1.5">
          {CATEGORIES.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold text-plum/60 data-[state=active]:bg-plum data-[state=active]:text-blush sm:text-sm"
            >
              {bi(c, lang)}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((c) => {
          const catItems = tasks.filter((t) => t.category === c.id);
          const catDone = catItems.filter((t) => t.done).length;
          return (
            <TabsContent key={c.id} value={c.id} className="mt-5">
              <div className="rounded-[1.75rem] glass p-5 shadow-soft sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-heading text-lg text-plum">{bi(c, lang)}</p>
                  <p className="rounded-full bg-lotus-100 px-3 py-1 text-[11px] font-bold text-berry">
                    {tpl(pt('birthProgress'), { done: catDone, total: catItems.length })}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && add()}
                    placeholder={tpl(pt('birthAddPh'), { c: bi(c, lang) })}
                    aria-label={tpl(pt('birthAddPh'), { c: bi(c, lang) })}
                    className="rounded-2xl bg-white/80"
                  />
                  <Button
                    onClick={add}
                    disabled={!draft.trim()}
                    className="press shrink-0 rounded-full brand-gradient px-5 shadow-glow-soft hover:opacity-95 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" /> {pt('birthAdd')}
                  </Button>
                </div>

                <div className="mt-5 space-y-2.5">
                  {catItems.length ? (
                    catItems.map((t) => (
                      <div key={t.id} className="flex items-start gap-3 rounded-2xl bg-white/75 p-3.5 shadow-soft">
                        <button
                          type="button"
                          onClick={() => toggle(t.id)}
                          aria-pressed={t.done}
                          className={cn(
                            'press mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition',
                            t.done
                              ? 'border-transparent brand-gradient text-blush'
                              : 'border-plum/20 bg-white text-transparent hover:border-lotus/50',
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex-1">
                          <p className={cn('text-sm font-semibold', t.done ? 'text-plum/40 line-through' : 'text-plum')}>
                            {txValue(t.label, lang)}
                          </p>
                          {t.note && <p className="mt-0.5 text-xs text-plum/55">{txValue(t.note, lang)}</p>}
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing({ ...t });
                              setEditOpen(true);
                            }}
                            className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
                            aria-label={pt('editItem')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="press grid h-8 w-8 place-items-center rounded-full bg-white text-plum/50 shadow-soft hover:text-berry"
                                aria-label={pt('delItemTitle')}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[1.6rem] border-white/70">
                              <AlertDialogHeader>
                                <AlertDialogTitle>{pt('delItemTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {tpl(pt('delItemDesc'), { t: txValue(t.label, lang) })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">{pt('keep')}</AlertDialogCancel>
                                <AlertDialogAction
                                  className="rounded-full bg-berry text-blush hover:bg-plum"
                                  onClick={() => remove(t.id)}
                                >
                                  {pt('del')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-plum/55">{pt('birthEmpty')}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditing(null);
        }}
      >
        <DialogContent className="rounded-[1.75rem] border-white/70 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-plum">{pt('editItem')}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <label htmlFor="task-label" className="text-xs font-bold uppercase tracking-[0.14em] text-plum/50">
                  {pt('itemLabel')}
                </label>
                <Input
                  id="task-label"
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  className="mt-1.5 rounded-2xl"
                />
              </div>
              <div>
                <label htmlFor="task-note" className="text-xs font-bold uppercase tracking-[0.14em] text-plum/50">
                  {pt('itemDetail')}
                </label>
                <Input
                  id="task-note"
                  value={editing.note || ''}
                  onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                  className="mt-1.5 rounded-2xl"
                />
              </div>
              <Button onClick={saveEdit} className="w-full rounded-full brand-gradient py-3 shadow-glow-soft hover:opacity-95">
                {pt('saveChanges')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}