import { HandTracker } from '@/lib/vision/handTracker';
import { handMetrics, aspectDist } from '@/lib/vision/gestures';
import { syntheticHands } from '@/lib/vision/syntheticHands';
import { ParticleSystem, type ForceField } from '@/lib/fx/particles';
import { drawSkeleton, drawBeams, drawChip, drawVignette } from '@/lib/fx/paint';
import { THEMES, type Theme } from '@/lib/color/themes';
import type { HandMetrics, HudState, Pt } from '@/lib/vision/types';

type Mode = 'demo' | 'camera';
const TAU = Math.PI * 2;
const easeOut = (k: number) => 1 - (1 - k) * (1 - k);

export class SpectrumEngine {
  private ctx: CanvasRenderingContext2D;
  private raf = 0; private last = 0; private t = 0;
  private w = 0; private h = 0;
  private fps = 60; private hudAcc = 0;
  private mode: Mode = 'demo';
  private theme: Theme = THEMES[0];
  private tracker = new HandTracker();
  private trackerReady = false; private trackerLoading = false;
  private video: HTMLVideoElement | null = null;
  private particles = new ParticleSystem();
  private pct = 0.5; private nm = 540;
  private flash = 0; private shock = -1; private cooldown = 0;
  private ex = 0; private ey = 0;
  private merge = false;
  private metrics: HandMetrics[] = [];
  private darkCanvas: HTMLCanvasElement | null = null;
  private darkAcc = 0; private darkTime = 0; private dark = false;
  private soundOn = false;
  private ac: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  constructor(private canvas: HTMLCanvasElement, private onHud: (h: HudState) => void) {
    this.ctx = canvas.getContext('2d')!;
  }

  attachVideo(v: HTMLVideoElement) { this.video = v; }
  start() { this.last = performance.now(); this.raf = requestAnimationFrame(this.loop); }
  stop() { cancelAnimationFrame(this.raf); this.tracker.dispose(); this.ac?.close(); this.ac = null; }
  setTheme(id: string) { this.theme = THEMES.find((t) => t.id === id) ?? THEMES[0]; }
  setMode(m: Mode) { this.mode = m; this.t = 0; }

  async ensureTracker() {
    if (this.trackerReady || this.trackerLoading) return;
    this.trackerLoading = true;
    await this.tracker.init();
    this.trackerReady = true;
    this.trackerLoading = false;
  }

  setSound(on: boolean) {
    this.soundOn = on;
    if (on && !this.ac) {
      this.ac = new AudioContext();
      this.osc = this.ac.createOscillator();
      this.gain = this.ac.createGain();
      const filter = this.ac.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 1200;
      this.osc.type = 'sawtooth';
      this.gain.gain.value = 0;
      this.osc.connect(filter).connect(this.gain).connect(this.ac.destination);
      this.osc.start();
    }
    if (this.ac && this.gain) {
      this.ac.resume();
      this.gain.gain.setTargetAtTime(on ? 0.045 : 0, this.ac.currentTime, 0.1);
    }
  }

  private ping() {
    if (!this.ac || !this.soundOn) return;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    const t0 = this.ac.currentTime;
    o.type = 'triangle';
    o.frequency.setValueAtTime(1400, t0);
    o.frequency.exponentialRampToValueAtTime(180, t0 + 0.5);
    g.gain.setValueAtTime(0.25, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(g).connect(this.ac.destination);
    o.start(t0); o.stop(t0 + 0.65);
  }

  private safeDetect(): Pt[][] {
    if (!this.trackerReady || !this.video) return [];
    try { return this.tracker.detect(this.video, performance.now()); } catch { return []; }
  }

  private sampleLuma(dt: number) {
    const v = this.video;
    if (!v || v.readyState < 2) { this.darkTime = 0; this.dark = false; return; }
    this.darkAcc += dt;
    if (this.darkAcc < 0.5) return;
    this.darkAcc = 0;
    if (!this.darkCanvas) {
      this.darkCanvas = document.createElement('canvas');
      this.darkCanvas.width = 24; this.darkCanvas.height = 14;
    }
    const c = this.darkCanvas.getContext('2d', { willReadFrequently: true });
    if (!c) return;
    c.drawImage(v, 0, 0, 24, 14);
    let data: Uint8ClampedArray;
    try { data = c.getImageData(0, 0, 24, 14).data; } catch { return; }
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const luma = sum / (data.length / 4);
    this.darkTime = luma < 10 ? this.darkTime + 0.5 : 0;
    this.dark = this.darkTime >= 2.5;
  }

  private loop = (ts: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dtRaw = (ts - this.last) / 1000;
    this.last = ts;
    const dt = Math.min(dtRaw, 0.05);
    this.t += dt;
    this.fps += (1 / Math.max(dtRaw, 1e-4) - this.fps) * 0.08;
    this.resize();
    this.step(dt);
    this.draw();
    this.hudAcc += dt;
    if (this.hudAcc > 0.12) { this.hudAcc = 0; this.onHud(this.hud()); }
  };

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) { this.canvas.width = W; this.canvas.height = H; }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
  }

  private step(dt: number) {
    const raw: Pt[][] = this.mode === 'camera' ? this.safeDetect() : syntheticHands(this.t);
    const hands = raw.map((h) => h.map((p) => ({ x: 1 - p.x, y: p.y }))); // mirror
    this.metrics = hands.map(handMetrics);
    const aspect = this.w / this.h || 1.78;

    if (this.mode === 'camera') this.sampleLuma(dt);
    else { this.dark = false; this.darkTime = 0; }

    if (this.metrics.length >= 2) {
      const [a, b] = this.metrics;
      const d = aspectDist(a.centroid, b.centroid, aspect);
      const target = Math.min(1, Math.max(0, (d - 0.10) / 0.62));
      this.pct += (target - this.pct) * (1 - Math.exp(-8 * dt));
      this.nm = 380 + this.pct * 320;
      this.cooldown -= dt;
      if (d < 0.09 && this.cooldown <= 0) {
        this.ex = ((a.centroid.x + b.centroid.x) / 2) * this.w;
        this.ey = ((a.centroid.y + b.centroid.y) / 2) * this.h;
        this.flash = 1; this.shock = 0;
        this.particles.burst(this.ex, this.ey, 300);
        this.ping();
        this.cooldown = 1.4;
      }
      this.merge = d < 0.12;
    } else this.merge = false;

    this.flash = Math.max(0, this.flash - dt * 1.4);
    if (this.shock >= 0) { this.shock += dt; if (this.shock > 0.8) this.shock = -1; }

    const fields: ForceField[] = this.metrics.map((m) => ({
      x: m.centroid.x * this.w, y: m.centroid.y * this.h,
      r: Math.min(this.w, this.h) * 0.35,
      sign: m.gesture === 'Fist' ? 1 : m.gesture === 'Open Hand' ? -1 : 0,
    }));

    const rate = this.mode === 'demo' ? 26 : 14;
    if (Math.random() < rate * dt) {
      const c = this.theme.particles[(Math.random() * this.theme.particles.length) | 0];
      this.particles.spawn(Math.random() * this.w, Math.random() * this.h, c);
    }
    this.particles.update(dt, fields, this.w, this.h);

    if (this.soundOn && this.osc && this.ac) {
      this.osc.frequency.setTargetAtTime(140 + (1 - this.pct) * 620, this.ac.currentTime, 0.08);
    }
  }

  private draw() {
    const ctx = this.ctx, { w, h } = this;
    if (!w || !h) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);

    const track = (this.video?.srcObject as MediaStream | null)?.getVideoTracks()[0];
    const videoLive = this.mode === 'camera' && this.video && this.video.readyState >= 2
      && !!track && track.readyState === 'live' && !track.muted;

    if (!videoLive) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, this.theme.bg[0]); g.addColorStop(1, this.theme.bg[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } else {
      const v = this.video!;
      const vw = v.videoWidth || 1280, vh = v.videoHeight || 720;
      const s = Math.max(w / vw, h / vh), dw = vw * s, dh = vh * s;
      ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1);
      ctx.drawImage(v, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.restore();
      ctx.fillStyle = 'rgba(5,5,10,0.25)'; ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = this.theme.tint; ctx.fillRect(0, 0, w, h);

    this.particles.draw(ctx);

    const color = this.theme.colorAt(this.pct, this.nm);
    for (const m of this.metrics) drawSkeleton(ctx, m.pts, color, w, h);
    if (this.metrics.length >= 2) {
      const [a, b] = this.metrics;
      drawBeams(ctx, a.pts, b.pts, color, w, h);
      drawChip(ctx, ((a.centroid.x + b.centroid.x) / 2) * w, ((a.centroid.y + b.centroid.y) / 2) * h, Math.round(this.nm), color);
    }

    if (this.shock >= 0) {
      const k = this.shock / 0.8;
      const a = 1 - k;
      const r = easeOut(k) * Math.max(w, h) * 0.7;
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 2 + a * 3;
      ctx.strokeStyle = `rgba(255,90,90,${a * 0.5})`;
      ctx.beginPath(); ctx.arc(this.ex - 6 * a, this.ey, r * 1.05, 0, TAU); ctx.stroke();
      ctx.strokeStyle = `rgba(90,200,255,${a * 0.5})`;
      ctx.beginPath(); ctx.arc(this.ex + 6 * a, this.ey, r * 0.95, 0, TAU); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.9})`;
      ctx.beginPath(); ctx.arc(this.ex, this.ey, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = cssSafe(color, a * 0.6);
      ctx.beginPath(); ctx.arc(this.ex, this.ey, r * 0.72, 0, TAU); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash) * 0.95})`;
      ctx.fillRect(0, 0, w, h);
    }
    drawVignette(ctx, w, h);
  }

  private hud(): HudState {
    const m = this.metrics[0];
    return {
      hands: this.metrics.length,
      fps: Math.round(this.fps),
      gesture: m ? m.gesture : '—',
      spreadPct: m ? m.spreadPct : 0,
      nm: Math.round(this.nm),
      distPct: Math.round(this.pct * 100),
      merge: this.merge,
      mode: this.mode,
      dark: this.dark,
    };
  }
}

function cssSafe(c: [number, number, number], a: number) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}
