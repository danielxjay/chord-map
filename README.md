# Chord Map

A static web app for browsing guitar and piano chord references. Pick a root note, choose a chord type, and you get a fretboard diagram with tab notation, a piano keyboard with the chord tones highlighted, and a button to hear the voicing in the browser.

No server, no account, no dependencies beyond React. Everything runs client-side.

## How it works

The app is built in three layers:

**Data (`src/data/music.ts`)** defines the raw material: the 12 chromatic root notes, 10 chord types with their interval formulas, and guitar voicing shapes. Guitar voicings are a mix of hand-curated open-position chords for common keys (C, G, D, A, E) and movable barre shapes generated from templates for everything else. Curated voicings take priority because they tend to be more practical to actually play.

**Logic (`src/lib/`)** turns data into something displayable. `chords.ts` handles note spelling — for example, making sure an Eb chord spells its notes as Eb G Bb D rather than D# G A# C#. It also handles voicing selection, fret diagram window calculation, and piano keyboard range. `audio.ts` manages a shared Web Audio context and schedules the oscillator nodes to play a chord.

**Components (`src/components/`)** are thin React pieces that take props and render. No component reaches into global state or owns chord data. The guitar diagram, piano keyboard, and playback button each do one thing.

The two-step navigation (root → chord type) and the current voicing index live in `App`'s local state. That's the full extent of state management — no context, no reducers, no external library.

## Local development

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## Tests

```bash
npm run test        # watch mode during development
npm run test:run    # single run, used in CI
```

Tests are split between unit tests for the chord logic (`src/lib/chords.test.ts`) and integration tests that drive the full UI (`src/App.test.tsx`).

The unit tests cover things that would silently produce wrong output without breaking the build: note spelling, voicing ordering, tab line formatting, and keyboard range calculations. Getting `Eb maj7` to spell correctly as `Eb G Bb D` — rather than the enharmonically equivalent but musically wrong `D# G A# C#` — requires real logic, and a wrong result would show up directly on screen.

The integration tests simulate real user flows with `@testing-library/user-event`. They verify that clicking a root note moves you to the chord list, that switching chords updates the detail view, that voicing navigation works and resets correctly when you change chords, and that enharmonic roots (like C# / Db) display both spellings consistently.

## Production build

```bash
npm run build
npm run preview   # serve the built output locally before deploying
```

Output goes to `dist/`. The production base path is set to `/chordMapper/` in `vite.config.ts` to match the GitHub Pages subdirectory.

Deployment is automated: pushing to `main` triggers the workflow in `.github/workflows/deploy.yml`, which builds the app and pushes the output to the `gh-pages` branch.

## Project structure

```
src/
  components/   UI: note picker, chord list, guitar diagram, piano keyboard, playback button
  data/         Root notes, chord types, guitar templates and curated voicings
  lib/          chords.ts (note spelling, voicing logic), audio.ts (Web Audio playback)
  types.ts      Shared TypeScript types
```

## Notes

- Guitar voicings are a curated MVP, not an exhaustive generated engine. Common keys have hand-picked open-position shapes; everything else falls back to movable barre shapes derived from `GUITAR_TEMPLATES`.
- Audio playback uses a triangle wave plus a sine wave one octave up per note. The combination is warmer than a plain sine wave without being as harsh as a square wave. It is tuned for chord preview, not instrument accuracy.
- Staff notation is not implemented.
- The production base path in `vite.config.ts` is `/chordMapper/` — change this if you deploy to a different path or a root domain.
