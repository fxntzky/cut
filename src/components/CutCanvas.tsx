import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  CSSProperties,
} from 'react';

import type {
  CutComposition,
  CutImageEffect,
} from '../types/cut';

export interface ImagePanAvailability {
  x: boolean;
  y: boolean;
}

interface CutCanvasProps {
  composition: CutComposition;
  imageSrc: string | null;
  motionPaused: boolean;
  onImagePanAvailabilityChange?: (
    availability: ImagePanAvailability
  ) => void;
}

type CanvasStyle =
  CSSProperties & {
    '--cut-image-x': string;
    '--cut-image-y': string;
    '--cut-image-filter': string;
    '--cut-image-tone': string;
    '--cut-image-grain-opacity': string;
    '--cut-image-halftone-size': string;
    '--cut-motion-duration': string;
    '--cut-title-color': string;
    '--cut-subtitle-color': string;
    '--cut-title-scale': string;
    '--cut-title-tracking': string;
    '--cut-title-line-height': string;
    '--cut-title-width': string;
    '--cut-title-align': string;
    '--cut-subtitle-scale': string;
    '--cut-subtitle-size': string;
    '--cut-subtitle-tracking': string;
    '--cut-subtitle-line-height': string;
    '--cut-subtitle-width': string;
    '--cut-subtitle-align': string;
    '--cut-subtitle-lines': string;
    '--cut-graphic-color': string;
    '--cut-graphic-spacing': string;
    '--cut-graphic-scale': string;
    '--cut-graphic-rotation': string;
  };

type WordStyle =
  CSSProperties & {
    '--cut-word-index': number;
  };

type EffectLayerStyle =
  CSSProperties & {
    '--cut-effect-amount': string;
    '--cut-effect-scale': string;
    '--cut-effect-tone': string;
  };

const getEffectLayerStyle = (
  effect: CutImageEffect
): EffectLayerStyle => ({
  '--cut-effect-amount': String(effect.amount / 100),
  '--cut-effect-scale': `${effect.scale}px`,
  '--cut-effect-tone': TYPE_COLORS[effect.tone],
});

const TYPE_COLORS = {
  auto: 'var(--canvas-fg)',
  yellow: '#d5b936',
  violet: '#7664a8',
  pink: '#c3728d',
  red: '#b9534d',
  blue: '#557f93',
  green: '#687f5e',
  orange: '#be7b49',
} as const;

const getImageFilter = (
  composition: CutComposition
): string => {
  const exposure =
    Math.max(
      0.45,
      (100 + composition.imageExposure) / 100
    );

  let brightness = exposure;
  let contrast =
    composition.imageContrast / 100;
  let saturation =
    composition.imageSaturation / 100;
  let grayscale = 0;
  const sepia = 0;

  switch (composition.imageLook) {
    case 'mono':
      grayscale = 1;
      contrast *= 1.08;
      break;

    case 'matte':
      brightness *= 1.04;
      contrast *= 0.88;
      saturation *= 0.76;
      break;

    case 'hard':
      contrast *= 1.5;
      saturation *= 0.86;
      break;

    case 'faded':
      brightness *= 1.08;
      contrast *= 0.78;
      saturation *= 0.62;
      break;

    case 'duotone':
      grayscale = 1;
      contrast *= 1.16;
      break;

    case 'threshold': {
      grayscale = 1;
      contrast *= 7.5;
      const thresholdShift =
        (50 - composition.imageThreshold) / 100;
      brightness *=
        Math.max(0.55, 1 + thresholdShift);
      break;
    }

    case 'halftone':
      grayscale = 0.9;
      contrast *= 1.38;
      saturation *= 0.55;
      break;

    case 'xerox':
      grayscale = 1;
      contrast *= 3.1;
      saturation = 0;
      brightness *= 1.02;
      break;

    default:
      break;
  }

  return [
    `brightness(${brightness.toFixed(3)})`,
    `contrast(${contrast.toFixed(3)})`,
    `saturate(${saturation.toFixed(3)})`,
    `grayscale(${grayscale})`,
    `sepia(${sepia})`,
  ].join(' ');
};

const CutCanvas =
  forwardRef<
    HTMLDivElement,
    CutCanvasProps
  >(
    (
      {
        composition,
        imageSrc,
        motionPaused,
        onImagePanAvailabilityChange,
      },
      ref
    ) => {
      const frameRef =
        useRef<HTMLDivElement>(null);

      const imageZoneRef =
        useRef<HTMLDivElement>(null);

      const imageRef =
        useRef<HTMLImageElement>(null);

      const titleContentRef =
        useRef<HTMLSpanElement>(null);

      const [
        fittedTitleScale,
        setFittedTitleScale,
      ] = useState(
        composition.titleScale / 100
      );

      const titleWords =
        useMemo(
          () =>
            (composition.title ||
              'YOUR TITLE')
              .trim()
              .split(/\s+/)
              .filter(Boolean),
          [composition.title]
        );

      const subtitleColor =
        composition.subtitleColor ===
        'title'
          ? TYPE_COLORS[
              composition.typeColor
            ]
          : composition.subtitleColor ===
              'ink'
            ? 'var(--canvas-fg)'
            : composition.subtitleColor ===
                'muted'
              ? 'color-mix(in srgb, var(--canvas-fg) 52%, transparent)'
              : 'var(--canvas-muted)';

      const canvasStyle: CanvasStyle = {
        '--cut-image-x':
          `${composition.imagePositionX}%`,
        '--cut-image-y':
          `${composition.imagePositionY}%`,
        '--cut-image-filter':
          getImageFilter(composition),
        '--cut-image-tone':
          TYPE_COLORS[composition.imageTone],
        '--cut-image-grain-opacity':
          String(composition.imageGrain / 100),
        '--cut-image-halftone-size':
          `${composition.imageHalftoneSize}px`,
        '--cut-motion-duration':
          `${composition.motionDuration}s`,
        '--cut-title-color':
          TYPE_COLORS[
            composition.typeColor
          ],
        '--cut-subtitle-color':
          subtitleColor,
        '--cut-title-scale':
          String(fittedTitleScale),
        '--cut-title-tracking':
          `${composition.titleTracking / 100}em`,
        '--cut-title-line-height':
          String(composition.titleLineHeight / 100),
        '--cut-title-width':
          `${composition.titleWidth}%`,
        '--cut-title-align':
          composition.titleAlign,
        '--cut-subtitle-scale':
          String(composition.subtitleScale / 100),
        '--cut-subtitle-size':
          `clamp(${(0.64 * composition.subtitleScale / 100).toFixed(3)}rem, ${(1.02 * composition.subtitleScale / 100).toFixed(3)}cqw, ${(0.98 * composition.subtitleScale / 100).toFixed(3)}rem)`,
        '--cut-subtitle-tracking':
          `${composition.subtitleTracking / 100}em`,
        '--cut-subtitle-line-height':
          String(composition.subtitleLineHeight / 100),
        '--cut-subtitle-width':
          `${composition.subtitleWidth}%`,
        '--cut-subtitle-align':
          composition.subtitleAlign,
        '--cut-subtitle-lines':
          String(composition.subtitleMaxLines),
        '--cut-graphic-color':
          TYPE_COLORS[
            composition.graphicColor
          ],
        '--cut-graphic-spacing':
          `${Math.round(44 - ((composition.graphicDensity - 15) / 85) * 34)}px`,
        '--cut-graphic-scale':
          String(composition.graphicScale / 100),
        '--cut-graphic-rotation':
          `${composition.graphicRotation}deg`,
      };

      const updatePanAvailability =
        useCallback(() => {
          const zone =
            imageZoneRef.current;

          const image =
            imageRef.current;

          if (
            !zone ||
            !image ||
            !image.naturalWidth ||
            !image.naturalHeight
          ) {
            onImagePanAvailabilityChange?.({
              x: false,
              y: false,
            });

            return;
          }

          const zoneRect =
            zone.getBoundingClientRect();

          if (
            zoneRect.width <= 0 ||
            zoneRect.height <= 0
          ) {
            return;
          }

          const scale = Math.max(
            zoneRect.width /
              image.naturalWidth,
            zoneRect.height /
              image.naturalHeight
          );

          const renderedWidth =
            image.naturalWidth * scale;

          const renderedHeight =
            image.naturalHeight * scale;

          const threshold = 1.5;

          onImagePanAvailabilityChange?.({
            x:
              renderedWidth -
                zoneRect.width >
              threshold,
            y:
              renderedHeight -
                zoneRect.height >
              threshold,
          });
        }, [
          onImagePanAvailabilityChange,
        ]);

      const updateTitleFit =
        useCallback(() => {
          const frame =
            frameRef.current;

          const title =
            titleContentRef.current;

          const requestedScale =
            composition.titleScale / 100;

          if (!frame || !title) {
            setFittedTitleScale(
              requestedScale
            );
            return;
          }

          const previousTransform =
            title.style.transform;

          title.style.transform =
            'none';

          const frameRect =
            frame.getBoundingClientRect();

          const titleRect =
            title.getBoundingClientRect();

          title.style.transform =
            previousTransform;

          if (
            titleRect.width <= 0 ||
            titleRect.height <= 0
          ) {
            setFittedTitleScale(
              requestedScale
            );
            return;
          }

          const safeInset = Math.max(
            6,
            frameRect.width * 0.018
          );

          const availableWidth =
            frameRect.right -
            safeInset -
            titleRect.left;

          const availableHeight =
            frameRect.bottom -
            safeInset -
            titleRect.top;

          const widthScale =
            availableWidth /
            titleRect.width;

          const heightScale =
            availableHeight /
            titleRect.height;

          const safetyAllowance =
            composition.autoFitTitle
              ? 1
              : 1.045;

          const safeScale = Math.max(
            0.44,
            Math.min(
              requestedScale,
              widthScale * safetyAllowance,
              heightScale * safetyAllowance
            )
          );

          setFittedTitleScale(
            Number(
              safeScale.toFixed(3)
            )
          );
        }, [
          composition.autoFitTitle,
          composition.titleScale,
        ]);

      useEffect(() => {
        const zone =
          imageZoneRef.current;

        if (!zone || !imageSrc) {
          onImagePanAvailabilityChange?.({
            x: false,
            y: false,
          });

          return;
        }

        const observer =
          new ResizeObserver(() => {
            requestAnimationFrame(
              updatePanAvailability
            );
          });

        observer.observe(zone);

        requestAnimationFrame(
          updatePanAvailability
        );

        return () =>
          observer.disconnect();
      }, [
        imageSrc,
        composition.layout,
        composition.ratio,
        updatePanAvailability,
        onImagePanAvailabilityChange,
      ]);

      useLayoutEffect(() => {
        const frame =
          frameRef.current;

        const title =
          titleContentRef.current;

        if (!frame || !title) {
          return;
        }

        const run = () =>
          requestAnimationFrame(
            updateTitleFit
          );

        const observer =
          new ResizeObserver(run);

        observer.observe(frame);
        observer.observe(title);
        run();

        return () =>
          observer.disconnect();
      }, [
        composition.title,
        composition.layout,
        composition.ratio,
        composition.titleStyle,
        composition.subtitle,
        composition.titleScale,
        composition.titleTracking,
        composition.titleLineHeight,
        composition.titleWidth,
        composition.titleAlign,
        composition.titleCase,
        composition.autoFitTitle,
        updateTitleFit,
      ]);

      return (
        <div
          ref={ref}
          className={[
            'cut-canvas',
            `cut-canvas--${composition.layout}`,
            `cut-canvas--ratio-${composition.ratio.replace(':', '-')}`,
            `cut-canvas--${composition.theme}`,
            `cut-canvas--title-${composition.titleStyle}`,
            `cut-canvas--subtitle-${composition.subtitleStyle}`,
            `cut-canvas--subtitle-color-${composition.subtitleColor}`,
            `cut-canvas--type-${composition.typeColor}`,
            `cut-canvas--title-case-${composition.titleCase}`,
            `cut-canvas--image-${composition.imageLook}`,
            `cut-canvas--graphic-${composition.graphicStyle}`,
            composition.motionMode ===
            'loop'
              ? 'cut-canvas--motion-loop'
              : 'cut-canvas--motion-static',
            composition.motionMode ===
            'loop'
              ? `cut-canvas--motion-${composition.motionStyle}`
              : '',
            motionPaused
              ? 'is-motion-paused'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={canvasStyle}
        >
          <div
            ref={frameRef}
            className='cut-canvas__frame'
          >
            <div
              ref={imageZoneRef}
              className='cut-canvas__image-zone'
            >
              {imageSrc ? (
                <>
                  <img
                    ref={imageRef}
                    className='cut-canvas__image'
                    src={imageSrc}
                    alt=''
                    onLoad={() =>
                      requestAnimationFrame(
                        updatePanAvailability
                      )
                    }
                  />

                  <div
                    className='cut-canvas__image-effects'
                    aria-hidden='true'
                  />

                  {composition.imageEffects.length > 0 && (
                    <div
                      className='cut-canvas__effect-stack'
                      aria-hidden='true'
                    >
                      {composition.imageEffects
                        .filter((effect) => effect.enabled)
                        .map((effect) => (
                          <div
                            key={effect.id}
                            className={`cut-canvas__effect-layer cut-canvas__effect-layer--${effect.type}`}
                            style={getEffectLayerStyle(effect)}
                          >
                            {(effect.type === 'posterize' ||
                              effect.type === 'xerox' ||
                              effect.type === 'chromatic' ||
                              effect.type === 'invert') && (
                              <img
                                src={imageSrc}
                                alt=''
                                className='cut-canvas__effect-image'
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <div className='cut-canvas__placeholder'>
                  <span>
                    DROP IMAGE
                  </span>
                </div>
              )}
            </div>

            {composition.graphicStyle !==
              'none' && (
              <div
                className='cut-canvas__graphic'
                aria-hidden='true'
              />
            )}

            <div className='cut-canvas__copy'>
              <span className='cut-canvas__mark'>
                CUT /
                {composition.layout.toUpperCase()}
              </span>

              <h1 className='cut-canvas__title'>
                <span
                  ref={titleContentRef}
                  className='cut-canvas__title-content'
                >
                  {titleWords.map(
                    (word, index) => (
                      <span
                        key={`${word}-${index}`}
                        className='cut-canvas__title-token'
                      >
                        <span
                          className='cut-canvas__title-word'
                          style={
                            {
                              '--cut-word-index':
                                index,
                            } as WordStyle
                          }
                        >
                          {word}
                        </span>

                        {index <
                        titleWords.length - 1 && (
                          <span
                            className='cut-canvas__title-space'
                            aria-hidden='true'
                          >
                            {' '}
                          </span>
                        )}
                      </span>
                    )
                  )}
                </span>
              </h1>

              <p className='cut-canvas__subtitle'>
                {composition.subtitle ||
                  'A short line can change the entire composition.'}
              </p>

              <div className='cut-canvas__meta'>
                <span>
                  EDITION 001
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

CutCanvas.displayName =
  'CutCanvas';

export default CutCanvas;
