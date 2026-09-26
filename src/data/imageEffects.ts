import type {
  CutImageEffect,
  CutImageEffectType,
} from '../types/cut';

export const imageEffectCatalog: {
  id: CutImageEffectType;
  label: string;
  description: string;
}[] = [
  { id: 'duotone', label: 'Duotone', description: 'Color-map the image into a graphic ink treatment.' },
  { id: 'posterize', label: 'Posterize', description: 'Compress tonal range into a harder poster-like image.' },
  { id: 'halftone', label: 'Halftone', description: 'Add an adjustable print-screen dot structure.' },
  { id: 'xerox', label: 'Xerox', description: 'Push contrast, noise and copy-machine texture.' },
  { id: 'chromatic', label: 'Chromatic', description: 'Split image channels for a controlled registration error.' },
  { id: 'scanlines', label: 'Scanlines', description: 'Overlay a dense raster / display line structure.' },
  { id: 'grain', label: 'Grain', description: 'Add independent coarse surface noise.' },
  { id: 'invert', label: 'Invert', description: 'Blend an inverted image pass into the stack.' },
  { id: 'dither', label: 'Dither', description: 'Reduce the image into a hard bitmap-like matrix.' },
  { id: 'solarize', label: 'Solarize', description: 'Partially invert highlights for a photographic solarization.' },
  { id: 'thermal', label: 'Thermal', description: 'False-color the image with an aggressive heat-map treatment.' },
  { id: 'bloom', label: 'Bloom', description: 'Bleed bright areas into a soft optical glow.' },
  { id: 'displace', label: 'Displace', description: 'Create horizontal scan displacement and tearing.' },
  { id: 'pixelate', label: 'Pixelate', description: 'Force a coarse low-resolution raster structure.' },
];

const defaults: Record<
  CutImageEffectType,
  Pick<CutImageEffect, 'amount' | 'scale' | 'tone'>
> = {
  duotone: { amount: 68, scale: 6, tone: 'yellow' },
  posterize: { amount: 62, scale: 5, tone: 'black' },
  halftone: { amount: 58, scale: 6, tone: 'black' },
  xerox: { amount: 70, scale: 5, tone: 'black' },
  chromatic: { amount: 42, scale: 5, tone: 'blue' },
  scanlines: { amount: 38, scale: 4, tone: 'black' },
  grain: { amount: 42, scale: 6, tone: 'black' },
  invert: { amount: 34, scale: 5, tone: 'white' },
  dither: { amount: 58, scale: 5, tone: 'black' },
  solarize: { amount: 54, scale: 5, tone: 'violet' },
  thermal: { amount: 72, scale: 6, tone: 'orange' },
  bloom: { amount: 38, scale: 9, tone: 'white' },
  displace: { amount: 48, scale: 8, tone: 'black' },
  pixelate: { amount: 58, scale: 8, tone: 'black' },
};

export const createImageEffect = (
  type: CutImageEffectType,
  id: string
): CutImageEffect => ({
  id,
  type,
  enabled: true,
  ...defaults[type],
});
