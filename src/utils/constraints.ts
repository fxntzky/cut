import type {
  CutComposition,
  CutLayout,
  CutRatio,
  CutTitleStyle,
} from '../types/cut';

export interface NumericConstraint {
  min: number;
  max: number;
}

export interface CompositionLimits {
  titleScale: NumericConstraint;
  titleTracking: NumericConstraint;
  titleLineHeight: NumericConstraint;
  titleWidth: NumericConstraint;
  subtitleScale: NumericConstraint;
  subtitleTracking: NumericConstraint;
  subtitleLineHeight: NumericConstraint;
  subtitleWidth: NumericConstraint;
  subtitleMaxLines: NumericConstraint;
  imagePositionX: NumericConstraint;
  imagePositionY: NumericConstraint;
}

const clamp = (
  value: number,
  { min, max }: NumericConstraint
) => Math.min(max, Math.max(min, value));

const ratioLimits: Record<
  CutRatio,
  Pick<
    CompositionLimits,
    | 'titleScale'
    | 'titleWidth'
    | 'titleTracking'
    | 'titleLineHeight'
    | 'subtitleWidth'
    | 'subtitleMaxLines'
  >
> = {
  '1:1': {
    titleScale: { min: 72, max: 122 },
    titleWidth: { min: 42, max: 100 },
    titleTracking: { min: -8, max: 18 },
    titleLineHeight: { min: 72, max: 124 },
    subtitleWidth: { min: 34, max: 100 },
    subtitleMaxLines: { min: 2, max: 5 },
  },
  '4:5': {
    titleScale: { min: 72, max: 118 },
    titleWidth: { min: 42, max: 100 },
    titleTracking: { min: -8, max: 16 },
    titleLineHeight: { min: 72, max: 122 },
    subtitleWidth: { min: 34, max: 96 },
    subtitleMaxLines: { min: 2, max: 5 },
  },
  '16:9': {
    titleScale: { min: 70, max: 130 },
    titleWidth: { min: 40, max: 100 },
    titleTracking: { min: -8, max: 24 },
    titleLineHeight: { min: 70, max: 130 },
    subtitleWidth: { min: 30, max: 100 },
    subtitleMaxLines: { min: 2, max: 6 },
  },
  '9:16': {
    titleScale: { min: 70, max: 106 },
    titleWidth: { min: 44, max: 86 },
    titleTracking: { min: -8, max: 10 },
    titleLineHeight: { min: 74, max: 116 },
    subtitleWidth: { min: 38, max: 88 },
    subtitleMaxLines: { min: 2, max: 4 },
  },
};

const layoutTitleWidthMax: Record<CutLayout, number> = {
  split: 100,
  bleed: 94,
  column: 92,
  offset: 88,
  poster: 92,
  frame: 90,
  sidebar: 84,
  headline: 96,
};

const layoutTitleScaleMax: Record<CutLayout, number> = {
  split: 118,
  bleed: 124,
  column: 112,
  offset: 116,
  poster: 126,
  frame: 114,
  sidebar: 106,
  headline: 120,
};

const treatmentTitleWidthMax: Record<
  CutTitleStyle,
  number
> = {
  massive: 94,
  editorial: 100,
  stacked: 76,
  outline: 96,
  quiet: 90,
  lowercase: 96,
  wide: 90,
  boxed: 90,
  compressed: 100,
  tall: 84,
  label: 88,
  banner: 100,
};

const treatmentTitleScaleMax: Record<
  CutTitleStyle,
  number
> = {
  massive: 124,
  editorial: 116,
  stacked: 112,
  outline: 120,
  quiet: 108,
  lowercase: 118,
  wide: 112,
  boxed: 112,
  compressed: 126,
  tall: 112,
  label: 106,
  banner: 104,
};

const longTitlePenalty = (
  titleLength: number
): number => {
  if (titleLength > 64) return 18;
  if (titleLength > 48) return 12;
  if (titleLength > 34) return 7;
  return 0;
};

export const getCompositionLimits = (
  composition: Pick<
    CutComposition,
    | 'ratio'
    | 'layout'
    | 'titleStyle'
    | 'title'
    | 'subtitle'
  >
): CompositionLimits => {
  const ratio = ratioLimits[composition.ratio];
  const titleLength = composition.title.trim().length;
  const subtitleLength = composition.subtitle.trim().length;
  const penalty = longTitlePenalty(titleLength);

  let titleScaleMax = Math.min(
    ratio.titleScale.max,
    layoutTitleScaleMax[composition.layout],
    treatmentTitleScaleMax[composition.titleStyle]
  );

  let titleWidthMax = Math.min(
    ratio.titleWidth.max,
    layoutTitleWidthMax[composition.layout],
    treatmentTitleWidthMax[composition.titleStyle]
  );

  if (composition.ratio === '9:16') {
    if (
      composition.titleStyle === 'wide' ||
      composition.titleStyle === 'boxed' ||
      composition.titleStyle === 'tall'
    ) {
      titleWidthMax = Math.min(titleWidthMax, 76);
      titleScaleMax = Math.min(titleScaleMax, 100);
    }

    if (composition.titleStyle === 'massive') {
      titleWidthMax = Math.min(titleWidthMax, 82);
      titleScaleMax = Math.min(titleScaleMax, 104);
    }
  }

  if (composition.layout === 'sidebar') {
    titleWidthMax = Math.min(titleWidthMax, 82);
    titleScaleMax = Math.min(titleScaleMax, 102);
  }

  if (composition.layout === 'column') {
    titleWidthMax = Math.min(titleWidthMax, 88);
  }

  titleScaleMax = Math.max(
    ratio.titleScale.min,
    titleScaleMax - penalty
  );

  if (titleLength > 48) {
    titleWidthMax = Math.min(titleWidthMax, 86);
  }

  const subtitleScaleMax =
    subtitleLength > 110
      ? 112
      : subtitleLength > 70
        ? 124
        : 140;

  const subtitleLinesMax = Math.min(
    ratio.subtitleMaxLines.max,
    subtitleLength > 110 ? 4 : 6
  );

  return {
    titleScale: {
      min: ratio.titleScale.min,
      max: titleScaleMax,
    },
    titleTracking: ratio.titleTracking,
    titleLineHeight: ratio.titleLineHeight,
    titleWidth: {
      min: ratio.titleWidth.min,
      max: titleWidthMax,
    },
    subtitleScale: {
      min: 70,
      max: subtitleScaleMax,
    },
    subtitleTracking: {
      min: -4,
      max: composition.ratio === '9:16' ? 14 : 20,
    },
    subtitleLineHeight: {
      min: 92,
      max: composition.ratio === '9:16' ? 158 : 180,
    },
    subtitleWidth: {
      min: ratio.subtitleWidth.min,
      max: ratio.subtitleWidth.max,
    },
    subtitleMaxLines: {
      min: ratio.subtitleMaxLines.min,
      max: subtitleLinesMax,
    },
    imagePositionX: { min: 0, max: 100 },
    imagePositionY: { min: 0, max: 100 },
  };
};

export const normalizeComposition = (
  composition: CutComposition
): CutComposition => {
  const limits = getCompositionLimits(composition);

  return {
    ...composition,
    titleScale: clamp(
      composition.titleScale,
      limits.titleScale
    ),
    titleTracking: clamp(
      composition.titleTracking,
      limits.titleTracking
    ),
    titleLineHeight: clamp(
      composition.titleLineHeight,
      limits.titleLineHeight
    ),
    titleWidth: clamp(
      composition.titleWidth,
      limits.titleWidth
    ),
    subtitleScale: clamp(
      composition.subtitleScale,
      limits.subtitleScale
    ),
    subtitleTracking: clamp(
      composition.subtitleTracking,
      limits.subtitleTracking
    ),
    subtitleLineHeight: clamp(
      composition.subtitleLineHeight,
      limits.subtitleLineHeight
    ),
    subtitleWidth: clamp(
      composition.subtitleWidth,
      limits.subtitleWidth
    ),
    subtitleMaxLines: Math.round(
      clamp(
        composition.subtitleMaxLines,
        limits.subtitleMaxLines
      )
    ),
    imagePositionX: clamp(
      composition.imagePositionX,
      limits.imagePositionX
    ),
    imagePositionY: clamp(
      composition.imagePositionY,
      limits.imagePositionY
    ),
  };
};
