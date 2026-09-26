import type {
  CutLayout,
  CutRatio,
  CutTitleStyle,
} from '../types/cut';

export interface LayoutDefinition {
  id: CutLayout;
  number: string;
  label: string;
  description: string;
}

export interface TitleStyleDefinition {
  id: CutTitleStyle;
  label: string;
}

export const layouts: LayoutDefinition[] = [
  {
    id: 'split',
    number: '01',
    label: 'Split',
    description:
      'Image and typography share the frame.',
  },
  {
    id: 'bleed',
    number: '02',
    label: 'Bleed',
    description:
      'Full image with type laid over it.',
  },
  {
    id: 'column',
    number: '03',
    label: 'Column',
    description:
      'Editorial image block with a strong text column.',
  },
  {
    id: 'offset',
    number: '04',
    label: 'Offset',
    description:
      'Asymmetry, negative space and displaced image.',
  },
  {
    id: 'poster',
    number: '05',
    label: 'Poster',
    description:
      'Typography first, image as a graphic element.',
  },
  {
    id: 'frame',
    number: '06',
    label: 'Frame',
    description:
      'A contained image with generous editorial margins.',
  },
  {
    id: 'sidebar',
    number: '07',
    label: 'Sidebar',
    description:
      'A narrow copy rail beside a dominant image.',
  },
  {
    id: 'headline',
    number: '08',
    label: 'Headline',
    description:
      'A strong typographic lead with a supporting image.',
  },
];

export const titleStyles: TitleStyleDefinition[] = [
  {
    id: 'massive',
    label: 'Massive',
  },
  {
    id: 'editorial',
    label: 'Editorial',
  },
  {
    id: 'stacked',
    label: 'Stacked',
  },
  {
    id: 'outline',
    label: 'Outline',
  },
  {
    id: 'quiet',
    label: 'Quiet',
  },
  {
    id: 'lowercase',
    label: 'Lower',
  },
  {
    id: 'wide',
    label: 'Wide',
  },
  {
    id: 'boxed',
    label: 'Boxed',
  },
  {
    id: 'compressed',
    label: 'Compressed',
  },
  {
    id: 'tall',
    label: 'Tall',
  },
  {
    id: 'label',
    label: 'Label',
  },
  {
    id: 'banner',
    label: 'Banner',
  },
];

const ratioPreference: Record<
  CutRatio,
  CutLayout[]
> = {
  '1:1': [
    'poster',
    'offset',
    'frame',
    'headline',
    'bleed',
    'column',
    'split',
  ],

  '4:5': [
    'poster',
    'bleed',
    'offset',
    'frame',
    'headline',
    'column',
    'split',
  ],

  '16:9': [
    'split',
    'sidebar',
    'headline',
    'column',
    'bleed',
    'frame',
    'offset',
  ],

  '9:16': [
    'bleed',
    'poster',
    'headline',
    'offset',
    'frame',
  ],
};

export const getValidLayouts = (
  ratio: CutRatio,
  titleLength: number
): CutLayout[] => {
  let candidates =
    ratioPreference[ratio];

  if (titleLength > 44) {
    candidates = candidates.filter(
      (layout) =>
        layout !== 'poster'
    );
  }

  if (titleLength > 62) {
    candidates = candidates.filter(
      (layout) =>
        layout !== 'headline'
    );
  }

  return candidates;
};

export const getRandomLayout = (
  ratio: CutRatio,
  titleLength: number,
  current?: CutLayout
): CutLayout => {
  const candidates =
    getValidLayouts(
      ratio,
      titleLength
    );

  const withoutCurrent =
    candidates.filter(
      (layout) =>
        layout !== current
    );

  const pool =
    withoutCurrent.length > 0
      ? withoutCurrent
      : candidates;

  return pool[
    Math.floor(
      Math.random() * pool.length
    )
  ];
};

export const getRandomTitleStyle = (
  current?: CutTitleStyle
): CutTitleStyle => {
  const pool =
    titleStyles
      .map((style) => style.id)
      .filter(
        (style) =>
          style !== current
      );

  return pool[
    Math.floor(
      Math.random() * pool.length
    )
  ];
};
