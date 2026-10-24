import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import RitviAvatar from '@/components/ritvi/RitviAvatar';

export default function RitviBand() {
  // Global event bhejna jo App.jsx ke andar sun raha hai
  const handleOpenRitvi = (promptText = '') => {
    window.dispatchEvent(
      new CustomEvent('open-ritvi-chat', {
        detail: { prompt: promptText }
      })
    );
  };

  const samplePrompts = [
    'Do I have PCOS?',
    'Why is my cycle late?',
    'Quick cramp relief',
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#2A0E1A] via-[#3A1424] to-[#240B16] p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/10">
        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-rose-300" />
              RITVI AI
            </span>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Meet Ritvi, your private companion
            </h2>

            <p className="text-sm leading-relaxed text-rose-100/75 sm:text-base max-w-lg">
              Ask the questions you would only Google at 2am. Ritvi answers from your own cycle, gently and without judgement.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-5">
              {/* Main Ask Ritvi Anything Button */}
              <button
                type="button"
                onClick={() => handleOpenRitvi()}
                className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold text-[#3A1424] shadow-lift hover:bg-rose-50 transition active:scale-95 cursor-pointer"
              >
                Ask Ritvi Anything
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <span className="flex items-center gap-1.5 text-xs font-medium text-rose-200/90">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Answers grounded in your own log
              </span>
            </div>
          </div>

          {/* Right Simulated Interactive Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-inner space-y-5">
              
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <RitviAvatar size={42} />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#2A0E1A] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ritvi</h4>
                  <p className="text-[11px] font-semibold text-emerald-300">Listening...</p>
                </div>
              </div>

              {/* Clickable Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleOpenRitvi(prompt)}
                    className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-rose-100 hover:bg-white/20 hover:border-white/30 transition active:scale-95 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Sample Response Preview */}
              <div 
                onClick={() => handleOpenRitvi()}
                className="cursor-pointer rounded-2xl bg-white/95 p-5 shadow-soft transition hover:bg-white active:scale-[0.99]"
              >
                <p className="text-xs leading-relaxed text-[#3A1D28] font-medium">
                  “In a 35–day cycle, ovulation arrives around day 26 — so a shift of ±7 days is still inside your normal rhythm.”
                </p>
                <p className="mt-3 text-[10px] text-plum/50 font-semibold tracking-wide">
                  Educational guidance only, never a diagnosis.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}