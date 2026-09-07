// src/lib/vision/syntheticHands.ts
import type { Pt } from './types';

/** Demo mode: two procedural hands sweeping the spectrum — no camera required. */
export function syntheticHands(t: number): Pt[][] {
  const sweep = 0.5 + 0.5 * Math.sin(t * 0.32);
  const dist = 0.055 + 0.66 * sweep;               // dips below merge threshold periodically
  const cy = 0.48 + 0.05 * Math.sin(t * 0.5);
  const mk = (cx: number, side: 1 | -1, phase: number): Pt[] => {
    const open = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9 + phase));
    const s = 0.085;
    const pts: Pt[] = [{ x: cx, y: cy + s * 1.15 }];                       // 0 wrist
    const th = [                                                            // 1-4 thumb
      [0.45, 0.55], [0.85, 0.15], [1.15, -0.15], [1.3 + 0.35 * open, -0.45 - 0.45 * open],
    ];
    for (const [dx, dy] of th) pts.push({ x: cx + side * s * dx, y: cy + s * dy });
    for (let f = 0; f < 4; f++) {                                           // 5-20 fingers
      const a = ((f - 1.5) * 14 * side + 4 * Math.sin(t * 3 + f)) * Math.PI / 180;
      const bx = cx + side * (f - 1.5) * s * 0.55, by = cy - s * 0.35;
      const len = s * (0.4 + 1.25 * open);
      const dir = { x: Math.sin(a), y: -Math.cos(a) };
      for (const k of [0.45, 0.72, 1]) pts.push({ x: bx + dir.x * len * k, y: by + dir.y * len * k });
    }
    return pts;
  };
  return [
    mk(0.5 - dist / 2, 1, 0),
    mk(0.5 + dist / 2, -1, 1.7),
  ];
}
