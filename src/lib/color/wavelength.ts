// src/lib/color/wavelength.ts
export type RGB = [number, number, number];

/** Classic Bruton approximation: visible wavelength (380–700nm) → sRGB. */
export function wavelengthToRgb(nm: number): RGB {
  const w = Math.min(700, Math.max(380, nm));
  let r = 0, g = 0, b = 0;
  if (w < 440) { r = -(w - 440) / 60; b = 1; }
  else if (w < 490) { g = (w - 440) / 50; b = 1; }
  else if (w < 510) { g = 1; b = -(w - 510) / 20; }
  else if (w < 580) { r = (w - 510) / 70; g = 1; }
  else if (w < 645) { r = 1; g = -(w - 645) / 65; }
  else { r = 1; }
  const fall = w > 645 ? 0.3 + 0.7 * (700 - w) / 55 : w < 420 ? 0.3 + 0.7 * (w - 380) / 40 : 1;
  const gam = (c: number) => 255 * Math.pow(Math.max(0, c * fall), 0.8);
  return [gam(r), gam(g), gam(b)];
}

export const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
export const lerpRgb = (a: RGB, b: RGB, t: number): RGB =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export function gradientAt(stops: RGB[], t: number): RGB {
  const x = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  return lerpRgb(stops[i], stops[i + 1], x - i);
}

export const bandName = (nm: number) =>
  nm < 450 ? 'Violet' : nm < 485 ? 'Blue' : nm < 500 ? 'Cyan' : nm < 565 ? 'Green' : nm < 590 ? 'Yellow' : nm < 625 ? 'Orange' : 'Red';

export const SPECTRUM_CSS = 'linear-gradient(90deg,#7c00ff,#0040ff,#00ffd5,#7fff00,#ffe600,#ff7a00,#ff0000)';
