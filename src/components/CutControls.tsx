import type {
  ChangeEvent,
} from 'react';

import {
  layouts,
  titleStyles,
} from '../data/layouts';

import type {
  CutComposition,
  CutLayout,
  CutRatio,
  CutTheme,
  CutTitleStyle,
  ExportFormat,
} from '../types/cut';

interface CutControlsProps {
  composition: CutComposition;
  isExporting: boolean;
  saveMessage: string;
  onCompositionChange: (
    next: Partial<CutComposition>
  ) => void;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRandomize: () => void;
  onSavePoster: () => void;
  onExport: (
    format: ExportFormat
  ) => void;
}

const ratios: CutRatio[] = [
  '1:1',
  '4:5',
  '16:9',
  '9:16',
];

const CutControls = ({
  composition,
  isExporting,
  saveMessage,
  onCompositionChange,
  onImageChange,
  onRandomize,
  onSavePoster,
  onExport,
}: CutControlsProps) => {
  return (
    <aside className='cut-controls'>
      <header className='cut-controls__header'>
        <div>
          <p className='cut-controls__eyebrow'>
            Algorithmic editorial tool
          </p>

          <h1>
            CUT
          </h1>
        </div>

        <span className='cut-controls__version'>
          V1.2.1
        </span>
      </header>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          01 / Content
        </span>

        <label className='cut-field'>
          <span>
            Image
          </span>

          <input
            type='file'
            accept='image/*'
            onChange={onImageChange}
          />
        </label>

        <label className='cut-field'>
          <span>
            Title
          </span>

          <textarea
            value={
              composition.title
            }
            maxLength={80}
            rows={3}
            onChange={(event) =>
              onCompositionChange({
                title:
                  event.target.value,
              })
            }
          />
        </label>

        <label className='cut-field'>
          <span>
            Subtitle
          </span>

          <textarea
            value={
              composition.subtitle
            }
            maxLength={150}
            rows={3}
            onChange={(event) =>
              onCompositionChange({
                subtitle:
                  event.target.value,
              })
            }
          />
        </label>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          02 / Composition
        </span>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Layout
          </span>

          <div className='cut-layout-list'>
            {layouts.map(
              (layout) => (
                <button
                  key={layout.id}
                  type='button'
                  className={
                    composition.layout ===
                    layout.id
                      ? 'is-active'
                      : undefined
                  }
                  title={
                    layout.description
                  }
                  onClick={() =>
                    onCompositionChange({
                      layout:
                        layout.id as CutLayout,
                    })
                  }
                >
                  <span>
                    {layout.number}
                  </span>

                  <strong>
                    {layout.label}
                  </strong>
                </button>
              )
            )}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Ratio
          </span>

          <div className='cut-segmented'>
            {ratios.map(
              (ratio) => (
                <button
                  key={ratio}
                  type='button'
                  className={
                    composition.ratio ===
                    ratio
                      ? 'is-active'
                      : undefined
                  }
                  onClick={() =>
                    onCompositionChange({
                      ratio,
                    })
                  }
                >
                  {ratio}
                </button>
              )
            )}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Title treatment
          </span>

          <div className='cut-title-options'>
            {titleStyles.map(
              (style) => (
                <button
                  key={style.id}
                  type='button'
                  className={
                    composition.titleStyle ===
                    style.id
                      ? 'is-active'
                      : undefined
                  }
                  onClick={() =>
                    onCompositionChange({
                      titleStyle:
                        style.id as CutTitleStyle,
                    })
                  }
                >
                  {style.label}
                </button>
              )
            )}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Theme
          </span>

          <div className='cut-segmented'>
            {(
              [
                'light',
                'dark',
              ] as CutTheme[]
            ).map((theme) => (
              <button
                key={theme}
                type='button'
                className={
                  composition.theme ===
                  theme
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    theme,
                  })
                }
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <button
          type='button'
          className='cut-randomize'
          onClick={onRandomize}
        >
          RANDOMIZE
          <span>
            ↻
          </span>
        </button>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          03 / Image position
        </span>

        <label className='cut-range'>
          <span>
            X
          </span>

          <input
            type='range'
            min='0'
            max='100'
            value={
              composition.imagePositionX
            }
            onChange={(event) =>
              onCompositionChange({
                imagePositionX:
                  Number(
                    event.target.value
                  ),
              })
            }
          />

          <output>
            {composition.imagePositionX}
          </output>
        </label>

        <label className='cut-range'>
          <span>
            Y
          </span>

          <input
            type='range'
            min='0'
            max='100'
            value={
              composition.imagePositionY
            }
            onChange={(event) =>
              onCompositionChange({
                imagePositionY:
                  Number(
                    event.target.value
                  ),
              })
            }
          />

          <output>
            {composition.imagePositionY}
          </output>
        </label>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          04 / Save
        </span>

        <button
          type='button'
          className='cut-save-poster'
          disabled={isExporting}
          onClick={onSavePoster}
        >
          {isExporting
            ? 'SAVING…'
            : 'SAVE POSTER'}
        </button>

        <p>
          {saveMessage ||
            'Downloads the current poster as a high-resolution PNG.'}
        </p>
      </div>

      <div className='cut-controls__section cut-controls__section--export'>
        <span className='cut-controls__section-label'>
          05 / Export format
        </span>

        <div className='cut-export'>
          <button
            type='button'
            disabled={isExporting}
            onClick={() =>
              onExport('png')
            }
          >
            PNG
          </button>

          <button
            type='button'
            disabled={isExporting}
            onClick={() =>
              onExport('webp')
            }
          >
            WEBP
          </button>
        </div>

        <p>
          Exported locally. Nothing leaves your browser.
        </p>
      </div>
    </aside>
  );
};

export default CutControls;
