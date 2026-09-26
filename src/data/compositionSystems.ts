import type {
  CutComposition,
  CutCompositionSystem,
} from '../types/cut';

export interface CompositionSystemPreset {
  id: CutCompositionSystem;
  label: string;
  description: string;
  patch: Partial<CutComposition>;
}

export const compositionSystems: CompositionSystemPreset[] = [
  {
    id: 'free',
    label: 'Free',
    description: 'Independent grid and geometry controls.',
    patch: {
      gridStyle: 'none',
      graphicStyle: 'none',
    },
  },
  {
    id: 'modular',
    label: 'Modular',
    description: 'A modular grid with a structural block anchor.',
    patch: {
      gridStyle: 'modular',
      gridDensity: 58,
      gridOpacity: 24,
      gridRotation: 0,
      graphicStyle: 'block',
      graphicDensity: 44,
      graphicScale: 42,
      graphicRotation: 0,
    },
  },
  {
    id: 'radial',
    label: 'Radial',
    description: 'Radial grid and concentric geometry share one center.',
    patch: {
      gridStyle: 'radial',
      gridDensity: 48,
      gridOpacity: 24,
      gridRotation: 0,
      graphicStyle: 'concentric',
      graphicDensity: 58,
      graphicScale: 62,
      graphicRotation: 0,
    },
  },
  {
    id: 'axis',
    label: 'Axis',
    description: 'Column structure plus a dominant compositional axis.',
    patch: {
      gridStyle: 'columns',
      gridDensity: 52,
      gridOpacity: 22,
      gridRotation: 0,
      graphicStyle: 'axis',
      graphicDensity: 50,
      graphicScale: 72,
      graphicRotation: 0,
    },
  },
  {
    id: 'golden',
    label: 'Golden',
    description: 'Golden-ratio structure with a framing geometry.',
    patch: {
      gridStyle: 'golden',
      gridDensity: 50,
      gridOpacity: 25,
      gridRotation: 0,
      graphicStyle: 'frame',
      graphicDensity: 50,
      graphicScale: 78,
      graphicRotation: 0,
    },
  },
  {
    id: 'repeat',
    label: 'Repeat',
    description: 'Nested structure with repeated geometric rhythm.',
    patch: {
      gridStyle: 'nested',
      gridDensity: 64,
      gridOpacity: 20,
      gridRotation: 0,
      graphicStyle: 'repeat',
      graphicDensity: 66,
      graphicScale: 56,
      graphicRotation: 0,
    },
  },
];

export const getCompositionSystem = (
  id: CutCompositionSystem
) =>
  compositionSystems.find((system) => system.id === id) ??
  compositionSystems[0];
