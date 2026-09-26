import type {
  CutComposition,
  CutImageEffect,
  CutImageEffectType,
  CutProcessingPreset,
  CutTypeColor,
} from '../types/cut';

export interface ProcessingPresetDefinition {
  id: CutProcessingPreset;
  label: string;
  description: string;
  patch: Pick<
    CutComposition,
    | 'imageLook'
    | 'imageExposure'
    | 'imageContrast'
    | 'imageSaturation'
    | 'imageGrain'
    | 'imageThreshold'
    | 'imageHalftoneSize'
    | 'imageTone'
  >;
  effects: Array<{
    type: CutImageEffectType;
    amount: number;
    scale: number;
    tone: CutTypeColor;
  }>;
}

const cleanPatch: ProcessingPresetDefinition['patch'] = {
  imageLook: 'original',
  imageExposure: 0,
  imageContrast: 100,
  imageSaturation: 100,
  imageGrain: 0,
  imageThreshold: 52,
  imageHalftoneSize: 6,
  imageTone: 'black',
};

export const processingPresets: ProcessingPresetDefinition[] = [
  {
    id: 'clean',
    label: 'Clean',
    description: 'Neutral photographic baseline.',
    patch: cleanPatch,
    effects: [],
  },
  {
    id: 'brutal-print',
    label: 'Brutal print',
    description: 'Hard copy-machine contrast with coarse print texture.',
    patch: { ...cleanPatch, imageLook: 'hard', imageContrast: 132, imageSaturation: 72, imageGrain: 12 },
    effects: [
      { type: 'xerox', amount: 52, scale: 5, tone: 'black' },
      { type: 'halftone', amount: 28, scale: 7, tone: 'black' },
      { type: 'grain', amount: 36, scale: 8, tone: 'black' },
    ],
  },
  {
    id: 'acid-dither',
    label: 'Acid dither',
    description: 'Graphic reduction, dither matrix and chromatic registration.',
    patch: { ...cleanPatch, imageLook: 'threshold', imageThreshold: 47, imageContrast: 118, imageSaturation: 116 },
    effects: [
      { type: 'dither', amount: 76, scale: 5, tone: 'black' },
      { type: 'chromatic', amount: 38, scale: 6, tone: 'blue' },
      { type: 'duotone', amount: 38, scale: 5, tone: 'yellow' },
    ],
  },
  {
    id: 'newsroom',
    label: 'Newsroom',
    description: 'Compressed monochrome newspaper reproduction.',
    patch: { ...cleanPatch, imageLook: 'mono', imageContrast: 126, imageSaturation: 0, imageGrain: 10 },
    effects: [
      { type: 'halftone', amount: 54, scale: 5, tone: 'black' },
      { type: 'grain', amount: 22, scale: 5, tone: 'black' },
    ],
  },
  {
    id: 'risograph',
    label: 'Risograph',
    description: 'Offset ink layers with imperfect registration.',
    patch: { ...cleanPatch, imageLook: 'duotone', imageContrast: 114, imageSaturation: 68, imageTone: 'red' },
    effects: [
      { type: 'duotone', amount: 64, scale: 5, tone: 'red' },
      { type: 'chromatic', amount: 30, scale: 4, tone: 'blue' },
      { type: 'grain', amount: 25, scale: 6, tone: 'black' },
    ],
  },
  {
    id: 'thermal',
    label: 'Thermal',
    description: 'False-color heat map with hard luminance separation.',
    patch: { ...cleanPatch, imageLook: 'hard', imageContrast: 122, imageSaturation: 135 },
    effects: [
      { type: 'thermal', amount: 82, scale: 6, tone: 'orange' },
      { type: 'posterize', amount: 42, scale: 4, tone: 'yellow' },
    ],
  },
  {
    id: 'solarized',
    label: 'Solarized',
    description: 'Partial tonal inversion with dense photographic color.',
    patch: { ...cleanPatch, imageLook: 'matte', imageContrast: 118, imageSaturation: 112 },
    effects: [
      { type: 'solarize', amount: 74, scale: 5, tone: 'violet' },
      { type: 'grain', amount: 18, scale: 5, tone: 'black' },
    ],
  },
  {
    id: 'bleach',
    label: 'Bleach',
    description: 'Blown highlights, pale color and hard black retention.',
    patch: { ...cleanPatch, imageLook: 'faded', imageExposure: 8, imageContrast: 116, imageSaturation: 38 },
    effects: [
      { type: 'bloom', amount: 42, scale: 10, tone: 'white' },
      { type: 'grain', amount: 16, scale: 5, tone: 'black' },
    ],
  },
  {
    id: 'infrared',
    label: 'Infrared',
    description: 'High-energy false color with spectral separation.',
    patch: { ...cleanPatch, imageLook: 'hard', imageContrast: 112, imageSaturation: 138 },
    effects: [
      { type: 'thermal', amount: 56, scale: 6, tone: 'pink' },
      { type: 'invert', amount: 24, scale: 5, tone: 'white' },
      { type: 'chromatic', amount: 24, scale: 5, tone: 'violet' },
    ],
  },
  {
    id: 'chroma-burn',
    label: 'Chroma burn',
    description: 'Dense color, bloom and channel displacement.',
    patch: { ...cleanPatch, imageLook: 'hard', imageContrast: 120, imageSaturation: 145 },
    effects: [
      { type: 'chromatic', amount: 58, scale: 8, tone: 'red' },
      { type: 'bloom', amount: 28, scale: 8, tone: 'white' },
      { type: 'grain', amount: 14, scale: 5, tone: 'black' },
    ],
  },
  {
    id: 'bitmap',
    label: 'Bitmap',
    description: 'Low-resolution graphic raster with hard thresholding.',
    patch: { ...cleanPatch, imageLook: 'threshold', imageThreshold: 54, imageContrast: 138, imageSaturation: 0 },
    effects: [
      { type: 'pixelate', amount: 68, scale: 8, tone: 'black' },
      { type: 'dither', amount: 52, scale: 4, tone: 'black' },
    ],
  },
  {
    id: 'scan-error',
    label: 'Scan error',
    description: 'Horizontal scan displacement with digital registration noise.',
    patch: { ...cleanPatch, imageLook: 'hard', imageContrast: 114, imageSaturation: 110 },
    effects: [
      { type: 'displace', amount: 62, scale: 10, tone: 'black' },
      { type: 'scanlines', amount: 38, scale: 4, tone: 'black' },
      { type: 'chromatic', amount: 34, scale: 5, tone: 'blue' },
    ],
  },
];

export const createPresetEffects = (
  preset: ProcessingPresetDefinition,
): CutImageEffect[] =>
  preset.effects.map((effect, index) => ({
    id: `${preset.id}-${effect.type}-${index}-${Date.now()}`,
    enabled: true,
    ...effect,
  }));

export const getProcessingPreset = (
  id: CutProcessingPreset,
): ProcessingPresetDefinition | undefined =>
  processingPresets.find((preset) => preset.id === id);
