import { ClayCard, Sticker } from '@/components/ui/clay';
import { Kicker } from './HowItWorks';

const GESTURES = [
  { g: 'OPEN HAND', e: 'photon wind', d: 'Spread fingers to blast particles away from your palm like solar wind.', color: 'bg-mint', glyph: '✋', tilt: -1.5 },
  { g: 'FIST', e: 'gravity well', d: 'Clench and nearby photons spiral into your grip in real time.', color: 'bg-butter', glyph: '✊', tilt: 1 },
  { g: 'PINCH!', e: 'white-light supernova', d: 'Touch both hands together — every wavelength combines into one white detonation + shockwave.', color: 'bg-peach', glyph: '🤏', tilt: -1 },
];

export function GestureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>gestures</Kicker>
      <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-5xl">
        Your vocabulary of light.
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {GESTURES.map((x, i) => (
          <ClayCard key={x.g} tilt={x.tilt} className={`p-6 sm:p-8 ${i === 1 ? 'md:translate-y-6' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-4xl drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]">{x.glyph}</span>
              <Sticker color={x.color}>{x.e}</Sticker>
            </div>
            <div className="mt-6 font-display text-2xl font-black tracking-tight">{x.g}</div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{x.d}</p>
          </ClayCard>
        ))}
      </div>
    </section>
  );
}
