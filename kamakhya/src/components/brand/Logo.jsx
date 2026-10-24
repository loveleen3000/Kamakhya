import React from 'react';
import { Image } from '@/components/ui/image';
import { IMAGES } from '@/data/kamakhya';
import { cn } from '@/lib/utils';

export default function Logo({ size = 44, withWordmark = false, className }) {
  const emblem = (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full bg-[#FCEFEF] ring-1 ring-lotus/25 shadow-soft',
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={IMAGES.logo}
        alt="Kamakhya emblem"
        className="h-full w-full"
        fittingType="fill"
        focalPointX={0.5}
        focalPointY={0.3}
      />
    </span>
  );

  if (withWordmark) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {emblem}
        <div className="leading-none">
          <p className="whitespace-nowrap font-display text-xl tracking-tight text-plum">Kamakhya</p>
          <p className="mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.26em] text-plum/45">
            Your Cycle • Your Power
          </p>
        </div>
      </div>
    );
  }

  return emblem;
}