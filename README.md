# Boba Smash Share Repo

This repo is ready to publish to GitHub and deploy on Vercel.

The actual app lives in [boba smash](/Users/leanderblumenthal/chargame/boba%20smash).

## Repo Layout

- App folder: [boba smash](/Users/leanderblumenthal/chargame/boba%20smash)
- Root git repo: [/Users/leanderblumenthal/chargame](/Users/leanderblumenthal/chargame)
- Suggested GitHub repo name: `boba-smash`
- Vercel Root Directory: `boba smash`

## Quick Commands

```bash
cd "/Users/leanderblumenthal/chargame/boba smash"
npm install
npm run dev
npm run lint
npm run build
```

## Publish

```bash
cd "/Users/leanderblumenthal/chargame"
gh auth login -h github.com
gh repo create boba-smash --public --source=. --remote=origin --push
```

After the repo exists, import it into Vercel and set:

- Framework: `Vite`
- Root Directory: `boba smash`
- Build Command: `npm run build`
- Output Directory: `dist`

## Claude Code Continuation Notes

Use this section as the handoff for the next coding session.

### Stack

- Vite
- React
- JavaScript
- Single-screen-state app in [App.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/App.jsx)

### Main Files

- Game flow and screen routing: [App.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/App.jsx)
- Global styling and all scene art/layout CSS: [index.css](/Users/leanderblumenthal/chargame/boba%20smash/src/index.css)
- Character rendering and scene sprites: [PixelCapybara.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/components/PixelCapybara.jsx)
- Character metadata: [characters.js](/Users/leanderblumenthal/chargame/boba%20smash/src/data/characters.js)
- Theme music loop logic: [useThemeSong.js](/Users/leanderblumenthal/chargame/boba%20smash/src/hooks/useThemeSong.js)
- Transparent sprite crop helper: [make-transparent-sprites.swift](/Users/leanderblumenthal/chargame/boba%20smash/scripts/make-transparent-sprites.swift)

### Current Game Flow

1. Title
2. Loading
3. Intro with Bob
4. Character select
5. Accessories
6. Airport
7. Reunion
8. Plane
9. Arrival at Boba Paradise
10. Tutorial
11. Gameplay
12. First manual `End Shift` routes to Bob reward + `500` coins
13. House select
14. Home hub
15. Free roam house decor
16. Later end shifts route to home instead of the first reward
17. Normal loss/game over routes to the upgrade shop

### Persistence

Saved under localStorage key:

- `boba-smash-story`

Current persisted values include:

- selected character
- selected accessory
- player name
- coins
- upgrade levels
- cafe decor
- house unlock state
- selected house
- house decor
- best customers served

### Important Constants

Defined in [App.jsx](/Users/leanderblumenthal/chargame/boba%20smash/src/App.jsx):

- `SCREENS`
- `CAFE_DECOR_ITEMS`
- `FIRST_HOME_BONUS`
- `HOUSE_OPTIONS`
- `HOUSE_DECOR_ITEMS`

### Current Product Direction

- Pixel-art tropical style
- Use the traced/reference art look for the six main characters
- Bob uses the pug art
- Story-heavy onboarding, then arcade kitchen gameplay
- House/home progression after the first voluntary end shift

### Known Areas To Improve

- House art can be refined further if the silhouette still feels too simple.
- Some story/cutscene pacing is still all in one file and can be cleaned up carefully.
- Character animation polish is still mostly CSS motion around extracted art, not full frame-by-frame bespoke animation.
- Plane scene should keep being watched because it was crash-prone earlier in the project.

### Guardrails For The Next Agent

- Keep the exact named playable characters.
- Preserve the reference-based visual direction.
- Do not replace the bitmap/extracted art with generic SVG approximations.
- Run `npm run lint` and `npm run build` after changes.
- If deploying on Vercel, leave the Root Directory as `boba smash`.
