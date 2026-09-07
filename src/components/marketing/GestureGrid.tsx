// src/components/marketing/GestureGrid.tsx
import { Kicker } from './HowItWorks';

const GESTURES = [
  { g: 'OPEN HAND', e: 'Photon wind', d: 'Spread fingers to blast particles away from your palm like solar wind.' , color: 'text-emerald-400' },
  { g: 'FIST', e: 'Gravity well', d: 'Clench and nearby photons spiral into your grip in real time.', color: 'text-amber-400' },
  { g: 'PINCH!', e: 'White-light supernova', d: 'Touch both hands together — every wavelength combines into one white detonation + shockwave.', color: 'text-fuchsia-400' },
];

export function GestureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>gestures</Kicker>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your vocabulary of light.</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {GESTURES.map((x) => (
          <div key={x.g} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 transition hover:-translate-y-1 hover:shadow-neon">
            <div className={`font-mono text-lg font-black ${x.color}`}>{x.g}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-zinc-500">{x.e}</div>
            <p className="mt-3 text-sm text-zinc-400">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
