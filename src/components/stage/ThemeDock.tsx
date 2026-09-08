import { THEMES } from '@/lib/color/themes';

export function ThemeDock({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-white/5 bg-clay/95 p-1.5 shadow-clay-sm">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onPick(t.id)}
          className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold transition ${
            active === t.id
              ? 'bg-lavender text-ink shadow-[inset_0_2px_0_rgba(255,255,255,0.55),0_8px_16px_-8px_rgba(207,196,255,0.7)]'
              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
