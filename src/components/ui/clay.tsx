import type { ReactNode } from 'react';

/** Puffy matte clay card: outer wrapper tilt+hover, inner clay surface. */
export function ClayCard({ children, className = '', tilt = 0 }: { children: ReactNode; className?: string; tilt?: number }) {
  return (
    <div
      className="transition duration-300 hover:scale-[1.015]"
      style={tilt ? { rotate: `${tilt}deg` } : undefined}
    >
      <div className={`clay relative ${className}`}>{children}</div>
    </div>
  );
}

/** Tilted hard-shadow badge. color = tailwind bg class. */
export function Sticker({ children, color = 'bg-butter', className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return <span className={`sticker ${color} ${className}`}>{children}</span>;
}

/** Chunky clay button with inner highlight + squish on press. */
export function ClayButton({
  children, href, onClick, tone = 'primary', className = '',
}: {
  children: ReactNode; href?: string; onClick?: () => void;
  tone?: 'primary' | 'ghost'; className?: string;
}) {
  const cls = tone === 'primary'
    ? 'bg-lavender text-ink shadow-[0_16px_32px_-12px_rgba(207,196,255,0.55),inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-12px_20px_-10px_rgba(0,0,0,0.3)]'
    : 'border border-white/5 bg-clay text-zinc-200 shadow-clay-sm';
  const base = `inline-flex items-center gap-2 rounded-3xl px-6 py-3 font-display text-sm font-bold transition hover:-translate-y-0.5 active:scale-95 ${cls} ${className}`;
  if (href) return <a href={href} className={base}>{children}</a>;
  return <button onClick={onClick} className={base}>{children}</button>;
}
