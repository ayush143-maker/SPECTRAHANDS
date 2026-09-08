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

/** Moti neon tube: additive halo pass + hot core pass + glowing joints. */
export function drawSkeleton(ctx: CanvasRenderingContext2D, pts: Pt[], color: RGB, w: number, h: number, t = 0) {
  const pulse = Math.sin(t * 5);
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter';

  // halo pass
  ctx.shadowColor = css(color, 0.9);
  ctx.shadowBlur = 24;
  ctx.strokeStyle = css(color, 0.32);
  ctx.lineWidth = 13 + pulse * 2;
  for (const [a, b] of HAND_CONNECTIONS) {
    const p = px(pts[a], w, h), q = px(pts[b], w, h);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  // core pass
  ctx.shadowBlur = 18;
  ctx.strokeStyle = css(color, 1);
  ctx.lineWidth = 4.5;
  for (const [a, b] of HAND_CONNECTIONS) {
    const p = px(pts[a], w, h), q = px(pts[b], w, h);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  // joints: colored halo + white hot core
  ctx.shadowBlur = 12;
  for (const p of pts) {
    const q = px(p, w, h);
    ctx.fillStyle = css(color, 0.5);
    ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/** Beams: membrane + 18px halo + 6px core + flowing white energy dashes. */
export function drawBeams(ctx: CanvasRenderingContext2D, a: Pt[], b: Pt[], color: RGB, w: number, h: number, t = 0) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter';

  // photon membrane
  ctx.fillStyle = css(color, 0.10);
  ctx.beginPath();
  const seq = [...BEAM_POINTS, ...[...BEAM_POINTS].reverse()];
  seq.forEach((idx, i) => {
    const src = i < BEAM_POINTS.length ? a : b;
    const j = i < BEAM_POINTS.length ? idx : seq[i];
    const p = px(src[j], w, h);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath(); ctx.fill();

  const pairs = BEAM_POINTS.map((idx) => [px(a[idx], w, h), px(b[idx], w, h)] as const);

  // halo pass
  ctx.shadowColor = css(color, 1);
  ctx.shadowBlur = 30;
  ctx.strokeStyle = css(color, 0.22);
  ctx.lineWidth = 18;
  for (const [p, q] of pairs) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }

  // core pass
  ctx.shadowBlur = 20;
  ctx.strokeStyle = css(color, 0.98);
  ctx.lineWidth = 6;
  for (const [p, q] of pairs) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }

  // flowing energy dashes (twist ke saath behti hui light)
  ctx.shadowBlur = 0;
  ctx.setLineDash([14, 22]);
  ctx.lineDashOffset = -t * 140;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2.2;
  for (const [p, q] of pairs) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  ctx.setLineDash([]);
  ctx.restore();
}

/** Wavelength chip: popping scale + 32px glow + inner highlight. */
export function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number, nm: number, color: RGB, t = 0) {
  const s = 1 + Math.sin(t * 4) * 0.03;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.shadowColor = css(color, 1);
  ctx.shadowBlur = 32;
  ctx.fillStyle = css(color, 0.95);
  roundRect(ctx, -46, -18, 92, 36, 12);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, -40, -14, 80, 12, 8);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.font = '700 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${nm}nm`, 0, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '600 7px ui-monospace, Menlo, monospace';
  ctx.fillText('DIST → λ', 0, 13);
  ctx.restore();
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
