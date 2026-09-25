const MAX_IMAGE_DIMENSION =
  3200;

const loadImage = (
  src: string
): Promise<HTMLImageElement> =>
  new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.onload =
        () =>
          resolve(
            image
          );

      image.onerror =
        () =>
          reject(
            new Error(
              'Could not decode the selected image.'
            )
          );

      image.src =
        src;
    }
  );

export const prepareImage =
  async (
    file: File
  ): Promise<string> => {
    const objectUrl =
      URL.createObjectURL(
        file
      );

    try {
      const image =
        await loadImage(
          objectUrl
        );

      const largestSide =
        Math.max(
          image.naturalWidth,
          image.naturalHeight
        );

      const scale =
        Math.min(
          1,
          MAX_IMAGE_DIMENSION /
            largestSide
        );

      const width =
        Math.max(
          1,
          Math.round(
            image.naturalWidth *
              scale
          )
        );

      const height =
        Math.max(
          1,
          Math.round(
            image.naturalHeight *
              scale
          )
        );

      const canvas =
        document.createElement(
          'canvas'
        );

      canvas.width =
        width;

      canvas.height =
        height;

      const context =
        canvas.getContext(
          '2d',
          {
            alpha: true,
          }
        );

      if (!context) {
        throw new Error(
          'Could not prepare the selected image.'
        );
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      const keepsTransparency =
        file.type ===
        'image/png';

      return canvas.toDataURL(
        keepsTransparency
          ? 'image/png'
          : 'image/jpeg',
        keepsTransparency
          ? undefined
          : 0.94
      );
    } finally {
      URL.revokeObjectURL(
        objectUrl
      );
    }
  };
