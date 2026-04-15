import { CHORD_TYPES, GUITAR_CURATED_VOICINGS, GUITAR_TEMPLATES } from '../data/music';
import type { ChordType, GuitarTemplate, GuitarVoicing, LetterName, RootNote } from '../types';

const LETTER_SEQUENCE: LetterName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const WHITE_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11];

const NATURAL_PITCH_CLASS: Record<LetterName, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const OPEN_STRING_PITCH_CLASS: Record<5 | 6, number> = {
  5: 9,
  6: 4,
};

const CHORD_TYPE_LONG_NAMES: Record<string, string> = {
  maj: 'major',
  min: 'minor',
  '7': 'dominant seventh',
  maj7: 'major seventh',
  min7: 'minor seventh',
  sus2: 'suspended second',
  sus4: 'suspended fourth',
  dim: 'diminished',
  aug: 'augmented',
  add9: 'add nine',
};

function formatAccidental(accidental: number): string {
  if (accidental === -1) {
    return 'b';
  }

  if (accidental === 1) {
    return '#';
  }

  return '';
}

function fallbackNoteName(pitchClass: number, preferFlats: boolean): string {
  return preferFlats ? FLAT_NAMES[pitchClass] : SHARP_NAMES[pitchClass];
}

export function getChordLabel(root: RootNote, chordType: ChordType): string {
  return `${root.displayName}${chordType.suffix}`;
}

export function getAlternateChordLabel(root: RootNote, chordType: ChordType): string | null {
  if (!root.alternateDisplayName) {
    return null;
  }

  return `${root.alternateDisplayName}${chordType.suffix}`;
}

function formatRootNameLong(name: string): string {
  if (name.endsWith('#')) {
    return `${name.slice(0, -1)}-sharp`;
  }

  if (name.endsWith('b')) {
    return `${name.slice(0, -1)}-flat`;
  }

  return name;
}

export function getLongFormChordLabel(root: RootNote, chordType: ChordType): string {
  return `${formatRootNameLong(root.displayName)} ${CHORD_TYPE_LONG_NAMES[chordType.id] ?? chordType.label.toLowerCase()}`;
}

export function getAlternateLongFormChordLabel(root: RootNote, chordType: ChordType): string | null {
  if (!root.alternateDisplayName) {
    return null;
  }

  return `${formatRootNameLong(root.alternateDisplayName)} ${CHORD_TYPE_LONG_NAMES[chordType.id] ?? chordType.label.toLowerCase()}`;
}

export function spellChordNotes(root: RootNote, chordType: ChordType): string[] {
  const rootLetterIndex = LETTER_SEQUENCE.indexOf(root.letter);

  return chordType.intervals.map((interval) => {
    const targetPitchClass = (root.pitchClass + interval.semitones) % 12;
    const letterOffset = (interval.degree - 1) % 7;
    const targetLetter = LETTER_SEQUENCE[(rootLetterIndex + letterOffset) % LETTER_SEQUENCE.length];
    const naturalPitchClass = NATURAL_PITCH_CLASS[targetLetter];
    // +18 prevents a negative modulo result; subtracting 6 centres the range at 0
    // so the result maps to: -1 = flat, 0 = natural, 1 = sharp (or ±2 for doubles).
    let accidental = ((targetPitchClass - naturalPitchClass + 18) % 12) - 6;

    if (accidental < -1 || accidental > 1) {
      return fallbackNoteName(targetPitchClass, root.preferFlats);
    }

    if (targetLetter === root.letter && interval.degree === 1) {
      accidental = root.accidental;
    }

    return `${targetLetter}${formatAccidental(accidental)}`;
  });
}

function getTemplateRootFret(root: RootNote, template: GuitarTemplate): number {
  return (root.pitchClass - OPEN_STRING_PITCH_CLASS[template.rootString] + 12) % 12;
}

function scoreVoicing(strings: Array<number | null>): number {
  const fretted = strings.filter((fret): fret is number => fret !== null);
  const positiveFrets = fretted.filter((fret) => fret > 0);
  const min = positiveFrets.length > 0 ? Math.min(...positiveFrets) : 0;
  const max = positiveFrets.length > 0 ? Math.max(...positiveFrets) : 0;
  const span = max - min;
  const openCount = fretted.filter((fret) => fret === 0).length;

  // Lower score = preferred. Position dominates (×3) so lower-fret shapes win;
  // span penalises wide stretches (×4); open strings are a bonus (−1 each).
  return min * 3 + span * 4 - openCount;
}

function dedupeVoicings(voicings: GuitarVoicing[]): GuitarVoicing[] {
  const seen = new Set<string>();

  return voicings.filter((voicing) => {
    const signature = voicing.strings.map((fret) => (fret === null ? 'x' : fret)).join('-');

    if (seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
}

function buildGeneratedGuitarVoicings(root: RootNote, chordType: ChordType): GuitarVoicing[] {
  const templates = GUITAR_TEMPLATES[chordType.id];

  return templates
    .map((template) => {
    const rootFret = getTemplateRootFret(root, template);
    const strings = template.frets.map((fret) => (fret === null ? null : rootFret + fret));

    return {
      id: `${root.id}-${template.id}`,
      label: template.label,
      rootString: template.rootString,
      strings,
      source: 'generated' as const,
      score: scoreVoicing(strings),
    };
    })
    .sort((left, right) => left.score - right.score)
    .map(({ score, ...voicing }) => voicing);
}

export function buildGuitarVoicings(root: RootNote, chordType: ChordType): GuitarVoicing[] {
  const curatedKey = `${root.id}:${chordType.id}`;
  const curatedVoicings = GUITAR_CURATED_VOICINGS[curatedKey] ?? [];
  const generatedVoicings = buildGeneratedGuitarVoicings(root, chordType);

  return dedupeVoicings([...curatedVoicings, ...generatedVoicings]);
}

export function buildGuitarVoicing(root: RootNote, chordType: ChordType): GuitarVoicing {
  return buildGuitarVoicings(root, chordType)[0];
}

export function getDiagramWindow(strings: Array<number | null>): { baseFret: number; fretCount: number } {
  const fretted = strings.filter((fret): fret is number => fret !== null && fret > 0);

  if (fretted.length === 0) {
    return { baseFret: 1, fretCount: 4 };
  }

  const minFret = Math.min(...fretted);
  const maxFret = Math.max(...fretted);
  const baseFret = minFret <= 3 ? 1 : minFret;
  const fretCount = Math.max(4, maxFret - baseFret + 1);

  return { baseFret, fretCount };
}

export function buildTabLines(strings: Array<number | null>): string[] {
  const labels = ['e', 'B', 'G', 'D', 'A', 'E'];
  const reversedStrings = [...strings].reverse();

  return reversedStrings.map((fret, index) => {
    const display = fret === null ? 'x' : fret.toString();
    return `${labels[index]}|--${display.padStart(2, '-')}--`;
  });
}

export function buildPianoVoicing(root: RootNote, chordType: ChordType): number[] {
  // Pitch classes 0–6 (C–F#) sit comfortably above middle C (60).
  // Pitch classes 7–11 (G–B) would overshoot the display range, so drop an octave to 48.
  const rootMidi = root.pitchClass <= 6 ? 60 + root.pitchClass : 48 + root.pitchClass;
  return chordType.intervals.map((interval) => rootMidi + interval.semitones);
}

function countWhiteKeys(range: number[]): number {
  return range.filter((note) => WHITE_PITCH_CLASSES.includes(note % 12)).length;
}

export function getKeyboardRange(activeMidiNotes: number[]): number[] {
  const lowestNote = Math.min(...activeMidiNotes);
  const highestNote = Math.max(...activeMidiNotes);
  let start = Math.max(36, lowestNote - 4);
  let end = Math.min(84, highestNote + 7);

  while (start > 36 && !WHITE_PITCH_CLASSES.includes(start % 12)) {
    start -= 1;
  }

  while (end < 84 && !WHITE_PITCH_CLASSES.includes(end % 12)) {
    end += 1;
  }

  let range = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  while (countWhiteKeys(range) < 10 && end < 84) {
    end += 1;
    range = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  return range;
}

export function formatIntervalSet(chordType: ChordType): string {
  return chordType.intervals.map((interval) => interval.label).join(' • ');
}

export function getDefaultChordType(): ChordType {
  return CHORD_TYPES[0];
}

export function findChordTypeById(chordTypeId: string): ChordType {
  return CHORD_TYPES.find((chordType) => chordType.id === chordTypeId) ?? getDefaultChordType();
}
