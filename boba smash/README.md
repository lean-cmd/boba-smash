# Boba Smash

Pixel-art browser game built with Vite + React.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Deploy

Use Vercel with:

- Framework: `Vite`
- Root Directory: `boba smash`
- Build Command: `npm run build`
- Output Directory: `dist`

## Claude Code Handoff

### Core Files

- App and screen flow: [src/App.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/App.jsx)
- Styling and pixel scenes: [src/index.css](/Users/leanderblumenthal/chargame/boba%20smash/src/index.css)
- Character render layer: [src/components/PixelCapybara.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/components/PixelCapybara.jsx)
- Character data: [src/data/characters.js](/Users/leanderblumenthal/chargame/boba%20smash/src/data/characters.js)
- Audio/theme loop: [src/hooks/useThemeSong.js](/Users/leanderblumenthal/chargame/boba%20smash/src/hooks/useThemeSong.js)

### Current Features

- Story intro through arrival at Boba Paradise
- Tutorial with skip path
- Kitchen gameplay with pause/shop
- Cafe decor upgrades
- First-end-shift Bob reward with `+500`
- House select
- Home hub
- Free roam house decor
- Gallery for character/accessory animation previews

### Current Constraints

- Most gameplay and screen state is still centralized in `App.jsx`.
- Pixel movement is mostly CSS animation over extracted character art.
- Keep the traced/reference look. Do not replace it with generic new vector art.

### Validation

Before handing off changes:

```bash
npm run lint
npm run build
```
