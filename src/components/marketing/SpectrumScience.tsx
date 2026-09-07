// src/components/marketing/SpectrumScience.tsx
'use client';
import { useState } from 'react';
import { wavelengthToRgb, css, bandName, SPECTRUM_CSS } from '@/lib/color/wavelength';
import { Kicker } from './HowItWorks';

export function SpectrumScience() {
  const [nm, setNm] = useState(532);
  const rgb = wavelengthToRgb(nm);
  const thz = (299792458 / (nm * 1e-9) / 1e12).toFixed(0);
  const ev = (1240 / nm).toFixed(2);
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>physics</Kicker>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Distance is wavelength. Touch is white.</h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-5xl font-black" style={{ color: css(rgb), textShadow: `0 0 32px ${css(rgb, 0.8)}` }}>
                {nm}<span className="text-2xl">nm</span>
              </div>
              <div className="mt-1 font-mono text-xs uppercase tracking-widest text-zinc-400">{bandName(nm)} · {thz} THz · {ev} eV</div>
            </div>
            <div className="h-16 w-16 rounded-xl border border-white/20" style={{ background: css(rgb), boxShadow: `0 0 40px ${css(rgb, 0.9)}` }} />
          </div>
          <div className="relative mt-6 h-3 rounded-full" style={{ background: SPECTRUM_CSS }}>
            <div className="absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded bg-white shadow-[0_0_10px_#fff]" style={{ left: `${((nm - 380) / 320) * 100}%` }} />
          </div>
          <input
            type="range" min={380} max={700} value={nm}
            onChange={(e) => setNm(Number(e.target.value))}
            className="mt-4 w-full accent-white"
            aria-label="Wavelength in nanometers"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500"><span>380 violet</span><span>700 red</span></div>
        </div>
        <div className="grid gap-4">
          <Fact title="DIST → λ" body="Your palms are a dimmer switch for the electromagnetic spectrum. Spread them wide and light stretches to 700nm red. Collapse them and it compresses to 380nm violet." />
          <Fact title="Σλ → WHITE" body="Bring both hands together and every wavelength fires at once. Additive color mixing does the rest: the screen detonates into pure white light." />
        </div>
      </div>
    </section>
  );
}

const Fact = ({ title, body }: { title: string; body: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
    <div className="font-mono text-sm font-bold text-fuchsia-400">{title}</div>
    <p className="mt-2 text-sm text-zinc-400">{body}</p>
  </div>
);
