import React from 'react';
import Hero from '@/components/home/Hero';
import QuickStats from '@/components/home/QuickStats';
import PhaseStrip from '@/components/home/PhaseStrip';
import Features from '@/components/home/Features';
import RitviBand from '@/components/home/RitviBand';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <div className="relative pb-4">
      <Hero />
      <QuickStats />
      <PhaseStrip />
      <Features />
      <RitviBand />
      <Testimonials />
    </div>
  );
}