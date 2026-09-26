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
} from '../types/cut';

import {
  buildImagePasses,
  getImageFilter,
  TYPE_COLORS,
} from '../utils/imageProcessingEngine';

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
    '--cut-grid-color': string;
    '--cut-grid-spacing': string;
    '--cut-grid-opacity': string;
    '--cut-grid-rotation': string;
    '--cut-graphic-color': string;
    '--cut-graphic-spacing': string;
    '--cut-graphic-scale': string;
    '--cut-graphic-rotation': string;
  };

type WordStyle =
  CSSProperties & {
    '--cut-word-index': number;
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
        composition.subtitleColor === 'title'
          ? TYPE_COLORS[composition.typeColor]
          : composition.subtitleColor === 'black'
            ? TYPE_COLORS.black
            : composition.subtitleColor === 'white'
              ? TYPE_COLORS.white
              : 'color-mix(in srgb, var(--canvas-fg) 52%, transparent)';

      const processingPasses = buildImagePasses(
        composition.imageEffects,
      );

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
        '--cut-grid-color':
          TYPE_COLORS[
            composition.gridColor
          ],
        '--cut-grid-spacing':
          `${Math.round(72 - ((composition.gridDensity - 10) / 90) * 58)}px`,
        '--cut-grid-opacity':
          String(composition.gridOpacity / 100),
        '--cut-grid-rotation':
          `${composition.gridRotation}deg`,
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
            `cut-canvas--grid-${composition.gridStyle}`,
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
                      {processingPasses
                        .filter((pass) => pass.enabled)
                        .map((pass) => (
                          <div
                            key={pass.id}
                            className={`cut-canvas__effect-layer cut-canvas__effect-layer--${pass.type}`}
                            style={pass.style}
                          >
                            {pass.needsImage && (
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

            {composition.gridStyle !==
              'none' && (
              <div
                className='cut-canvas__grid'
                aria-hidden='true'
              />
            )}

            {composition.graphicStyle !==
              'none' && (
              <div
                className='cut-canvas__graphic'
                aria-hidden='true'
              >
                <span />
                <i />
              </div>
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
