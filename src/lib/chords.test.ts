import { CHORD_TYPES, ROOT_NOTES } from '../data/music';
import {
  buildGuitarVoicing,
  buildPianoVoicing,
  buildTabLines,
  getDiagramWindow,
  spellChordNotes,
} from './chords';

describe('spellChordNotes', () => {
  it('spells a basic major chord correctly', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(spellChordNotes(root, chordType)).toEqual(['C', 'E', 'G']);
  });

  it('preserves flat spelling for flat roots', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'db')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj7')!;

    expect(spellChordNotes(root, chordType)).toEqual(['Db', 'F', 'Ab', 'C']);
  });

  it('spells minor-seven chord tones correctly', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'g')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'min7')!;

    expect(spellChordNotes(root, chordType)).toEqual(['G', 'Bb', 'D', 'F']);
  });
});

describe('buildGuitarVoicing', () => {
  it('selects the lower-position A-shape voicing for C major', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(buildGuitarVoicing(root, chordType)).toEqual({
      label: '5th-string root shape',
      rootString: 5,
      strings: [null, 3, 5, 5, 5, 3],
    });
  });

  it('selects the lower-position E-shape voicing for G major', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'g')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(buildGuitarVoicing(root, chordType)).toEqual({
      label: '6th-string root shape',
      rootString: 6,
      strings: [3, 5, 5, 4, 3, 3],
    });
  });
});

describe('buildPianoVoicing', () => {
  it('builds a compact C major voicing around middle C', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(buildPianoVoicing(root, chordType)).toEqual([60, 64, 67]);
  });

  it('builds lower voicings for roots above F to keep the keyboard compact', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'g')!;
    const chordType = CHORD_TYPES.find((type) => type.id === '7')!;

    expect(buildPianoVoicing(root, chordType)).toEqual([55, 59, 62, 65]);
  });
});

describe('diagram helpers', () => {
  it('returns a four-fret window starting from fret one when the chord is low on the neck', () => {
    expect(getDiagramWindow([3, 5, 5, 4, 3, 3])).toEqual({ baseFret: 1, fretCount: 5 });
  });

  it('builds simple tab-style lines from low to high strings', () => {
    expect(buildTabLines([null, 3, 5, 5, 5, 3])).toEqual([
      'e|---3--',
      'B|---5--',
      'G|---5--',
      'D|---5--',
      'A|---3--',
      'E|---x--',
    ]);
  });
});

