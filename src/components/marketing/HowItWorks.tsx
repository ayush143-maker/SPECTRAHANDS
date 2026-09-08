import { ClayCard, Sticker } from '@/components/ui/clay';

const STEPS = [
  { n: '01', t: 'CAPTURE', d: '720p webcam, mirrored, processed locally. Zero frames ever leave the device.', c: 'getUserMedia({ video: 720p })', color: 'bg-mint', tilt: -1.5 },
  { n: '02', t: 'TRACK', d: 'MediaPipe HandLandmarker (GPU) extracts 21 3D landmarks per hand at 60fps.', c: 'detectForVideo(frame, t)', color: 'bg-sky', tilt: 1 },
  { n: '03', t: 'MAP', d: 'Palm-to-palm distance is normalized and damped into the visible spectrum.', c: 'λ = 380 + norm(d) · 320', color: 'bg-butter', tilt: -1 },
  { n: '04', t: 'IGNITE', d: 'Photons, shockwaves and beams render additively. Touch palms → white supernova.', c: 'Σ(visible λ) → #ffffff', color: 'bg-peach', tilt: 1.5 },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>pipeline</Kicker>
      <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-5xl">
        Four stages, zero servers.
      </h2>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <ClayCard key={s.n} tilt={s.tilt} className={`p-6 sm:p-8 ${i % 2 ? 'sm:translate-y-6' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <span className="text-outline font-display text-6xl font-black leading-none">{s.n}</span>
              <Sticker color={s.color}>{s.t}</Sticker>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">{s.d}</p>
            <code className="mt-6 block w-max max-w-full overflow-x-auto rounded-xl border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] text-mint shadow-sticker">
              {s.c}
            </code>
          </ClayCard>
        ))}
      </div>
    </section>
  );
}

export const Kicker = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-lavender">{'// '}{children}</span>
);
