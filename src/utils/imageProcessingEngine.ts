import type {
  CSSProperties,
} from 'react';

import type {
  CutComposition,
  CutImageEffect,
  CutImageEffectType,
  CutTypeColor,
} from '../types/cut';

export const TYPE_COLORS: Record<CutTypeColor, string> = {
  black: '#111111',
  white: '#f7f4ec',
  yellow: '#d5b936',
  violet: '#7664a8',
  pink: '#c3728d',
  red: '#b9534d',
  blue: '#557f93',
  green: '#687f5e',
  orange: '#be7b49',
};

export type EffectLayerStyle = CSSProperties & {
  '--cut-effect-amount': string;
  '--cut-effect-scale': string;
  '--cut-effect-tone': string;
};

export interface ImageProcessingPass {
  id: string;
  type: CutImageEffectType;
  enabled: boolean;
  needsImage: boolean;
  style: EffectLayerStyle;
}

export const getEffectLayerStyle = (
  effect: CutImageEffect,
): EffectLayerStyle => ({
  '--cut-effect-amount': String(effect.amount / 100),
  '--cut-effect-scale': `${effect.scale}px`,
  '--cut-effect-tone': TYPE_COLORS[effect.tone],
});

const IMAGE_PASSES = new Set<CutImageEffectType>([
  'posterize',
  'xerox',
  'chromatic',
  'invert',
  'solarize',
  'thermal',
  'bloom',
  'displace',
  'pixelate',
]);

export const buildImagePasses = (
  effects: CutImageEffect[],
): ImageProcessingPass[] =>
  effects.map((effect) => ({
    id: effect.id,
    type: effect.type,
    enabled: effect.enabled,
    needsImage: IMAGE_PASSES.has(effect.type),
    style: getEffectLayerStyle(effect),
  }));

export const getImageFilter = (
  composition: CutComposition,
): string => {
  const exposure = Math.max(
    0.45,
    (100 + composition.imageExposure) / 100,
  );

  let brightness = exposure;
  let contrast = composition.imageContrast / 100;
  let saturation = composition.imageSaturation / 100;
  let grayscale = 0;
  const sepia = 0;

  switch (composition.imageLook) {
    case 'mono':
      grayscale = 1;
      contrast *= 1.08;
      break;
    case 'matte':
      brightness *= 1.04;
      contrast *= 0.88;
      saturation *= 0.76;
      break;
    case 'hard':
      contrast *= 1.5;
      saturation *= 0.86;
      break;
    case 'faded':
      brightness *= 1.08;
      contrast *= 0.78;
      saturation *= 0.62;
      break;
    case 'duotone':
      grayscale = 1;
      contrast *= 1.16;
      break;
    case 'threshold': {
      grayscale = 1;
      contrast *= 7.5;
      const thresholdShift = (50 - composition.imageThreshold) / 100;
      brightness *= Math.max(0.55, 1 + thresholdShift);
      break;
    }
    case 'halftone':
      grayscale = 0.9;
      contrast *= 1.38;
      saturation *= 0.55;
      break;
    case 'xerox':
      grayscale = 1;
      contrast *= 3.1;
      saturation = 0;
      brightness *= 1.02;
      break;
    default:
      break;
  }

  return [
    `brightness(${brightness.toFixed(3)})`,
    `contrast(${contrast.toFixed(3)})`,
    `saturate(${saturation.toFixed(3)})`,
    `grayscale(${grayscale})`,
    `sepia(${sepia})`,
  ].join(' ');
};
