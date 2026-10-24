import React from 'react';
import { Image } from '@/components/ui/image';
import { IMAGES } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

export default function RitviAvatar({ size = 48, aura = false, status = null, className }) {
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      {aura && (
        <>
          <span className="absolute inset-0 rounded-full border border-lotus/50 animate-aura" />
          <span
            className="absolute inset-0 rounded-full border border-lavender/70 animate-aura"
            style={{ animationDelay: '1.4s' }}
          />
        </>
      )}
      <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-lotus to-berry p-[2px] shadow-glow-soft">
        <Image src={IMAGES.ritvi} alt="Ritvi, your Kamakhya companion" className="h-full w-full rounded-full" />
      </div>
      {status && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
      )}
    </div>
  );
}