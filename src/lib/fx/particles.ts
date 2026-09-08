import { type RGB, css, wavelengthToRgb } from '@/lib/color/wavelength';

export type ForceField = { x: number; y: number; r: number; sign: number };
type P = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number;
  color: RGB; shape: number; streak: number;
};

const TAU = Math.PI * 2;

export class ParticleSystem {
  private ps: P[] = [];

  spawn(x: number, y: number, color: RGB) {
    this.ps.push({
      x, y,
      vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26 - 8,
      life: 0, max: 2 + Math.random() * 3,
      size: 1.2 + Math.random() * 2.4, color, shape: (Math.random() * 3) | 0, streak: 0,
    });
    if (this.ps.length > 600) this.ps.splice(0, this.ps.length - 600);
  }

  burst(x: number, y: number, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU;
      const sp = 140 + Math.random() * 700;
      const max = 0.5 + Math.random() * 0.9;
      this.ps.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: max, max,
        size: 1.4 + Math.random() * 2.6,
        color: i % 5 < 2 ? [255, 255, 255] : wavelengthToRgb(380 + Math.random() * 320),
        shape: 0, streak: 1,
      });
    }
    if (this.ps.length > 900) this.ps.splice(0, this.ps.length - 900);
  }

  update(dt: number, fields: ForceField[], w: number, h: number) {
    const drag = Math.exp(-1.2 * dt);
    for (let i = this.ps.length - 1; i >= 0; i--) {
      const p = this.ps[i];
      p.life -= dt;
      if (p.life <= 0 || p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 80) { this.ps.splice(i, 1); continue; }
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
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const p of this.ps) {
      const a = Math.max(0, p.life / p.max);
      if (p.streak) {
        // velocity-aligned motion trail (reel-wala streak look)
        const tx = p.x - p.vx * 0.05, ty = p.y - p.vy * 0.05;
        ctx.strokeStyle = css(p.color, a * 0.9);
        ctx.lineWidth = p.size;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.fillStyle = css(p.color, a);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.7, 0, TAU); ctx.fill();
      } else if (p.shape === 0) {
        ctx.fillStyle = css(p.color, a * 0.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
      } else if (p.shape === 1) {
        const s = p.size * 2.2;
        ctx.fillStyle = css(p.color, a * 0.6);
        ctx.beginPath(); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s, p.y + s); ctx.lineTo(p.x - s, p.y + s); ctx.closePath(); ctx.fill();
      } else {
        const s = p.size * 2;
        ctx.strokeStyle = css(p.color, a * 0.6);
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s); ctx.stroke();
      }
    }
    ctx.restore();
  }
}
