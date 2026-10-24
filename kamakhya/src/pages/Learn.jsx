import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const LESSONS = [
  {
    id: "pcos-hormones",
    tag: "PCOS & HORMONES",
    duration: "14:20",
    title: "PCOS & Hormones: What Your Bloodwork Really Says",
    author: "Dr. Ananya Rao, Gynaecologist",
    views: "128k views",
    videoUrl: "/videos/ai-1.mp4"
  },
  {
    id: "cramp-relief",
    tag: "PERIOD PAIN HACKS",
    duration: "8:45",
    title: "5 Cramp Relief Hacks That Actually Work",
    author: "Dr. Meera Iyer, Physiotherapist",
    views: "96k views",
    videoUrl: "/videos/ai-4.mp4"
  },
  {
    id: "first-period",
    tag: "FIRST PERIOD GUIDE",
    duration: "11:02",
    title: "Your First Period: A Gentle Guide for Her & You",
    author: "Kamakhya Care Team",
    views: "54k views",
    videoUrl: "/videos/ai-6.mp4"
  },
  {
    id: "sustainable-care",
    tag: "SUSTAINABLE CARE (CUPS & CLOTH)",
    duration: "9:36",
    title: "Sustainable Care: Cups & Cloth Options",
    author: "Kamakhya Care Team",
    views: "42k views",
    videoUrl: "/videos/ai-5.mp4"
  },
  {
    id: "period-myths-science",
    tag: "MYTHS & FACTS",
    duration: "7:28",
    title: "Period Myths vs Science: What Really Happens",
    author: "Kamakhya Care Team",
    views: "92k views",
    videoUrl: "/videos/ai-3.mp4"
  },
  {
    id: "hormone-balance",
    tag: "PCOS & HORMONES",
    duration: "12:10",
    title: "Understanding Hormonal Rhythms",
    author: "Dr. Ananya Rao, Gynaecologist",
    views: "68k views",
    videoUrl: "/videos/ai-2.mp4"
  }
];

export default function Learn() {
  const [currentVideo, setCurrentVideo] = useState(null);

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3A1D28]">All lessons</h1>
          <p className="text-sm text-gray-500 mt-1">AI-guided care & menstrual wellness videos</p>
        </div>
        <span className="text-xs font-semibold text-gray-400">6 lessons</span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson) => (
          <div key={lesson.id} className="rounded-3xl bg-white border border-rose-100 p-5 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="relative aspect-video rounded-2xl bg-rose-50 flex items-center justify-center overflow-hidden group">
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-rose-600">
                {lesson.tag}
              </span>
              <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                {lesson.duration}
              </span>

              {/* Play Button */}
              <button
                type="button"
                onClick={() => setCurrentVideo(lesson.videoUrl)}
                className="grid h-14 w-14 place-items-center rounded-full bg-white text-rose-600 shadow-lg transition transform group-hover:scale-110 active:scale-95"
              >
                <Play className="h-6 w-6 fill-current ml-0.5" />
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-[#3A1D28] text-base leading-snug">{lesson.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                <span>{lesson.author}</span>
                <span>{lesson.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Popup Modal */}
      {currentVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setCurrentVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCurrentVideo(null)}
              className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <X className="h-5 w-5" />
            </button>

            <video
              src={currentVideo}
              controls
              autoPlay
              className="w-full h-auto aspect-video rounded-3xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}