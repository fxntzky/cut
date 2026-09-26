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
  | 'black'
  | 'white'
  | 'title'
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
  | 'invert'
  | 'dither'
  | 'solarize'
  | 'thermal'
  | 'bloom'
  | 'displace'
  | 'pixelate';

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
  | 'black'
  | 'white'
  | 'yellow'
  | 'violet'
  | 'pink'
  | 'red'
  | 'blue'
  | 'green'
  | 'orange';

export type CutGridStyle =
  | 'none'
  | 'modular'
  | 'columns'
  | 'twelve'
  | 'asymmetric'
  | 'diagonal'
  | 'radial'
  | 'golden'
  | 'nested';

export type CutGraphicStyle =
  | 'none'
  | 'line'
  | 'block'
  | 'circle'
  | 'ring'
  | 'arc'
  | 'cross'
  | 'frame'
  | 'polygon'
  | 'repeat'
  | 'concentric'
  | 'axis';

export type CutCompositionSystem =
  | 'free'
  | 'modular'
  | 'radial'
  | 'axis'
  | 'golden'
  | 'repeat';


export type CutProcessingPreset =
  | 'custom'
  | 'clean'
  | 'brutal-print'
  | 'acid-dither'
  | 'newsroom'
  | 'risograph'
  | 'thermal'
  | 'solarized'
  | 'bleach'
  | 'infrared'
  | 'chroma-burn'
  | 'bitmap'
  | 'scan-error';

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
  processingPreset: CutProcessingPreset;
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
  gridStyle: CutGridStyle;
  gridColor: CutTypeColor;
  gridDensity: number;
  gridOpacity: number;
  gridRotation: number;
  graphicStyle: CutGraphicStyle;
  graphicColor: CutTypeColor;
  graphicDensity: number;
  graphicScale: number;
  graphicRotation: number;
  compositionSystem: CutCompositionSystem;
}
