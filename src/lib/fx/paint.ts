import type { Pt } from '@/lib/vision/types';
import type { RGB } from '@/lib/color/wavelength';
import { css } from '@/lib/color/wavelength';
import { HAND_CONNECTIONS, BEAM_POINTS } from '@/lib/vision/connections';

const TAU = Math.PI * 2;
const px = (p: Pt, w: number, h: number) => ({ x: p.x * w, y: p.y * h });

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Thin dense vibrant skeleton — single batched stroke (fast) + subtle glow. */
export function drawSkeleton(ctx: CanvasRenderingContext2D, pts: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = css(color, 0.8);
  ctx.shadowBlur = 10;
  ctx.strokeStyle = css(color, 0.95);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (const [a, b] of HAND_CONNECTIONS) {
    const p = px(pts[a], w, h), q = px(pts[b], w, h);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();
  // small white joint dots
  ctx.shadowBlur = 6;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  for (const p of pts) {
    const q = px(p, w, h);
    ctx.moveTo(q.x + 1.6, q.y);
    ctx.arc(q.x, q.y, 1.6, 0, TAU);
  }
  ctx.fill();
  ctx.restore();
}

/** Thin beams between hands + faint photon membrane. */
export function drawBeams(ctx: CanvasRenderingContext2D, a: Pt[], b: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  // membrane
  ctx.fillStyle = css(color, 0.07);
  ctx.beginPath();
  const fwd = BEAM_POINTS.map((i) => px(a[i], w, h));
  const bwd = BEAM_POINTS.map((i) => px(b[i], w, h)).reverse();
  ctx.moveTo(fwd[0].x, fwd[0].y);
  for (const p of fwd) ctx.lineTo(p.x, p.y);
  for (const p of bwd) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  ctx.fill();
  // beams — one batched stroke
  ctx.shadowColor = css(color, 0.9);
  ctx.shadowBlur = 12;
  ctx.strokeStyle = css(color, 0.9);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (const i of BEAM_POINTS) {
    const p = px(a[i], w, h), q = px(b[i], w, h);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();
  // bright endpoint dots
  ctx.shadowBlur = 6;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  for (const i of BEAM_POINTS) {
    const p = px(a[i], w, h), q = px(b[i], w, h);
    ctx.moveTo(p.x + 2, p.y); ctx.arc(p.x, p.y, 2, 0, TAU);
    ctx.moveTo(q.x + 2, q.y); ctx.arc(q.x, q.y, 2, 0, TAU);
  }
  ctx.fill();
  ctx.restore();
}

/** Compact wavelength chip. */
export function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number, nm: number, color: RGB) {
  ctx.save();
  ctx.shadowColor = css(color, 0.8);
  ctx.shadowBlur = 16;
  ctx.fillStyle = css(color, 0.9);
  roundRect(ctx, x - 42, y - 16, 84, 32, 10);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${nm}nm`, x, y + 1);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 6px ui-monospace, Menlo, monospace';
  ctx.fillText('DIST → λ', x, y + 11);
  ctx.restore();
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
