import {
  forwardRef,
} from 'react';

import type {
  CSSProperties,
} from 'react';

import type {
  CutComposition,
} from '../types/cut';

interface CutCanvasProps {
  composition: CutComposition;
  imageSrc: string | null;
}

type CanvasStyle =
  CSSProperties & {
    '--cut-image-x': string;
    '--cut-image-y': string;
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
      },
      ref
    ) => {
      const canvasStyle: CanvasStyle = {
        '--cut-image-x':
          `${composition.imagePositionX}%`,
        '--cut-image-y':
          `${composition.imagePositionY}%`,
      };

      return (
        <div
          ref={ref}
          className={[
            'cut-canvas',
            `cut-canvas--${composition.layout}`,
            `cut-canvas--ratio-${composition.ratio.replace(':', '-')}`,
            `cut-canvas--${composition.theme}`,
            `cut-canvas--title-${composition.titleStyle}`,
          ].join(' ')}
          style={canvasStyle}
        >
          <div className='cut-canvas__frame'>
            <div className='cut-canvas__image-zone'>
              {imageSrc ? (
                <img
                  className='cut-canvas__image'
                  src={imageSrc}
                  alt=''
                />
              ) : (
                <div className='cut-canvas__placeholder'>
                  <span>
                    DROP IMAGE
                  </span>
                </div>
              )}
            </div>

            <div className='cut-canvas__copy'>
              <span className='cut-canvas__mark'>
                CUT /
                {composition.layout.toUpperCase()}
              </span>

              <h1>
                {composition.title ||
                  'YOUR TITLE'}
              </h1>

              <p>
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
