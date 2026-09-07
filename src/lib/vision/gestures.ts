// src/lib/vision/gestures.ts
import type { Pt, HandMetrics, Gesture } from './types';
import { FINGER_TIPS } from './connections';

const d = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function centroid(pts: Pt[]): Pt {
  let x = 0, y = 0;
  for (const p of pts) { x += p.x; y += p.y; }
  return { x: x / pts.length, y: y / pts.length };
}

/** Scale-invariant hand state: spread, pinch, gesture class. */
export function handMetrics(pts: Pt[]): HandMetrics {
  const wrist = pts[0], mid = pts[9];
  const scale = d(wrist, mid) || 1e-6;
  const spread = FINGER_TIPS.reduce((s, t) => s + d(pts[t], wrist), 0) / FINGER_TIPS.length / scale;
  const pinch = d(pts[4], pts[8]) / scale;
  const curl = [8, 12, 16, 20].reduce((s, t) => s + d(pts[t], wrist), 0) / 4 / scale;
  const gesture: Gesture = pinch < 0.55 ? 'PINCH!' : curl < 1.05 ? 'Fist' : spread > 1.85 ? 'Open Hand' : 'Calm';
  const spreadPct = Math.round(clamp01((spread - 1.15) / (2.5 - 1.15)) * 100);
  return { pts, centroid: centroid(pts), scale, spread, pinch, gesture, spreadPct };
}

/** Aspect-corrected distance in normalized space (x weighted by frame aspect). */
export const aspectDist = (a: Pt, b: Pt, aspect: number) =>
  Math.hypot((a.x - b.x) * aspect, a.y - b.y);
