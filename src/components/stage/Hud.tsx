// src/components/stage/Hud.tsx
import type { HudState } from '@/lib/vision/types';
import { wavelengthToRgb, css, SPECTRUM_CSS } from '@/lib/color/wavelength';

const gestureColor: Record<string, string> = {
  'PINCH!': 'text-fuchsia-400',
  'Fist': 'text-amber-400',
  'Open Hand': 'text-emerald-400',
  'Calm': 'text-zinc-400',
  '—': 'text-zinc-500',
};

export function Hud({ hud }: { hud: HudState }) {
  const spec = wavelengthToRgb(hud.nm);
  return (
    <div className="pointer-events-none absolute left-3 top-3 w-56 space-y-2 rounded-xl border border-white/10 bg-black/45 p-3 font-mono text-[11px] leading-tight backdrop-blur-xl">
      <Row k="Hands Detected" v={<span className="text-emerald-400">{hud.hands}</span>} />
      <Row k="FPS" v={<span className="text-emerald-400">{hud.fps}</span>} />
      <div className="h-px bg-white/10" />
      <Row k="Gesture" v={<span className={gestureColor[hud.gesture]}>{hud.gesture}</span>} />
      <Row k="Spread" v={<span className="text-emerald-400">{hud.spreadPct}%</span>} />
      <div className="h-px bg-white/10" />
      <Row k="Wavelength" v={<span style={{ color: css(spec) }}>{hud.nm}nm</span>} />
      <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: SPECTRUM_CSS }}>
        <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_6px_#fff]" style={{ left: `${((hud.nm - 380) / 320) * 100}%` }} />
      </div>
      <Row k="Distance" v={<span className="text-emerald-400">{hud.distPct}%</span>} />
      <div className="pt-1 text-[9px] uppercase tracking-widest text-zinc-500">
        {hud.mode === 'camera' ? 'live camera · gpu landmarker' : 'demo mode · enable camera ↑'}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-400">{k}:</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
