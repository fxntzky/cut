import type {
  CutComposition,
} from '../types/cut';

export interface CutProjectFile {
  app: 'CUT';
  version: 1 | 2;
  savedAt: string;
  composition: CutComposition;
  imageSrc: string | null;
}

const downloadBlob = (
  blob: Blob,
  filename: string
) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export const saveCutProject = (
  composition: CutComposition,
  imageSrc: string | null
) => {
  const project: CutProjectFile = {
    app: 'CUT',
    version: 2,
    savedAt: new Date().toISOString(),
    composition,
    imageSrc,
  };

  const timestamp = project.savedAt
    .slice(0, 19)
    .replaceAll(':', '-');

  downloadBlob(
    new Blob(
      [JSON.stringify(project, null, 2)],
      { type: 'application/json' }
    ),
    `cut-project-${timestamp}.cut.json`
  );
};

export const loadCutProject = async (
  file: File
): Promise<CutProjectFile> => {
  const raw = await file.text();
  const parsed: unknown = JSON.parse(raw);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('app' in parsed) ||
    parsed.app !== 'CUT' ||
    !('version' in parsed) ||
    (parsed.version !== 1 && parsed.version !== 2) ||
    !('composition' in parsed) ||
    typeof parsed.composition !== 'object' ||
    parsed.composition === null
  ) {
    throw new Error('Invalid CUT project file.');
  }

  const project = parsed as CutProjectFile;

  const legacyComposition = project.composition as Omit<
    CutComposition,
    'typeColor' | 'subtitleColor' | 'gridColor' | 'graphicColor'
  > & {
    typeColor?: CutComposition['typeColor'] | 'auto';
    subtitleColor?: CutComposition['subtitleColor'] | 'auto' | 'ink';
    gridColor?: CutComposition['gridColor'] | 'auto';
    graphicColor?: CutComposition['graphicColor'] | 'auto';
  };

  const themeFallback = legacyComposition.theme === 'dark' ? 'white' : 'black';

  return {
    ...project,
    composition: {
      ...legacyComposition,
      typeColor:
        legacyComposition.typeColor === 'auto' || !legacyComposition.typeColor
          ? themeFallback
          : legacyComposition.typeColor,
      subtitleColor:
        legacyComposition.subtitleColor === 'auto' ||
        legacyComposition.subtitleColor === 'ink' ||
        !legacyComposition.subtitleColor
          ? themeFallback
          : legacyComposition.subtitleColor,
      gridColor:
        legacyComposition.gridColor === 'auto' || !legacyComposition.gridColor
          ? themeFallback
          : legacyComposition.gridColor,
      graphicColor:
        legacyComposition.graphicColor === 'auto' || !legacyComposition.graphicColor
          ? themeFallback
          : legacyComposition.graphicColor,
      processingPreset:
        legacyComposition.processingPreset ?? 'custom',
      compositionSystem:
        legacyComposition.compositionSystem ?? 'free',
    },
  };
};
