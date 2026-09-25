# CUT — V1.2.1

CUT is a browser-only editorial composition tool.

## V1.2

- 1 image upload
- title + subtitle
- 8 composition systems
- 6 title treatments
- 4 output ratios
- light / dark theme
- X / Y image positioning
- rule-based randomization
- zoom in / zoom out / 100% / fit
- SAVE POSTER downloads the current design as a high-resolution PNG
- PNG + WebP export options
- desktop app remains fully inside the viewport
- left controls use internal scrolling
- no backend
- no AI
- no token usage

## Run

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
```

## Save behavior

SAVE POSTER downloads the current composition as a high-resolution PNG. It does not create or store an editable CUT project file.

The PNG / WEBP buttons below it let the user choose a specific export format.

## Product principle

The randomizer does not generate arbitrary CSS. It chooses among valid editorial systems, title treatments and controlled image positions.


## Export fix

Uploaded images are normalized in-browser into an embedded data URL before being rendered. This avoids `blob:` URL serialization failures in `html-to-image`, especially in Chromium/Brave. Large photos are resized to a maximum dimension of 3200 px before export to reduce memory pressure while preserving enough resolution for CUT's 2x poster output.
