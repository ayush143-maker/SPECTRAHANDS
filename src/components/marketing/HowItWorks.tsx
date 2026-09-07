// src/components/marketing/HowItWorks.tsx
const STEPS = [
  { n: '01', t: 'CAPTURE', d: '720p webcam, mirrored, processed locally. Zero frames ever leave the device.', c: 'navigator.mediaDevices.getUserMedia({ video: 720p })' },
  { n: '02', t: 'TRACK', d: 'MediaPipe HandLandmarker (GPU) extracts 21 3D landmarks per hand at 60fps.', c: 'landmarker.detectForVideo(frame, t) // 21 pts × 2 hands' },
  { n: '03', t: 'MAP', d: 'Palm-to-palm distance is normalized and damped into the visible spectrum.', c: 'λ = 380 + clamp(norm(d)) · 320  // nm' },
  { n: '04', t: 'IGNITE', d: 'Photons, shockwaves and beams render additively. Touch palms → white supernova.', c: 'Σ(visible λ) → #ffffff' },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>pipeline</Kicker>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Four stages, zero servers.</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div key={s.n} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-fuchsia-400/40 hover:bg-white/[0.06]">
            <div className="font-mono text-[11px] text-fuchsia-400">{s.n}</div>
            <div className="mt-1 font-mono text-sm font-bold tracking-widest">{s.t}</div>
            <p className="mt-2 text-sm text-zinc-400">{s.d}</p>
            <code className="mt-4 block overflow-x-auto whitespace-nowrap rounded-lg bg-black/50 p-2 font-mono text-[10px] text-cyan-300">{s.c}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Kicker = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-400">// {children}</span>
);
