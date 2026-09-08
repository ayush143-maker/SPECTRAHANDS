import { HandSpectrumStage } from '@/components/stage/HandSpectrumStage';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { SpectrumScience } from '@/components/marketing/SpectrumScience';
import { GestureGrid } from '@/components/marketing/GestureGrid';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { ClayButton, Sticker } from '@/components/ui/clay';

const STATS = ['21 landmarks / hand', '60 FPS', '380–700 nm', '0 bytes uploaded', '6 themes'];

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="grain relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-lavender/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-peach/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-up">
              <Sticker color="bg-mint" className="-rotate-2">mediapipe × next.js — 100% in-browser</Sticker>
              <h1 className="mt-6 font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
                Your hands are<br />
                <span className="bg-gradient-to-r from-lavender via-sky to-peach bg-clip-text text-transparent">
                  the visible spectrum.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                Spread your palms to stretch light from violet to red. Touch them, and every
                wavelength collapses into one white supernova. No server. No install. Just photons and palms.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ClayButton href="#lab">Enter the lab ↓</ClayButton>
                <ClayButton href="#physics" tone="ghost">Read the physics</ClayButton>
              </div>
            </div>

            {/* right rail: giant outline lambda + floating stickers */}
            <div className="relative hidden select-none lg:block">
              <div className="text-outline font-display text-[13rem] font-black leading-none">λ</div>
              <Sticker color="bg-peach" className="absolute right-6 top-8 rotate-6">380–700 nm</Sticker>
              <Sticker color="bg-butter" className="absolute right-28 top-44 -rotate-3">60 fps</Sticker>
              <Sticker color="bg-sky" className="absolute bottom-10 right-10 rotate-2">0 bytes uploaded</Sticker>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2 font-mono text-[11px]">
            {STATS.map((s) => (
              <span key={s} className="clay-sm px-3 py-1 text-zinc-400">{s}</span>
            ))}
          </div>

          {/* stage with overlapping stickers */}
          <div className="relative mt-14 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <Sticker color="bg-lavender" className="absolute -top-3 left-8 z-10 -rotate-3">live demo — no install</Sticker>
            <Sticker color="bg-mint" className="absolute -bottom-3 right-10 z-10 rotate-2">touch palms = supernova</Sticker>
            <HandSpectrumStage />
          </div>
        </div>
      </section>

      <SpectrumMarquee />

      <HowItWorks />
      <div id="physics"><SpectrumScience /></div>
      <GestureGrid />
      <SiteFooter />
    </main>
  );
}

function SpectrumMarquee() {
  const items = ['380 VIOLET', '450 BLUE', '500 CYAN', '532 GREEN', '580 YELLOW', '620 ORANGE', '700 RED', 'Σλ = WHITE LIGHT'];
  const row = (
    <div className="flex">
      {items.map((x, i) => (
        <span key={i} className="mx-6 inline-flex items-center gap-6">
          <span>{x}</span>
          <span className="text-lavender">•</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-white/5 bg-clay-deep py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-xs tracking-[0.25em] text-zinc-500">
        {row}
        <div aria-hidden>{row}</div>
      </div>
    </div>
  );
}
