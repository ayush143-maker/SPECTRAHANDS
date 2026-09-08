// src/components/stage/HandSpectrumStage.tsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SpectrumEngine } from '@/lib/engine/SpectrumEngine';
import { Hud } from './Hud';
import { ThemeDock } from './ThemeDock';
import { useFullscreen } from '@/hooks/useFullscreen';
import type { HudState } from '@/lib/vision/types';

const DEFAULT_HUD: HudState = { hands: 2, fps: 60, gesture: 'Open Hand', spreadPct: 62, nm: 540, distPct: 40, merge: false, mode: 'demo', dark: false };

export function HandSpectrumStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<SpectrumEngine | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const noticeTimer = useRef<number>(0);
  const healthTimer = useRef<number>(0);
  const [hud, setHud] = useState<HudState>(DEFAULT_HUD);
  const [theme, setTheme] = useState('rainbow');
  const [sound, setSound] = useState(false);
  const [notice, setNotice] = useState('');
  const [camState, setCamState] = useState<'off' | 'starting' | 'live'>('off');
  const [hint, setHint] = useState('');
  const { toggle } = useFullscreen();

  useEffect(() => {
    const engine = new SpectrumEngine(canvasRef.current!, setHud);
    engine.attachVideo(videoRef.current!);
    engineRef.current = engine;
    engine.start();
    return () => {
      window.clearInterval(healthTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      engine.stop();
    };
  }, []);

  // Smart hints: shutter > second-hand missing > no hands
  useEffect(() => {
    if (hud.mode !== 'camera') { setHint(''); return; }
    if (hud.dark) {
      setHint('Feed pitch-black — physical privacy shutter or lens cover closed? (bezel slider / Fn key)');
      return;
    }
    if (hud.hands === 1) {
      const t = window.setTimeout(() => setHint('Second hand missing — both palms flat & fully in frame rakho, hands overlap mat karo.'), 2500);
      return () => window.clearTimeout(t);
    }
    if (hud.hands === 0) {
      const t = window.setTimeout(() => setHint('No hands in frame — face the camera with both palms visible (good lighting helps).'), 3500);
      return () => window.clearTimeout(t);
    }
    setHint('');
  }, [hud.mode, hud.hands, hud.dark]);

  const flash = useCallback((msg: string) => {
    setNotice(msg);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 5000);
  }, []);

  const dropCamera = useCallback((msg?: string) => {
    window.clearInterval(healthTimer.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    engineRef.current?.setMode('demo');
    setCamState('off');
    if (msg) flash(msg);
  }, [flash]);

  const startHealthWatch = useCallback((track: MediaStreamTrack) => {
    window.clearInterval(healthTimer.current);
    const startedAt = performance.now();
    let bad = 0;
    healthTimer.current = window.setInterval(() => {
      if (performance.now() - startedAt < 2500) return;
      const v = videoRef.current;
      const unhealthy = track.readyState !== 'live' || track.muted || (v ? v.readyState < 2 : true);
      bad = unhealthy ? bad + 1 : 0;
      if (bad >= 4) {
        dropCamera('Camera feed mil nahi raha (device busy/muted). Dusre tabs/apps jo camera use kar rahe hain band karo, phir retry — demo mode engaged.');
      }
    }, 500);
  }, [dropCamera]);

  const pickTheme = (id: string) => { setTheme(id); engineRef.current?.setTheme(id); };
  const toggleSound = () => { const next = !sound; setSound(next); engineRef.current?.setSound(next); };

  const enableCamera = async () => {
    setNotice(''); setHint(''); setCamState('starting');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error('unsupported'), { name: 'NotSupportedError' });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: false });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();

      const track = stream.getVideoTracks()[0];
      track.addEventListener('ended', () => dropCamera('Camera stream ended — demo mode engaged.'));
      track.addEventListener('mute', () => dropCamera('Camera feed lost (device busy or blocked) — demo mode engaged.'));
      startHealthWatch(track);

      await Promise.race([
        engineRef.current!.ensureTracker(),
        new Promise((_, rej) => window.setTimeout(() => rej(Object.assign(new Error('timeout'), { name: 'TimeoutError' })), 20000)),
      ]);
      engineRef.current!.setMode('camera');
      setCamState('live');
    } catch (e) {
      const name = (e as DOMException)?.name;
      dropCamera(
        name === 'NotAllowedError'
          ? 'Camera permission denied — address-bar camera icon se Allow karo, ya demo mode use karo.'
          : name === 'NotFoundError'
            ? 'No camera found on this device — demo mode keeps the photons flowing.'
            : name === 'TimeoutError'
              ? 'Hand-tracking model load timeout (network blocked?) — demo mode engaged. Retry on a better network.'
              : 'Camera unavailable — demo mode keeps the photons flowing.'
      );
    }
  };

  return (
    <div id="lab" className="relative">
      {/* clay bezel around the screen */}
      <div className="clay grain relative p-3 sm:p-4">
        <div
          ref={wrapRef}
          className="group relative aspect-video w-full overflow-hidden rounded-4xl border border-white/5 bg-black shadow-clay-lg"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <video ref={videoRef} playsInline muted className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />

          {/* pastel corner brackets */}
          <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-lavender/70" />
          <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-mint/70" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-mint/70" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-lavender/70" />

          <Hud hud={hud} />

          {hud.merge && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-2xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_24px_#fff]">
                Σλ → WHITE
              </span>
            </div>
          )}

          {camState === 'starting' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="clay-sm animate-pulse-glow px-6 py-3 font-mono text-sm tracking-[0.3em] text-lavender">
                WARMING UP GPU LANDMARKER…
              </span>
            </div>
          )}

          {hint && camState === 'live' && (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center">
              <span className="rounded-full border border-white/5 bg-clay/95 px-4 py-2 font-mono text-[11px] text-sky shadow-clay-sm">
                {hint}
              </span>
            </div>
          )}

          <div className="absolute right-3 top-3 flex gap-2">
            <IconBtn label={camState === 'live' ? 'Switch to demo mode' : 'Enable camera'} onClick={camState === 'live' ? () => dropCamera('Camera off — demo mode.') : enableCamera}>
              {camState === 'live' ? <CamIcon off /> : <CamIcon />}
            </IconBtn>
            <IconBtn label={sound ? 'Mute' : 'Enable sound'} onClick={toggleSound}>
              <SoundIcon on={sound} />
            </IconBtn>
            <IconBtn label="Fullscreen" onClick={() => toggle(wrapRef.current)}>
              <ExpandIcon />
            </IconBtn>
          </div>

          <ThemeDock active={theme} onPick={pickTheme} />

          {notice && (
            <div className="absolute bottom-14 left-3 max-w-[80%] rounded-2xl border border-white/5 bg-clay/95 px-3 py-1.5 font-mono text-[11px] text-peach shadow-clay-sm">
              {notice}
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[11px] text-zinc-500">
        palms apart = red · palms together = violet · touch = white-light supernova · FIST = gravity well · OPEN HAND = photon wind
      </p>
    </div>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-2xl border border-white/5 bg-clay p-2.5 text-zinc-300 shadow-clay-sm transition hover:-translate-y-0.5 hover:text-white active:scale-95"
    >
      {children}
    </button>
  );
}

const CamIcon = ({ off }: { off?: boolean } = {}) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" />
    {off && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);
const SoundIcon = ({ on }: { on: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {on ? <><path d="M15.5 8.5a5 5 0 010 7" /><path d="M19 5a9 9 0 010 14" /></> : <line x1="23" y1="9" x2="17" y2="15" />}
  </svg>
);
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 00-2 2v3" /><path d="M21 8V5a2 2 0 00-2-2h-3" /><path d="M3 16v3a2 2 0 002 2h3" /><path d="M16 21h3a2 2 0 002-2v-3" />
  </svg>
);
