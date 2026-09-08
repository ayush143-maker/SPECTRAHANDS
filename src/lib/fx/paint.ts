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

/** Thin dense skeleton: single pass + subtle glow, optimized for 60fps. */
export function drawSkeleton(ctx: CanvasRenderingContext2D, pts: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  
  // subtle glow pass
  ctx.shadowColor = css(color, 0.6);
  ctx.shadowBlur = 8;
  ctx.strokeStyle = css(color, 0.9);
  ctx.lineWidth = 1.8;
  
  for (const [a, b] of HAND_CONNECTIONS) {
    const p = px(pts[a], w, h), q = px(pts[b], w, h);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
  
  // fingertip highlights (thin white dots)
  ctx.shadowBlur = 4;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const idx of [4, 8, 12, 16, 20]) {
    const p = px(pts[idx], w, h);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Beams: thin lines + subtle membrane, no dashes. */
export function drawBeams(ctx: CanvasRenderingContext2D, a: Pt[], b: Pt[], color: RGB, w: number, h: number) {
  ctx.save();
  ctx.lineCap = 'round';
  
  // thin translucent membrane
  ctx.fillStyle = css(color, 0.08);
  ctx.beginPath();
  const seq = [...BEAM_POINTS, ...[...BEAM_POINTS].reverse()];
  seq.forEach((idx, i) => {
    const src = i < BEAM_POINTS.length ? a : b;
    const j = i < BEAM_POINTS.length ? idx : seq[i];
    const p = px(src[j], w, h);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fill();
  
  // thin glowing beams
  ctx.shadowColor = css(color, 0.7);
  ctx.shadowBlur = 12;
  ctx.strokeStyle = css(color, 0.85);
  ctx.lineWidth = 1.5;
  
  for (const idx of BEAM_POINTS) {
    const p = px(a[idx], w, h), q = px(b[idx], w, h);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Wavelength chip: compact + subtle glow. */
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
