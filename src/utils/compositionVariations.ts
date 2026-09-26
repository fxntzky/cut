import {
  getValidLayouts,
} from '../data/layouts';

import {
  getCompositionSystem,
} from '../data/compositionSystems';

import type {
  CutComposition,
  CutLayout,
} from '../types/cut';

import {
  normalizeComposition,
} from './constraints';

const chooseLayout = (
  base: CutComposition,
  preferred: CutLayout
): CutLayout => {
  const valid = getValidLayouts(
    base.ratio,
    base.title.length
  );

  return valid.includes(preferred)
    ? preferred
    : valid[0];
};

export const generateCompositionVariations = (
  base: CutComposition
): CutComposition[] => {
  const recipes: Array<{
    system: CutComposition['compositionSystem'];
    layout: CutLayout;
    titleStyle: CutComposition['titleStyle'];
    titleAlign: CutComposition['titleAlign'];
    titleWidth: number;
    titleScale: number;
    tracking: number;
    imageX: number;
    imageY: number;
  }> = [
    {
      system: 'modular',
      layout: 'split',
      titleStyle: 'editorial',
      titleAlign: 'left',
      titleWidth: 88,
      titleScale: 102,
      tracking: -3,
      imageX: 46,
      imageY: 50,
    },
    {
      system: 'radial',
      layout: 'poster',
      titleStyle: 'massive',
      titleAlign: 'center',
      titleWidth: 82,
      titleScale: 112,
      tracking: -6,
      imageX: 50,
      imageY: 44,
    },
    {
      system: 'axis',
      layout: 'offset',
      titleStyle: 'wide',
      titleAlign: 'right',
      titleWidth: 76,
      titleScale: 98,
      tracking: 2,
      imageX: 60,
      imageY: 50,
    },
    {
      system: 'golden',
      layout: 'frame',
      titleStyle: 'stacked',
      titleAlign: 'left',
      titleWidth: 72,
      titleScale: 96,
      tracking: -2,
      imageX: 42,
      imageY: 48,
    },
  ];

  return recipes.map((recipe) => {
    const system = getCompositionSystem(recipe.system);

    return normalizeComposition({
      ...base,
      ...system.patch,
      compositionSystem: recipe.system,
      layout: chooseLayout(base, recipe.layout),
      titleStyle: recipe.titleStyle,
      titleAlign: recipe.titleAlign,
      titleWidth: recipe.titleWidth,
      titleScale: recipe.titleScale,
      titleTracking: recipe.tracking,
      imagePositionX: recipe.imageX,
      imagePositionY: recipe.imageY,
    });
  });
};
