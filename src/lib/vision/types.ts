// src/lib/vision/types.ts
export type Pt = { x: number; y: number; z?: number };
export type Gesture = 'PINCH!' | 'Open Hand' | 'Fist' | 'Calm';
export type HandMetrics = {
  pts: Pt[]; centroid: Pt; scale: number;
  spread: number; pinch: number; gesture: Gesture; spreadPct: number;
};
export type HudState = {
  hands: number; fps: number; gesture: Gesture | '—';
  spreadPct: number; nm: number; distPct: number;
  merge: boolean; mode: 'demo' | 'camera'; dark: boolean;
};
