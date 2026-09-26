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
];

const defaults: Record<
  CutImageEffectType,
  Pick<CutImageEffect, 'amount' | 'scale' | 'tone'>
> = {
  duotone: { amount: 68, scale: 6, tone: 'yellow' },
  posterize: { amount: 62, scale: 5, tone: 'yellow' },
  halftone: { amount: 58, scale: 6, tone: 'yellow' },
  xerox: { amount: 70, scale: 5, tone: 'yellow' },
  chromatic: { amount: 42, scale: 5, tone: 'blue' },
  scanlines: { amount: 38, scale: 4, tone: 'yellow' },
  grain: { amount: 42, scale: 6, tone: 'yellow' },
  invert: { amount: 34, scale: 5, tone: 'yellow' },
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
