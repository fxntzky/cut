import {
  useRef,
  useState,
} from 'react';

import type {
  CSSProperties,
  ChangeEvent,
} from 'react';

import {
  getRandomLayout,
  getRandomTitleStyle,
  getValidLayouts,
} from '../data/layouts';

import type {
  CutComposition,
  ExportFormat,
} from '../types/cut';

import {
  exportArtwork,
} from '../utils/exportArtwork';

import {
  prepareImage,
} from '../utils/prepareImage';

import CutCanvas from './CutCanvas';

import type {
  ImagePanAvailability,
} from './CutCanvas';
import CutControls from './CutControls';

const initialComposition: CutComposition = {
  title:
    'MAKE THE IMAGE SPEAK',

  subtitle:
    'CUT turns a few editorial rules into a working composition system.',

  layout:
    'split',

  ratio:
    '4:5',

  theme:
    'light',

  titleStyle:
    'massive',

  subtitleStyle:
    'deck',

  subtitleColor:
    'auto',

  typeColor:
    'auto',

  titleScale:
    100,

  autoFitTitle:
    true,

  titleTracking:
    -7,

  titleLineHeight:
    83,

  titleWidth:
    100,

  titleAlign:
    'left',

  titleCase:
    'auto',

  subtitleScale:
    100,

  subtitleTracking:
    0,

  subtitleLineHeight:
    125,

  subtitleWidth:
    100,

  subtitleAlign:
    'left',

  subtitleMaxLines:
    4,

  imagePositionX:
    50,

  imagePositionY:
    50,

  imageLook:
    'original',

  imageExposure:
    0,

  imageContrast:
    100,

  imageSaturation:
    100,

  imageGrain:
    0,

  imageTone:
    'yellow',

  imageThreshold:
    52,

  imageHalftoneSize:
    6,

  motionMode:
    'static',

  motionStyle:
    'reveal',

  motionDuration:
    6,

  graphicStyle:
    'none',

  graphicColor:
    'yellow',

  graphicDensity:
    50,

  graphicScale:
    50,

  graphicRotation:
    0,
};

type ZoomStyle =
  CSSProperties & {
    zoom?: number;
  };

const CutEditor = () => {
  const [
    composition,
    setComposition,
  ] = useState<CutComposition>(
    initialComposition
  );

  const [
    imageSrc,
    setImageSrc,
  ] = useState<string | null>(
    null
  );

  const [
    isExporting,
    setIsExporting,
  ] = useState(false);

  const [
    saveMessage,
    setSaveMessage,
  ] = useState('');

  const [
    zoom,
    setZoom,
  ] = useState(100);

  const [
    motionPaused,
    setMotionPaused,
  ] = useState(false);

  const [
    imagePanAvailability,
    setImagePanAvailability,
  ] = useState<ImagePanAvailability>({
    x: false,
    y: false,
  });

  const canvasRef =
    useRef<HTMLDivElement>(null);

  const viewportRef =
    useRef<HTMLDivElement>(null);

  const handleCompositionChange = (
    next: Partial<CutComposition>
  ) => {
    setComposition(
      (current) => {
        const candidate = {
          ...current,
          ...next,
        };

        const validLayouts =
          getValidLayouts(
            candidate.ratio,
            candidate.title.length
          );

        if (
          !validLayouts.includes(
            candidate.layout
          )
        ) {
          candidate.layout =
            validLayouts[0];
        }

        return candidate;
      }
    );

    if (
      next.motionMode ||
      next.motionStyle
    ) {
      setMotionPaused(false);
    }

    setSaveMessage('');
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const preparedImage =
        await prepareImage(
          file
        );

      setImageSrc(
        preparedImage
      );

      setSaveMessage('');
    } catch (error) {
      console.error(
        'CUT image preparation failed:',
        error
      );

      setSaveMessage(
        'Could not prepare this image.'
      );
    } finally {
      event.target.value =
        '';
    }
  };

  const handleRandomize = () => {
    setComposition(
      (current) => ({
        ...current,

        layout:
          getRandomLayout(
            current.ratio,
            current.title.length,
            current.layout
          ),

        titleStyle:
          getRandomTitleStyle(
            current.titleStyle
          ),

        imagePositionX:
          Math.floor(
            30 +
              Math.random() * 41
          ),

        imagePositionY:
          Math.floor(
            25 +
              Math.random() * 51
          ),

        titleScale:
          Math.floor(
            88 +
              Math.random() * 25
          ),
      })
    );

    setSaveMessage('');
  };

  const withFrozenMotion = async (
    task: () => Promise<void>
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.classList.add(
      'cut-canvas--exporting'
    );

    await new Promise<void>(
      (resolve) =>
        requestAnimationFrame(
          () => resolve()
        )
    );

    try {
      await task();
    } finally {
      canvas.classList.remove(
        'cut-canvas--exporting'
      );
    }
  };

  const handleSavePoster = async () => {
    if (
      !canvasRef.current ||
      isExporting
    ) {
      return;
    }

    try {
      setIsExporting(true);

      await withFrozenMotion(
        () =>
          exportArtwork(
            canvasRef.current!,
            'png'
          )
      );

      setSaveMessage(
        'Poster downloaded as PNG.'
      );
    } catch (error) {
      console.error(
        'CUT poster export failed:',
        error
      );

      setSaveMessage(
        'Could not download the poster.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async (
    format: ExportFormat
  ) => {
    if (
      !canvasRef.current ||
      isExporting
    ) {
      return;
    }

    try {
      setIsExporting(true);

      await withFrozenMotion(
        () =>
          exportArtwork(
            canvasRef.current!,
            format
          )
      );
    } catch (error) {
      console.error(
        'CUT export failed:',
        error
      );

      setSaveMessage(
        'Could not export the poster.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleMotionPlayback =
    () => {
      if (
        composition.motionMode ===
        'static'
      ) {
        return;
      }

      setMotionPaused(
        (current) => !current
      );
    };

  const setSafeZoom = (
    nextZoom: number
  ) => {
    setZoom(
      Math.min(
        160,
        Math.max(
          40,
          Math.round(nextZoom)
        )
      )
    );
  };

  const handleZoomOut =
    () =>
      setSafeZoom(
        zoom - 10
      );

  const handleZoomIn =
    () =>
      setSafeZoom(
        zoom + 10
      );

  const handleFit =
    () => {
      const canvas =
        canvasRef.current;

      const viewport =
        viewportRef.current;

      if (
        !canvas ||
        !viewport
      ) {
        setZoom(100);
        return;
      }

      const canvasRect =
        canvas.getBoundingClientRect();

      const viewportRect =
        viewport.getBoundingClientRect();

      const currentScale =
        zoom / 100;

      const baseWidth =
        canvasRect.width /
        currentScale;

      const baseHeight =
        canvasRect.height /
        currentScale;

      const availableWidth =
        Math.max(
          120,
          viewportRect.width - 56
        );

      const availableHeight =
        Math.max(
          120,
          viewportRect.height - 56
        );

      const fitScale =
        Math.min(
          availableWidth /
            baseWidth,
          availableHeight /
            baseHeight
        );

      setSafeZoom(
        fitScale * 100
      );
    };

  const zoomStyle: ZoomStyle = {
    zoom:
      zoom / 100,
  };

  return (
    <main className='cut-editor'>
      <CutControls
        composition={
          composition
        }
        isExporting={
          isExporting
        }
        saveMessage={
          saveMessage
        }
        motionPaused={
          motionPaused
        }
        imagePanAvailability={
          imagePanAvailability
        }
        onCompositionChange={
          handleCompositionChange
        }
        onImageChange={
          handleImageChange
        }
        onRandomize={
          handleRandomize
        }
        onToggleMotionPlayback={
          handleToggleMotionPlayback
        }
        onSavePoster={
          handleSavePoster
        }
        onExport={
          handleExport
        }
      />

      <section className='cut-stage'>
        <div className='cut-stage__topbar'>
          <span>
            LIVE COMPOSITION
          </span>

          <span>
            {composition.layout.toUpperCase()}
            {' / '}
            {composition.ratio}
            {' / '}
            {composition.motionMode ===
            'loop'
              ? `${composition.motionStyle.toUpperCase()} / ${composition.motionDuration}S`
              : 'STATIC'}
          </span>
        </div>

        <div
          ref={viewportRef}
          className='cut-stage__viewport'
        >
          <div
            className='cut-stage__canvas-shell'
            style={zoomStyle}
          >
            <CutCanvas
              ref={canvasRef}
              composition={
                composition
              }
              imageSrc={
                imageSrc
              }
              motionPaused={
                motionPaused
              }
              onImagePanAvailabilityChange={
                setImagePanAvailability
              }
            />
          </div>
        </div>

        <div className='cut-stage__zoom'>
          <button
            type='button'
            onClick={
              handleZoomOut
            }
            aria-label='Zoom out'
          >
            −
          </button>

          <button
            type='button'
            className='cut-stage__zoom-value'
            onClick={() =>
              setZoom(100)
            }
            title='Reset to 100%'
          >
            {zoom}%
          </button>

          <button
            type='button'
            onClick={
              handleZoomIn
            }
            aria-label='Zoom in'
          >
            +
          </button>

          <button
            type='button'
            onClick={
              handleFit
            }
          >
            FIT
          </button>
        </div>
      </section>
    </main>
  );
};

export default CutEditor;
