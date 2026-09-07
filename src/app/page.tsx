// src/app/page.tsx
import { HandSpectrumStage } from '@/components/stage/HandSpectrumStage';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { SpectrumScience } from '@/components/marketing/SpectrumScience';
import { GestureGrid } from '@/components/marketing/GestureGrid';
import { SiteFooter } from '@/components/marketing/SiteFooter';

const STATS = ['21 landmarks / hand', '60 FPS', '380–700 nm', '0 bytes uploaded'];

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="grid-bg relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-up text-center">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">
              mediapipe × next.js — 100% in-browser
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              Your hands are the{' '}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-red-400 bg-clip-text text-transparent text-glow">
                visible spectrum.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Spread your palms to stretch light from violet to red. Touch them, and every wavelength
              collapses into one white supernova. No server. No install. Just photons and palms.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#lab" className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-fuchsia-200">
                Enter the lab ↓
              </a>
              <a href="#physics" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-zinc-200 transition hover:bg-white/10">
                Read the physics
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2 font-mono text-[11px] text-zinc-500">
              {STATS.map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-black/40 px-3 py-1">{s}</span>
              ))}
            </div>
          </div>

          <div className="mt-14 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <HandSpectrumStage />
          </div>
        </div>
      </section>

      <HowItWorks />
      <div id="physics"><SpectrumScience /></div>
      <GestureGrid />
      <SiteFooter />
    </main>
  );
}
