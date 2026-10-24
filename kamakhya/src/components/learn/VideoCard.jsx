import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Clock, Eye, Play } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function VideoCard({ video, onPlay, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-[2rem] glass p-3 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="relative overflow-hidden rounded-[1.6rem]">
        <Image
          src={video.image}
          alt={video.title}
          className="aspect-video w-full transition-transform duration-700 group-hover:scale-[1.04]"
          fittingType="fill"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/55 via-plum/5 to-transparent" />

        <span className="absolute left-3.5 top-3.5 rounded-full bg-blush/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-berry backdrop-blur-md">
          {video.category}
        </span>

        <span className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-plum/80 px-2.5 py-1.5 text-[10px] font-bold text-blush backdrop-blur-md">
          <Clock className="h-3 w-3" /> {video.duration}
        </span>

        <button
          type="button"
          onClick={() => onPlay(video)}
          aria-label={`Play ${video.title}`}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white/85 shadow-lift backdrop-blur-md transition duration-300 group-hover:scale-110">
            <span className="absolute inset-0 rounded-full border border-white/80 animate-aura" />
            <Play className="relative h-6 w-6 fill-berry text-berry" />
          </span>
        </button>
      </div>

      <div className="px-3 pb-3 pt-5">
        <h3 className="font-heading text-xl leading-snug text-plum">{video.title}</h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-plum/55">
            {video.verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
            {video.author}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-plum/40">
            <Eye className="h-3.5 w-3.5" /> {video.views}
          </span>
        </div>
      </div>
    </motion.article>
  );
}