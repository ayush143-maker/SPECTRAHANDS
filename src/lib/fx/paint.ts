// src/lib/fx/paint.ts
import type { Pt } from '@/lib/vision/types';
import type { RGB } from '@/lib/color/wavelength';
import { css } from '@/lib/color/wavelength';
import { HAND_CONNECTIONS, BEAM_POINTS } from '@/lib/vision/connections';

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

export function drawSkeleton(ctx: CanvasRenderingContext2D, pts: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  ctx.shadowColor = css(color, 0.9);
  ctx.shadowBlur = 14;
  ctx.strokeStyle = css(color, 0.95);
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  for (const [a, b] of HAND_CONNECTIONS) {
    const p = px(pts[a], w, h), q = px(pts[b], w, h);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  for (const p of pts) {
    const q = px(p, w, h);
    ctx.beginPath(); ctx.arc(q.x, q.y, 2.1, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function drawBeams(ctx: CanvasRenderingContext2D, a: Pt[], b: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  // translucent photon membrane between the palms
  ctx.fillStyle = css(color, 0.09);
  ctx.beginPath();
  const seq = [...BEAM_POINTS, ...[...BEAM_POINTS].reverse()];
  seq.forEach((idx, i) => {
    const src = i < BEAM_POINTS.length ? a : b;
    const j = i < BEAM_POINTS.length ? idx : seq[i];
    const p = px(src[j], w, h);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.closePath(); ctx.fill();
  // glowing beams fingertip ↔ fingertip
  ctx.shadowColor = css(color, 1);
  ctx.shadowBlur = 18;
  ctx.strokeStyle = css(color, 0.95);
  ctx.lineWidth = 3;
  for (const idx of BEAM_POINTS) {
    const p = px(a[idx], w, h), q = px(b[idx], w, h);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  ctx.restore();
}

export function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number, nm: number, color: RGB) {
  ctx.save();
  ctx.shadowColor = css(color, 1);
  ctx.shadowBlur = 26;
  ctx.fillStyle = css(color, 0.94);
  roundRect(ctx, x - 46, y - 18, 92, 36, 10);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.font = '700 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${nm}nm`, x, y + 1);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '600 7px ui-monospace, Menlo, monospace';
  ctx.fillText('DIST → λ', x, y + 12);
  ctx.restore();
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
