// src/lib/fx/particles.ts
import { type RGB, css, wavelengthToRgb } from '@/lib/color/wavelength';

export type ForceField = { x: number; y: number; r: number; sign: number }; // sign>0 attract, <0 repel
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: RGB; shape: number };

export class ParticleSystem {
  private ps: P[] = [];

  spawn(x: number, y: number, color: RGB) {
    this.ps.push({
      x, y,
      vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26 - 8,
      life: 0, max: 2 + Math.random() * 3,
      size: 1 + Math.random() * 2.2, color, shape: (Math.random() * 3) | 0,
    });
    if (this.ps.length > 600) this.ps.splice(0, this.ps.length - 600);
  }

  burst(x: number, y: number, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 120 + Math.random() * 640;
      this.ps.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0.5 + Math.random() * 0.9, max: 0.5 + Math.random() * 0.9,
        size: 1 + Math.random() * 2.8,
        color: i % 5 < 2 ? [255, 255, 255] : wavelengthToRgb(380 + Math.random() * 320),
        shape: 0,
      });
    }
    if (this.ps.length > 900) this.ps.splice(0, this.ps.length - 900);
  }

  update(dt: number, fields: ForceField[], w: number, h: number) {
    const drag = Math.exp(-1.2 * dt);
    for (let i = this.ps.length - 1; i >= 0; i--) {
      const p = this.ps[i];
      p.life -= dt;
      if (p.life <= 0 || p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60) { this.ps.splice(i, 1); continue; }
      for (const f of fields) {
        if (!f.sign) continue;
        const dx = f.x - p.x, dy = f.y - p.y;
        const dist = Math.hypot(dx, dy) + 1e-3;
        if (dist < f.r) {
          const a = f.sign * 260 * (1 - dist / f.r);
          p.vx += (dx / dist) * a * dt;
          p.vy += (dy / dist) * a * dt;
        }
      }
      p.vx *= drag; p.vy *= drag;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.ps) {
      const a = Math.max(0, p.life / p.max) * 0.85;
      ctx.fillStyle = css(p.color, a);
      if (p.shape === 0) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === 1) {
        const s = p.size * 2.2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s, p.y + s); ctx.lineTo(p.x - s, p.y + s); ctx.closePath(); ctx.fill();
      } else {
        const s = p.size * 2;
        ctx.strokeStyle = css(p.color, a); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}
