// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SPECTRAHANDS — your hands are the visible spectrum',
  description: 'Real-time hand-tracked light synth: palm distance maps to 380–700nm, touch merges every color into a white-light supernova. 100% in-browser.',
  openGraph: { title: 'SPECTRAHANDS', description: 'Move your hands. Bend the spectrum.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-void font-display text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
