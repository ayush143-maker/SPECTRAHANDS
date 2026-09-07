// src/components/marketing/SiteFooter.tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-[11px] text-zinc-500 sm:flex-row">
        <span>SPECTRAHANDS — built with Next.js · TypeScript · Tailwind · MediaPipe · Vercel</span>
        <span>100% in-browser · 0 bytes uploaded · ship it with `vercel deploy`</span>
      </div>
    </footer>
  );
}
