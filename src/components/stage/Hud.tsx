import type { HudState } from '@/lib/vision/types';
import { wavelengthToRgb, css, SPECTRUM_CSS } from '@/lib/color/wavelength';

const gestureColor: Record<string, string> = {
  'PINCH!': 'text-lavender',
  'Fist': 'text-butter',
  'Open Hand': 'text-mint',
  'Calm': 'text-zinc-400',
  '—': 'text-zinc-500',
};

export function Hud({ hud }: { hud: HudState }) {
  const spec = wavelengthToRgb(hud.nm);
  const handsWarn = hud.mode === 'camera' && hud.hands < 2;
  return (
    <div className="clay-sm pointer-events-none absolute left-3 top-3 w-56 space-y-2 p-3 font-mono text-[11px] leading-tight">
      <Row k="Hands Detected" v={<span className={handsWarn ? 'text-peach' : 'text-mint'}>{hud.hands}/2</span>} />
      <Row k="FPS" v={<span className="text-mint">{hud.fps}</span>} />
      <div className="h-px bg-white/5" />
      <Row k="Gesture" v={<span className={gestureColor[hud.gesture]}>{hud.gesture}</span>} />
      <Row k="Spread" v={<span className="text-mint">{hud.spreadPct}%</span>} />
      <div className="h-px bg-white/5" />
      <Row k="Wavelength" v={<span style={{ color: css(spec) }}>{hud.nm}nm</span>} />
      <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: SPECTRUM_CSS }}>
        <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_6px_#fff]" style={{ left: `${((hud.nm - 380) / 320) * 100}%` }} />
      </div>
      <Row k="Distance" v={<span className="text-mint">{hud.distPct}%</span>} />
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
