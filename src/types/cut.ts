export type CutLayout =
  | 'split'
  | 'bleed'
  | 'column'
  | 'offset'
  | 'poster'
  | 'frame'
  | 'sidebar'
  | 'headline';

export type CutRatio =
  | '1:1'
  | '4:5'
  | '16:9'
  | '9:16';

export type CutTheme =
  | 'light'
  | 'dark';

export type CutTitleStyle =
  | 'massive'
  | 'editorial'
  | 'stacked'
  | 'outline'
  | 'quiet'
  | 'lowercase'
  | 'wide'
  | 'boxed'
  | 'compressed'
  | 'tall'
  | 'label'
  | 'banner';

export type CutTextAlign =
  | 'left'
  | 'center'
  | 'right';

export type CutTextCase =
  | 'auto'
  | 'upper'
  | 'lower';

export type CutSubtitleStyle =
  | 'deck'
  | 'caption'
  | 'label'
  | 'rule'
  | 'mono'
  | 'box';

export type CutSubtitleColor =
  | 'auto'
  | 'title'
  | 'ink'
  | 'muted';


export type CutImageLook =
  | 'original'
  | 'mono'
  | 'matte'
  | 'hard'
  | 'faded'
  | 'duotone'
  | 'threshold'
  | 'halftone'
  | 'xerox';

export type CutImageEffectType =
  | 'duotone'
  | 'posterize'
  | 'halftone'
  | 'xerox'
  | 'chromatic'
  | 'scanlines'
  | 'grain'
  | 'invert';

export interface CutImageEffect {
  id: string;
  type: CutImageEffectType;
  enabled: boolean;
  amount: number;
  scale: number;
  tone: CutTypeColor;
}

export type CutMotionMode =
  | 'static'
  | 'loop';

export type CutMotionStyle =
  | 'reveal'
  | 'shift'
  | 'cut'
  | 'scale';

export type CutTypeColor =
  | 'auto'
  | 'yellow'
  | 'violet'
  | 'pink'
  | 'red'
  | 'blue'
  | 'green'
  | 'orange';

export type CutGraphicStyle =
  | 'none'
  | 'grid'
  | 'radial'
  | 'bars'
  | 'dots';

export type ExportFormat =
  | 'png'
  | 'webp';

export interface CutComposition {
  title: string;
  subtitle: string;
  layout: CutLayout;
  ratio: CutRatio;
  theme: CutTheme;
  titleStyle: CutTitleStyle;
  subtitleStyle: CutSubtitleStyle;
  subtitleColor: CutSubtitleColor;
  typeColor: CutTypeColor;
  titleScale: number;
  autoFitTitle: boolean;
  titleTracking: number;
  titleLineHeight: number;
  titleWidth: number;
  titleAlign: CutTextAlign;
  titleCase: CutTextCase;
  subtitleScale: number;
  subtitleTracking: number;
  subtitleLineHeight: number;
  subtitleWidth: number;
  subtitleAlign: CutTextAlign;
  subtitleMaxLines: number;
  imagePositionX: number;
  imagePositionY: number;
  imageLook: CutImageLook;
  imageExposure: number;
  imageContrast: number;
  imageSaturation: number;
  imageGrain: number;
  imageTone: CutTypeColor;
  imageThreshold: number;
  imageHalftoneSize: number;
  imageEffects: CutImageEffect[];
  motionMode: CutMotionMode;
  motionStyle: CutMotionStyle;
  motionDuration: number;
  graphicStyle: CutGraphicStyle;
  graphicColor: CutTypeColor;
  graphicDensity: number;
  graphicScale: number;
  graphicRotation: number;
}
