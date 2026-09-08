import { Sticker } from '@/components/ui/clay';

const TECH = [
  { t: 'NEXT.JS', c: 'bg-lavender' },
  { t: 'TYPESCRIPT', c: 'bg-sky' },
  { t: 'TAILWIND', c: 'bg-mint' },
  { t: 'MEDIAPIPE', c: 'bg-butter' },
  { t: 'VERCEL', c: 'bg-peach' },
];

export function SiteFooter() {
  const items = ['SPECTRAHANDS', '380–700NM', 'HANDS → LIGHT', 'TOUCH → WHITE', '60FPS', 'NO SERVERS'];
  const row = (
    <div className="flex">
      {items.map((x, i) => (
        <span key={i} className="mx-5 inline-flex items-center gap-5">
          <span>{x}</span>
          <span className="text-lavender">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <footer className="mt-12 border-t border-white/5 bg-clay-deep">
      <div className="overflow-hidden py-3">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[11px] tracking-[0.3em] text-zinc-600">
          {row}
          <div aria-hidden>{row}</div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex flex-wrap justify-center gap-2">
          {TECH.map((x) => (
            <Sticker key={x.t} color={x.c}>{x.t}</Sticker>
          ))}
        </div>
        <span className="text-center font-mono text-[11px] text-zinc-500">
          100% in-browser · 0 bytes uploaded · ship it with `vercel deploy`
        </span>
      </div>
    </footer>
  );
}
