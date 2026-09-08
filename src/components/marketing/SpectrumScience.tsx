'use client';
import { useState } from 'react';
import { wavelengthToRgb, css, bandName, SPECTRUM_CSS } from '@/lib/color/wavelength';
import { ClayCard, Sticker } from '@/components/ui/clay';
import { Kicker } from './HowItWorks';

export function SpectrumScience() {
  const [nm, setNm] = useState(532);
  const rgb = wavelengthToRgb(nm);
  const thz = (299792458 / (nm * 1e-9) / 1e12).toFixed(0);
  const ev = (1240 / nm).toFixed(2);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Kicker>physics</Kicker>
      <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-5xl">
        Distance is wavelength. Touch is white.
      </h2>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ClayCard tilt={-0.5} className="p-6 sm:p-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div
                className="font-mono text-6xl font-black tracking-tight"
                style={{ color: css(rgb), textShadow: `0 0 40px ${css(rgb, 0.7)}` }}
              >
                {nm}<span className="text-2xl">nm</span>
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                {bandName(nm)} · {thz} THz · {ev} eV
              </div>
            </div>
            {/* living clay blob swatch */}
            <div
              className="h-24 w-24 shrink-0 animate-blob border border-white/10"
              style={{
                background: css(rgb),
                boxShadow: `0 0 60px ${css(rgb, 0.8)}, inset 0 8px 16px rgba(255,255,255,0.35), inset 0 -12px 20px rgba(0,0,0,0.3)`,
              }}
            />
          </div>

          <div className="relative mt-9 h-4 rounded-full shadow-clay-sm" style={{ background: SPECTRUM_CSS }}>
            <div
              className="absolute top-1/2 h-7 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_#fff]"
              style={{ left: `${((nm - 380) / 320) * 100}%` }}
            />
          </div>
          <input
            type="range" min={380} max={700} value={nm}
            onChange={(e) => setNm(Number(e.target.value))}
            className="mt-5 w-full accent-lavender"
            aria-label="Wavelength in nanometers"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-zinc-500">
            <span>380 violet</span><span>700 red</span>
          </div>
        </ClayCard>

        <div className="grid content-start gap-6">
          <ClayCard tilt={1.5} className="p-6">
            <Sticker color="bg-lavender">DIST → λ</Sticker>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Your palms are a dimmer switch for the electromagnetic spectrum. Spread them wide and
              light stretches to 700nm red. Collapse them and it compresses to 380nm violet.
            </p>
          </ClayCard>
          <ClayCard tilt={-1.5} className="p-6">
            <Sticker color="bg-peach">Σλ → WHITE</Sticker>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Bring both hands together and every wavelength fires at once. Additive color mixing
              does the rest: the screen detonates into pure white light.
            </p>
          </ClayCard>
        </div>
      </div>
    </section>
  );
}
