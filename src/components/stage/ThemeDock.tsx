// src/components/stage/ThemeDock.tsx
import { THEMES } from '@/lib/color/themes';

export function ThemeDock({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-xl">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onPick(t.id)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
            active === t.id ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.25)]' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
