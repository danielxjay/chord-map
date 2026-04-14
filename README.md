# chordMapper

`chordMapper` is a static React app for browsing guitar and piano chord references.

## Current MVP

- choose a root note first
- switch into a chord-variation view for that root
- inspect chord tones and interval formula
- view a guitar chord diagram with fret positions and tab-style output
- view a piano keyboard diagram with highlighted notes
- play the selected chord in the browser with Web Audio

## Stack

- React 18
- TypeScript
- Vite

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Vite will usually serve the app at `http://localhost:5173`.

Run the test suite:

```bash
npm run test
```

Run tests once in CI mode:

```bash
npm run test:run
```

## Production Build

Create the production bundle:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

The production output is written to `dist/`.

## Project Structure

```text
src/
  components/    UI pieces such as note picker, chord list, diagrams, playback
  data/          curated root notes, chord types, and starter guitar templates
  lib/           chord spelling, voicing helpers, and audio playback
```

## Notes

- this is currently a curated MVP, not a full generated chord engine
- guitar voicings are based on starter movable-shape templates
- full staff notation is not implemented yet
- the production base path in [vite.config.ts](vite.config.ts) is currently set to `/chordMapper/`
