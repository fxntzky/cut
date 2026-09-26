import type {
  CutComposition,
} from '../types/cut';

export interface CutProjectFile {
  app: 'CUT';
  version: 1;
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
    version: 1,
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
    parsed.version !== 1 ||
    !('composition' in parsed) ||
    typeof parsed.composition !== 'object' ||
    parsed.composition === null
  ) {
    throw new Error('Invalid CUT project file.');
  }

  return parsed as CutProjectFile;
};
