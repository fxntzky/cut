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
  | 'lowercase';

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
  imagePositionX: number;
  imagePositionY: number;
}
