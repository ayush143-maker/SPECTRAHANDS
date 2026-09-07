// src/components/stage/HandSpectrumStage.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { SpectrumEngine } from '@/lib/engine/SpectrumEngine';
import { Hud } from './Hud';
import { ThemeDock } from './ThemeDock';
import { useFullscreen } from '@/hooks/useFullscreen';
import type { HudState } from '@/lib/vision/types';

const DEFAULT_HUD: HudState = { hands: 2, fps: 60, gesture: 'Open Hand', spreadPct: 62, nm: 540, distPct: 40, merge: false, mode: 'demo' };

export function HandSpectrumStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<SpectrumEngine | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hud, setHud] = useState<HudState>(DEFAULT_HUD);
  const [theme, setTheme] = useState('rainbow');
  const [sound, setSound] = useState(false);
  const [error, setError] = useState('');
  const { toggle } = useFullscreen();

  useEffect(() => {
    const engine = new SpectrumEngine(canvasRef.current!, setHud);
    engine.attachVideo(videoRef.current!);
    engineRef.current = engine;
    engine.start();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); engine.stop(); };
  }, []);

  const pickTheme = (id: string) => { setTheme(id); engineRef.current?.setTheme(id); };
  const toggleSound = () => { const next = !sound; setSound(next); engineRef.current?.setSound(next); };

  const enableCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: false });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      await engineRef.current!.ensureTracker();
      engineRef.current!.setMode('camera');
    } catch {
      setError('Camera blocked — demo mode keeps the photons flowing.');
    }
  };

  const disableCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    engineRef.current?.setMode('demo');
  };

  return (
    <div id="lab" className="relative">
      <div
        ref={wrapRef}
        className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-stage"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* corner brackets */}
        <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-fuchsia-400/70" />
        <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-cyan-400/70" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-cyan-400/70" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-fuchsia-400/70" />

        <Hud hud={hud} />

        {hud.merge && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_24px_#fff]">
              Σλ → WHITE
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          <IconBtn label={hud.mode === 'camera' ? 'Switch to demo mode' : 'Enable camera'} onClick={hud.mode === 'camera' ? disableCamera : enableCamera}>
            {hud.mode === 'camera' ? <CamIcon off /> : <CamIcon />}
          </IconBtn>
          <IconBtn label={sound ? 'Mute' : 'Enable sound'} onClick={toggleSound}>
            <SoundIcon on={sound} />
          </IconBtn>
          <IconBtn label="Fullscreen" onClick={() => toggle(wrapRef.current)}>
            <ExpandIcon />
          </IconBtn>
        </div>

        <ThemeDock active={theme} onPick={pickTheme} />

        {error && (
          <div className="absolute bottom-14 left-3 rounded-lg border border-red-400/30 bg-red-950/70 px-3 py-1.5 font-mono text-[11px] text-red-200 backdrop-blur">
            {error}
          </div>
        )}
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
      className="rounded-lg border border-white/10 bg-black/50 p-2 text-zinc-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
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
