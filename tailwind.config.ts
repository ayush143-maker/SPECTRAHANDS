import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d13',
        clay: '#191922',
        'clay-deep': '#12121a',
        lavender: '#cfc4ff',
        mint: '#b8f0d8',
        peach: '#ffd3c4',
        butter: '#ffe9a8',
        sky: '#bcd8ff',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.75rem' },
      boxShadow: {
        clay: '0 24px 48px -12px rgba(0,0,0,0.65), inset 0 2px 0 0 rgba(255,255,255,0.06), inset 0 -18px 32px -18px rgba(0,0,0,0.6)',
        'clay-sm': '0 12px 24px -8px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07)',
        'clay-lg': '0 40px 80px -24px rgba(0,0,0,0.75), inset 0 2px 0 0 rgba(255,255,255,0.08), inset 0 -30px 60px -30px rgba(0,0,0,0.7)',
        sticker: '4px 4px 0 0 #0d0d13',
        'sticker-lg': '6px 6px 0 0 #0d0d13',
        neon: '0 0 24px rgba(255,43,214,0.25), 0 0 64px rgba(0,229,255,0.12)',
        stage: '0 32px 96px -32px rgba(207,196,255,0.25), inset 0 2px 0 0 rgba(255,255,255,0.08)',
      },
      keyframes: {
        wiggle: { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        blob: {
          '0%,100%': { borderRadius: '42% 58% 55% 45% / 45% 42% 58% 55%' },
          '50%': { borderRadius: '58% 42% 45% 55% / 55% 58% 42% 45%' },
        },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'pulse-glow': { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
      animation: {
        wiggle: 'wiggle 3s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        blob: 'blob 8s ease-in-out infinite',
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
