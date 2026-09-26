import type {
  ChangeEvent,
} from 'react';

import {
  getValidLayouts,
  layouts,
  titleStyles,
} from '../data/layouts';

import {
  createImageEffect,
  imageEffectCatalog,
} from '../data/imageEffects';

import type {
  CutComposition,
  CutGraphicStyle,
  CutImageEffect,
  CutImageEffectType,
  CutImageLook,
  CutLayout,
  CutMotionMode,
  CutMotionStyle,
  CutRatio,
  CutSubtitleColor,
  CutSubtitleStyle,
  CutTextAlign,
  CutTextCase,
  CutTheme,
  CutTitleStyle,
  CutTypeColor,
  ExportFormat,
} from '../types/cut';

import type {
  ImagePanAvailability,
} from './CutCanvas';

import {
  getCompositionLimits,
} from '../utils/constraints';

interface CutControlsProps {
  composition: CutComposition;
  isExporting: boolean;
  saveMessage: string;
  motionPaused: boolean;
  imagePanAvailability: ImagePanAvailability;
  onCompositionChange: (
    next: Partial<CutComposition>
  ) => void;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRandomize: () => void;
  onToggleMotionPlayback: () => void;
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

const imageLooks: {
  id: CutImageLook;
  label: string;
}[] = [
  { id: 'original', label: 'Original' },
  { id: 'mono', label: 'Mono' },
  { id: 'matte', label: 'Matte' },
  { id: 'hard', label: 'Hard' },
  { id: 'faded', label: 'Faded' },
  { id: 'duotone', label: 'Duotone' },
  { id: 'threshold', label: 'Threshold' },
  { id: 'halftone', label: 'Halftone' },
  { id: 'xerox', label: 'Xerox' },
];

const motionStyles: {
  id: CutMotionStyle;
  label: string;
}[] = [
  {
    id: 'reveal',
    label: 'Reveal',
  },
  {
    id: 'shift',
    label: 'Shift',
  },
  {
    id: 'cut',
    label: 'Cut',
  },
  {
    id: 'scale',
    label: 'Scale',
  },
];

const subtitleStyles: {
  id: CutSubtitleStyle;
  label: string;
}[] = [
  { id: 'deck', label: 'Deck' },
  { id: 'caption', label: 'Caption' },
  { id: 'label', label: 'Label' },
  { id: 'rule', label: 'Rule' },
  { id: 'mono', label: 'Mono' },
  { id: 'box', label: 'Box' },
];

const textAlignments: CutTextAlign[] = [
  'left',
  'center',
  'right',
];

const textCases: {
  id: CutTextCase;
  label: string;
}[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'upper', label: 'Upper' },
  { id: 'lower', label: 'Lower' },
];

const subtitleColors: {
  id: CutSubtitleColor;
  label: string;
}[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'title', label: 'Title' },
  { id: 'ink', label: 'Ink' },
  { id: 'muted', label: 'Muted' },
];

const graphicStyles: {
  id: CutGraphicStyle;
  label: string;
}[] = [
  { id: 'none', label: 'None' },
  { id: 'grid', label: 'Grid' },
  { id: 'radial', label: 'Radial' },
  { id: 'bars', label: 'Bars' },
  { id: 'dots', label: 'Dots' },
];

const typeColors: {
  id: CutTypeColor;
  label: string;
  swatch: string;
}[] = [
  {
    id: 'auto',
    label: 'Auto',
    swatch: 'currentColor',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    swatch: '#d5b936',
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: '#7664a8',
  },
  {
    id: 'pink',
    label: 'Pink',
    swatch: '#c3728d',
  },
  {
    id: 'red',
    label: 'Red',
    swatch: '#b9534d',
  },
  {
    id: 'blue',
    label: 'Blue',
    swatch: '#557f93',
  },
  {
    id: 'green',
    label: 'Green',
    swatch: '#687f5e',
  },
  {
    id: 'orange',
    label: 'Orange',
    swatch: '#be7b49',
  },
];

const CutControls = ({
  composition,
  isExporting,
  saveMessage,
  motionPaused,
  imagePanAvailability,
  onCompositionChange,
  onImageChange,
  onRandomize,
  onToggleMotionPlayback,
  onSavePoster,
  onExport,
}: CutControlsProps) => {
  const validLayouts =
    getValidLayouts(
      composition.ratio,
      composition.title.length
    );

  const limits =
    getCompositionLimits(composition);

  const updateImageEffect = (
    id: string,
    patch: Partial<CutImageEffect>
  ) => {
    onCompositionChange({
      imageEffects: composition.imageEffects.map((effect) =>
        effect.id === id
          ? { ...effect, ...patch }
          : effect
      ),
    });
  };

  const addImageEffect = (type: CutImageEffectType) => {
    const id = `${type}-${Date.now()}-${composition.imageEffects.length}`;

    onCompositionChange({
      imageEffects: [
        ...composition.imageEffects,
        createImageEffect(type, id),
      ].slice(-6),
    });
  };

  const removeImageEffect = (id: string) => {
    onCompositionChange({
      imageEffects: composition.imageEffects.filter(
        (effect) => effect.id !== id
      ),
    });
  };

  const moveImageEffect = (
    index: number,
    direction: -1 | 1
  ) => {
    const target = index + direction;

    if (
      target < 0 ||
      target >= composition.imageEffects.length
    ) {
      return;
    }

    const next = [...composition.imageEffects];
    [next[index], next[target]] = [next[target], next[index]];

    onCompositionChange({ imageEffects: next });
  };

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
          V1.7.0
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
            value={composition.title}
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
            value={composition.subtitle}
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
            {layouts.map((layout) => {
              const isValid =
                validLayouts.includes(
                  layout.id
                );

              return (
                <button
                  key={layout.id}
                  type='button'
                  disabled={!isValid}
                  className={
                    composition.layout ===
                    layout.id
                      ? 'is-active'
                      : undefined
                  }
                  title={
                    isValid
                      ? layout.description
                      : `Not available for ${composition.ratio} with this title length.`
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
              );
            })}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Ratio
          </span>

          <div className='cut-segmented'>
            {ratios.map((ratio) => (
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
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Title treatment
          </span>

          <div className='cut-title-options'>
            {titleStyles.map((style) => (
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
            ))}
          </div>
        </div>

        <label className='cut-range cut-range--wide-label'>
          <span>
            Type
          </span>

          <input
            type='range'
            min={limits.titleScale.min}
            max={limits.titleScale.max}
            step='1'
            value={composition.titleScale}
            onChange={(event) =>
              onCompositionChange({
                titleScale:
                  Number(
                    event.target.value
                  ),
              })
            }
          />

          <output>
            {composition.titleScale}%
          </output>
        </label>

        <button
          type='button'
          className={`cut-fit-toggle ${
            composition.autoFitTitle
              ? 'is-active'
              : ''
          }`}
          onClick={() =>
            onCompositionChange({
              autoFitTitle:
                !composition.autoFitTitle,
            })
          }
        >
          <span>
            AUTO FIT
          </span>
          <strong>
            {composition.autoFitTitle
              ? 'ON'
              : 'OFF'}
          </strong>
        </button>

        <div className='cut-type-grid'>
          <label className='cut-range'>
            <span>Tracking</span>

            <input
              type='range'
              min={limits.titleTracking.min}
              max={limits.titleTracking.max}
              step='1'
              value={composition.titleTracking}
              onChange={(event) =>
                onCompositionChange({
                  titleTracking: Number(event.target.value),
                })
              }
            />

            <output>
              {composition.titleTracking > 0 ? '+' : ''}
              {composition.titleTracking}
            </output>
          </label>

          <label className='cut-range'>
            <span>Leading</span>

            <input
              type='range'
              min={limits.titleLineHeight.min}
              max={limits.titleLineHeight.max}
              step='1'
              value={composition.titleLineHeight}
              onChange={(event) =>
                onCompositionChange({
                  titleLineHeight: Number(event.target.value),
                })
              }
            />

            <output>{composition.titleLineHeight}%</output>
          </label>

          <label className='cut-range'>
            <span>Width</span>

            <input
              type='range'
              min={limits.titleWidth.min}
              max={limits.titleWidth.max}
              step='1'
              value={composition.titleWidth}
              onChange={(event) =>
                onCompositionChange({
                  titleWidth: Number(event.target.value),
                })
              }
            />

            <output>{composition.titleWidth}%</output>
          </label>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Title align
          </span>

          <div className='cut-segmented'>
            {textAlignments.map((align) => (
              <button
                key={align}
                type='button'
                className={
                  composition.titleAlign === align
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({ titleAlign: align })
                }
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Title case
          </span>

          <div className='cut-segmented'>
            {textCases.map((option) => (
              <button
                key={option.id}
                type='button'
                className={
                  composition.titleCase === option.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({ titleCase: option.id })
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Type color
          </span>

          <div className='cut-color-options'>
            {typeColors.map((color) => (
              <button
                key={color.id}
                type='button'
                className={
                  composition.typeColor ===
                  color.id
                    ? 'is-active'
                    : undefined
                }
                title={color.label}
                aria-label={
                  `Type color: ${color.label}`
                }
                onClick={() =>
                  onCompositionChange({
                    typeColor: color.id,
                  })
                }
              >
                <span
                  className='cut-color-options__swatch'
                  style={{
                    background:
                      color.id === 'auto'
                        ? undefined
                        : color.swatch,
                  }}
                />

                <span>
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Subtitle treatment
          </span>

          <div className='cut-subtitle-options'>
            {subtitleStyles.map((style) => (
              <button
                key={style.id}
                type='button'
                className={
                  composition.subtitleStyle ===
                  style.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    subtitleStyle: style.id,
                  })
                }
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-type-grid'>
          <label className='cut-range'>
            <span>Sub size</span>

            <input
              type='range'
              min={limits.subtitleScale.min}
              max={limits.subtitleScale.max}
              step='1'
              value={composition.subtitleScale}
              onChange={(event) =>
                onCompositionChange({
                  subtitleScale: Number(event.target.value),
                })
              }
            />

            <output>{composition.subtitleScale}%</output>
          </label>

          <label className='cut-range'>
            <span>Sub width</span>

            <input
              type='range'
              min={limits.subtitleWidth.min}
              max={limits.subtitleWidth.max}
              step='1'
              value={composition.subtitleWidth}
              onChange={(event) =>
                onCompositionChange({
                  subtitleWidth: Number(event.target.value),
                })
              }
            />

            <output>{composition.subtitleWidth}%</output>
          </label>

          <label className='cut-range'>
            <span>Sub track</span>

            <input
              type='range'
              min={limits.subtitleTracking.min}
              max={limits.subtitleTracking.max}
              step='1'
              value={composition.subtitleTracking}
              onChange={(event) =>
                onCompositionChange({
                  subtitleTracking: Number(event.target.value),
                })
              }
            />

            <output>
              {composition.subtitleTracking > 0 ? '+' : ''}
              {composition.subtitleTracking}
            </output>
          </label>

          <label className='cut-range'>
            <span>Sub lead</span>

            <input
              type='range'
              min={limits.subtitleLineHeight.min}
              max={limits.subtitleLineHeight.max}
              step='1'
              value={composition.subtitleLineHeight}
              onChange={(event) =>
                onCompositionChange({
                  subtitleLineHeight: Number(event.target.value),
                })
              }
            />

            <output>{composition.subtitleLineHeight}%</output>
          </label>

          <label className='cut-range'>
            <span>Max lines</span>

            <input
              type='range'
              min={limits.subtitleMaxLines.min}
              max={limits.subtitleMaxLines.max}
              step='1'
              value={composition.subtitleMaxLines}
              onChange={(event) =>
                onCompositionChange({
                  subtitleMaxLines: Number(event.target.value),
                })
              }
            />

            <output>{composition.subtitleMaxLines}</output>
          </label>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Subtitle align
          </span>

          <div className='cut-segmented'>
            {textAlignments.map((align) => (
              <button
                key={align}
                type='button'
                className={
                  composition.subtitleAlign === align
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({ subtitleAlign: align })
                }
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Subtitle color
          </span>

          <div className='cut-segmented'>
            {subtitleColors.map((color) => (
              <button
                key={color.id}
                type='button'
                className={
                  composition.subtitleColor ===
                  color.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    subtitleColor: color.id,
                  })
                }
              >
                {color.label}
              </button>
            ))}
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

        <label
          className={
            `cut-range ${
              imagePanAvailability.x
                ? ''
                : 'is-disabled'
            }`
          }
          title={
            imagePanAvailability.x
              ? 'Horizontal crop position'
              : 'Horizontal position is locked because the rendered image has no horizontal crop overflow.'
          }
        >
          <span>
            X
          </span>

          <input
            type='range'
            min='0'
            max='100'
            disabled={!imagePanAvailability.x}
            value={composition.imagePositionX}
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
            {imagePanAvailability.x
              ? composition.imagePositionX
              : '—'}
          </output>
        </label>

        <label
          className={
            `cut-range ${
              imagePanAvailability.y
                ? ''
                : 'is-disabled'
            }`
          }
          title={
            imagePanAvailability.y
              ? 'Vertical crop position'
              : 'Vertical position is locked because the rendered image has no vertical crop overflow.'
          }
        >
          <span>
            Y
          </span>

          <input
            type='range'
            min='0'
            max='100'
            disabled={!imagePanAvailability.y}
            value={composition.imagePositionY}
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
            {imagePanAvailability.y
              ? composition.imagePositionY
              : '—'}
          </output>
        </label>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          04 / Image look
        </span>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Treatment
          </span>

          <div className='cut-image-look-options'>
            {imageLooks.map((look) => (
              <button
                key={look.id}
                type='button'
                className={
                  composition.imageLook === look.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    imageLook: look.id,
                  })
                }
              >
                {look.label}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-type-grid cut-type-grid--image'>
          <label className='cut-range'>
            <span>Exposure</span>

            <input
              type='range'
              min='-30'
              max='30'
              step='1'
              value={composition.imageExposure}
              onChange={(event) =>
                onCompositionChange({
                  imageExposure: Number(event.target.value),
                })
              }
            />

            <output>
              {composition.imageExposure > 0 ? '+' : ''}
              {composition.imageExposure}
            </output>
          </label>

          <label className='cut-range'>
            <span>Contrast</span>

            <input
              type='range'
              min='60'
              max='180'
              step='1'
              value={composition.imageContrast}
              onChange={(event) =>
                onCompositionChange({
                  imageContrast: Number(event.target.value),
                })
              }
            />

            <output>{composition.imageContrast}%</output>
          </label>

          <label className='cut-range'>
            <span>Saturation</span>

            <input
              type='range'
              min='0'
              max='160'
              step='1'
              value={composition.imageSaturation}
              onChange={(event) =>
                onCompositionChange({
                  imageSaturation: Number(event.target.value),
                })
              }
            />

            <output>{composition.imageSaturation}%</output>
          </label>

          <label className='cut-range'>
            <span>Grain</span>

            <input
              type='range'
              min='0'
              max='40'
              step='1'
              value={composition.imageGrain}
              onChange={(event) =>
                onCompositionChange({
                  imageGrain: Number(event.target.value),
                })
              }
            />

            <output>{composition.imageGrain}</output>
          </label>
        </div>

        {composition.imageLook === 'duotone' && (
          <div className='cut-control-group'>
            <span className='cut-control-group__label'>
              Ink tone
            </span>

            <div className='cut-color-options'>
              {typeColors
                .filter((color) => color.id !== 'auto')
                .map((color) => (
                  <button
                    key={color.id}
                    type='button'
                    className={
                      composition.imageTone === color.id
                        ? 'is-active'
                        : undefined
                    }
                    title={color.label}
                    aria-label={`Image tone: ${color.label}`}
                    onClick={() =>
                      onCompositionChange({
                        imageTone: color.id,
                      })
                    }
                  >
                    <span
                      className='cut-color-options__swatch'
                      style={{ background: color.swatch }}
                    />
                    <span>{color.label}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {composition.imageLook === 'threshold' && (
          <label className='cut-range'>
            <span>Level</span>

            <input
              type='range'
              min='20'
              max='80'
              step='1'
              value={composition.imageThreshold}
              onChange={(event) =>
                onCompositionChange({
                  imageThreshold: Number(event.target.value),
                })
              }
            />

            <output>{composition.imageThreshold}</output>
          </label>
        )}

        {composition.imageLook === 'halftone' && (
          <label className='cut-range'>
            <span>Dot size</span>

            <input
              type='range'
              min='3'
              max='14'
              step='1'
              value={composition.imageHalftoneSize}
              onChange={(event) =>
                onCompositionChange({
                  imageHalftoneSize: Number(event.target.value),
                })
              }
            />

            <output>{composition.imageHalftoneSize}px</output>
          </label>
        )}

        <div className='cut-control-group cut-effect-stack'>
          <div className='cut-effect-stack__header'>
            <span className='cut-control-group__label'>
              Effect stack
            </span>

            <span>
              {composition.imageEffects.length}/6
            </span>
          </div>

          <div className='cut-effect-add'>
            {imageEffectCatalog.map((effect) => (
              <button
                key={effect.id}
                type='button'
                disabled={composition.imageEffects.length >= 6}
                title={effect.description}
                onClick={() => addImageEffect(effect.id)}
              >
                + {effect.label}
              </button>
            ))}
          </div>

          {composition.imageEffects.length > 0 && (
            <div className='cut-effect-list'>
              {composition.imageEffects.map((effect, index) => {
                const meta = imageEffectCatalog.find(
                  (item) => item.id === effect.type
                );

                return (
                  <div
                    key={effect.id}
                    className={`cut-effect-card ${
                      effect.enabled ? '' : 'is-disabled'
                    }`}
                  >
                    <div className='cut-effect-card__top'>
                      <button
                        type='button'
                        className='cut-effect-card__toggle'
                        aria-pressed={effect.enabled}
                        onClick={() =>
                          updateImageEffect(effect.id, {
                            enabled: !effect.enabled,
                          })
                        }
                      >
                        {effect.enabled ? 'ON' : 'OFF'}
                      </button>

                      <strong>{meta?.label ?? effect.type}</strong>

                      <div className='cut-effect-card__actions'>
                        <button
                          type='button'
                          disabled={index === 0}
                          aria-label='Move effect up'
                          onClick={() => moveImageEffect(index, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type='button'
                          disabled={index === composition.imageEffects.length - 1}
                          aria-label='Move effect down'
                          onClick={() => moveImageEffect(index, 1)}
                        >
                          ↓
                        </button>
                        <button
                          type='button'
                          aria-label='Remove effect'
                          onClick={() => removeImageEffect(effect.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <label className='cut-range cut-effect-card__range'>
                      <span>Amount</span>
                      <input
                        type='range'
                        min='0'
                        max='100'
                        value={effect.amount}
                        onChange={(event) =>
                          updateImageEffect(effect.id, {
                            amount: Number(event.target.value),
                          })
                        }
                      />
                      <output>{effect.amount}</output>
                    </label>

                    {(effect.type === 'halftone' ||
                      effect.type === 'xerox' ||
                      effect.type === 'chromatic' ||
                      effect.type === 'scanlines' ||
                      effect.type === 'grain') && (
                      <label className='cut-range cut-effect-card__range'>
                        <span>Scale</span>
                        <input
                          type='range'
                          min='2'
                          max='14'
                          value={effect.scale}
                          onChange={(event) =>
                            updateImageEffect(effect.id, {
                              scale: Number(event.target.value),
                            })
                          }
                        />
                        <output>{effect.scale}</output>
                      </label>
                    )}

                    {effect.type === 'duotone' && (
                      <div className='cut-effect-card__tones'>
                        {typeColors
                          .filter((color) => color.id !== 'auto')
                          .map((color) => (
                            <button
                              key={color.id}
                              type='button'
                              className={
                                effect.tone === color.id
                                  ? 'is-active'
                                  : undefined
                              }
                              title={color.label}
                              aria-label={`Effect tone: ${color.label}`}
                              onClick={() =>
                                updateImageEffect(effect.id, {
                                  tone: color.id,
                                })
                              }
                            >
                              <span
                                style={{ background: color.swatch }}
                              />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type='button'
          className='cut-image-reset'
          onClick={() =>
            onCompositionChange({
              imageLook: 'original',
              imageExposure: 0,
              imageContrast: 100,
              imageSaturation: 100,
              imageGrain: 0,
              imageThreshold: 52,
              imageHalftoneSize: 6,
              imageEffects: [],
            })
          }
        >
          RESET IMAGE LOOK
        </button>

        <p>
          Base treatment + reorderable effect stack. Up to six passes.
        </p>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          05 / Motion
        </span>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Mode
          </span>

          <div className='cut-segmented'>
            {(
              [
                'static',
                'loop',
              ] as CutMotionMode[]
            ).map((motionMode) => (
              <button
                key={motionMode}
                type='button'
                className={
                  composition.motionMode ===
                  motionMode
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    motionMode,
                  })
                }
              >
                {motionMode === 'loop'
                  ? 'motion'
                  : motionMode}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Title motion
          </span>

          <div className='cut-motion-options'>
            {motionStyles.map((style) => (
              <button
                key={style.id}
                type='button'
                disabled={
                  composition.motionMode ===
                  'static'
                }
                className={
                  composition.motionStyle ===
                  style.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    motionStyle: style.id,
                  })
                }
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <label className='cut-range'>
          <span>
            Duration
          </span>

          <input
            type='range'
            min='4'
            max='10'
            step='1'
            disabled={
              composition.motionMode ===
              'static'
            }
            value={composition.motionDuration}
            onChange={(event) =>
              onCompositionChange({
                motionDuration:
                  Number(
                    event.target.value
                  ),
              })
            }
          />

          <output>
            {composition.motionDuration}s
          </output>
        </label>

        <button
          type='button'
          className='cut-motion-toggle'
          disabled={
            composition.motionMode ===
            'static'
          }
          onClick={onToggleMotionPlayback}
        >
          {composition.motionMode ===
          'static'
            ? 'MOTION OFF'
            : motionPaused
              ? 'PLAY MOTION'
              : 'PAUSE MOTION'}
        </button>

        <p>
          The image stays fixed. Motion belongs to the title.
        </p>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          06 / Graphics
        </span>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Primitive
          </span>

          <div className='cut-graphic-options'>
            {graphicStyles.map((graphic) => (
              <button
                key={graphic.id}
                type='button'
                className={
                  composition.graphicStyle ===
                  graphic.id
                    ? 'is-active'
                    : undefined
                }
                onClick={() =>
                  onCompositionChange({
                    graphicStyle:
                      graphic.id,
                  })
                }
              >
                {graphic.label}
              </button>
            ))}
          </div>
        </div>

        <div className='cut-control-group'>
          <span className='cut-control-group__label'>
            Graphic color
          </span>

          <div className='cut-color-options'>
            {typeColors.map((color) => (
              <button
                key={color.id}
                type='button'
                disabled={
                  composition.graphicStyle ===
                  'none'
                }
                className={
                  composition.graphicColor ===
                  color.id
                    ? 'is-active'
                    : undefined
                }
                title={color.label}
                onClick={() =>
                  onCompositionChange({
                    graphicColor: color.id,
                  })
                }
              >
                <span
                  className='cut-color-options__swatch'
                  style={{
                    background:
                      color.id === 'auto'
                        ? undefined
                        : color.swatch,
                  }}
                />

                <span>
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className='cut-range'>
          <span>
            Density
          </span>
          <input
            type='range'
            min='15'
            max='100'
            step='1'
            disabled={
              composition.graphicStyle ===
              'none'
            }
            value={composition.graphicDensity}
            onChange={(event) =>
              onCompositionChange({
                graphicDensity:
                  Number(event.target.value),
              })
            }
          />
          <output>
            {composition.graphicDensity}
          </output>
        </label>

        <label className='cut-range'>
          <span>
            Scale
          </span>
          <input
            type='range'
            min='20'
            max='100'
            step='1'
            disabled={
              composition.graphicStyle ===
              'none'
            }
            value={composition.graphicScale}
            onChange={(event) =>
              onCompositionChange({
                graphicScale:
                  Number(event.target.value),
              })
            }
          />
          <output>
            {composition.graphicScale}
          </output>
        </label>

        <label className='cut-range'>
          <span>
            Rot.
          </span>
          <input
            type='range'
            min='-90'
            max='90'
            step='1'
            disabled={
              composition.graphicStyle ===
              'none'
            }
            value={composition.graphicRotation}
            onChange={(event) =>
              onCompositionChange({
                graphicRotation:
                  Number(event.target.value),
              })
            }
          />
          <output>
            {composition.graphicRotation}°
          </output>
        </label>

        <p>
          Static graphic primitives. Motion remains typographic.
        </p>
      </div>

      <div className='cut-controls__section'>
        <span className='cut-controls__section-label'>
          06 / Save
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
          07 / Export format
        </span>

        <div className='cut-export'>
          <button
            type='button'
            disabled={isExporting}
            onClick={() => onExport('png')}
          >
            PNG
          </button>

          <button
            type='button'
            disabled={isExporting}
            onClick={() => onExport('webp')}
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
