import {
  toCanvas,
  toPng,
} from 'html-to-image';

import type {
  ExportFormat,
} from '../types/cut';

const triggerDownload = (
  href: string,
  filename: string
) => {
  const link =
    document.createElement('a');

  link.download =
    filename;

  link.href =
    href;

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();
};

const waitForImages = async (
  node: HTMLElement
) => {
  const images =
    Array.from(
      node.querySelectorAll(
        'img'
      )
    );

  await Promise.all(
    images.map(
      async (image) => {
        if (
          image.complete &&
          image.naturalWidth > 0
        ) {
          return;
        }

        if (
          typeof image.decode ===
          'function'
        ) {
          await image.decode();

          return;
        }

        await new Promise<void>(
          (resolve, reject) => {
            image.addEventListener(
              'load',
              () => resolve(),
              {
                once: true,
              }
            );

            image.addEventListener(
              'error',
              () =>
                reject(
                  new Error(
                    'An image could not be prepared for export.'
                  )
                ),
              {
                once: true,
              }
            );
          }
        );
      }
    )
  );
};

const prepareForExport = async (
  node: HTMLElement
) => {
  if (
    'fonts' in document
  ) {
    await document.fonts.ready;
  }

  await waitForImages(
    node
  );

  // Let the browser commit the final paint before html-to-image clones it.
  await new Promise<void>(
    (resolve) =>
      requestAnimationFrame(
        () =>
          requestAnimationFrame(
            () => resolve()
          )
      )
  );
};

export const exportArtwork = async (
  node: HTMLElement,
  format: ExportFormat
) => {
  await prepareForExport(
    node
  );

  const timestamp =
    new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(':', '-');

  if (format === 'png') {
    const dataUrl =
      await toPng(
        node,
        {
          pixelRatio: 2,
          cacheBust: false,
        }
      );

    triggerDownload(
      dataUrl,
      `cut-${timestamp}.png`
    );

    return;
  }

  const canvas =
    await toCanvas(
      node,
      {
        pixelRatio: 2,
        cacheBust: false,
      }
    );

  const dataUrl =
    canvas.toDataURL(
      'image/webp',
      0.92
    );

  triggerDownload(
    dataUrl,
    `cut-${timestamp}.webp`
  );
};
