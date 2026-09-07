// src/lib/color/themes.ts
import { type RGB, wavelengthToRgb, gradientAt } from './wavelength';

export type Theme = {
  id: string; label: string;
  colorAt: (pct: number, nm: number) => RGB;
  particles: RGB[];
  bg: [string, string];
  accent: string;
  tint: string;
};

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const ramp = (stops: string[]) => { const s = stops.map(hex); return (t: number) => gradientAt(s, t); };

export const THEMES: Theme[] = [
  { id: 'rainbow',   label: 'Rainbow',   colorAt: (_p, nm) => wavelengthToRgb(nm), particles: [hex('#ffffff'), hex('#ff00e0'), hex('#00e5ff'), hex('#affe00')], bg: ['#050508', '#0b0714'], accent: '#ff2bd6', tint: 'rgba(255,255,255,0.02)' },
  { id: 'cyberpunk', label: 'Cyberpunk', colorAt: ramp(['#00e5ff', '#ff2bd6']),    particles: [hex('#00e5ff'), hex('#ff2bd6'), hex('#ffffff')], bg: ['#030616', '#16041c'], accent: '#00e5ff', tint: 'rgba(0,229,255,0.05)' },
  { id: 'lava',      label: 'Lava',      colorAt: ramp(['#ffe45e', '#ff9500', '#ff3b30']), particles: [hex('#ff9500'), hex('#ff3b30'), hex('#ffd60a')], bg: ['#140404', '#1c0a02'], accent: '#ff9500', tint: 'rgba(255,120,0,0.05)' },
  { id: 'ocean',     label: 'Ocean',     colorAt: ramp(['#a0fff0', '#00c2ff', '#0055ff']), particles: [hex('#00c2ff'), hex('#a0fff0'), hex('#ffffff')], bg: ['#020617', '#031420'], accent: '#00c2ff', tint: 'rgba(0,150,255,0.05)' },
  { id: 'galaxy',    label: 'Galaxy',    colorAt: ramp(['#c26bff', '#ff6bd6', '#8f7bff']), particles: [hex('#c26bff'), hex('#ff6bd6'), hex('#ffffff')], bg: ['#0b0416', '#150627'], accent: '#c26bff', tint: 'rgba(180,90,255,0.05)' },
  { id: 'aurora',    label: 'Aurora',    colorAt: ramp(['#00ffa3', '#00c2ff', '#b06bff']), particles: [hex('#00ffa3'), hex('#00c2ff'), hex('#b06bff')], bg: ['#02100b', '#04101c'], accent: '#00ffa3', tint: 'rgba(0,255,170,0.04)' },
];
