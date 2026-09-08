import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Build-time self-hosted (next/font) → runtime me zero external requests
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'SPECTRAHANDS — your hands are the visible spectrum',
  description: 'Real-time hand-tracked light synth: palm distance maps to 380–700nm, touch merges every color into a white-light supernova. 100% in-browser.',
  openGraph: { title: 'SPECTRAHANDS', description: 'Move your hands. Bend the spectrum.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${display.variable} ${mono.variable} bg-ink font-display text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
