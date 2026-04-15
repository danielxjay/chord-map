import { CHORD_TYPES, ROOT_NOTES } from '../data/music';
import {
  buildGuitarVoicing,
  buildGuitarVoicings,
  buildPianoVoicing,
  buildTabLines,
  getAlternateChordLabel,
  getAlternateLongFormChordLabel,
  getChordLabel,
  getDiagramWindow,
  getKeyboardRange,
  getLongFormChordLabel,
  spellChordNotes,
} from './chords';

describe('spellChordNotes', () => {
  it('spells a basic major chord correctly', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(spellChordNotes(root, chordType)).toEqual(['C', 'E', 'G']);
  });

  it('preserves flat spelling for flat roots', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'eb')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj7')!;

    expect(spellChordNotes(root, chordType)).toEqual(['Eb', 'G', 'Bb', 'D']);
  });

  it('keeps the chosen sharp root spelling for split-note minor chords', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'db')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'min7')!;

    expect(getChordLabel(root, chordType)).toBe('C#min7');
    expect(spellChordNotes(root, chordType)).toEqual(['C#', 'E', 'G#', 'B']);
  });

  it('keeps the chosen sharp root spelling for F# major chords', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'gb')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(getChordLabel(root, chordType)).toBe('F#maj');
    expect(spellChordNotes(root, chordType)).toEqual(['F#', 'A#', 'C#']);
  });

  it('provides the alternate enharmonic label for split-note roots', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'db')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(getAlternateChordLabel(root, chordType)).toBe('Dbmaj');
  });

  it('builds long-form chord names for the selected and alternate spellings', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'db')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(getLongFormChordLabel(root, chordType)).toBe('C-sharp major');
    expect(getAlternateLongFormChordLabel(root, chordType)).toBe('D-flat major');
  });

  it('spells minor-seven chord tones correctly', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'g')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'min7')!;

    expect(spellChordNotes(root, chordType)).toEqual(['G', 'Bb', 'D', 'F']);
  });
});

describe('buildGuitarVoicing', () => {
  it('prefers the curated open voicing for C major', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(buildGuitarVoicing(root, chordType)).toEqual({
      id: 'c-maj-open',
      label: 'Open chord',
      rootString: 5,
      source: 'curated',
      strings: [null, 3, 2, 0, 1, 0],
    });
  });

  it('prefers the curated open voicing for G major', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'g')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;

    expect(buildGuitarVoicing(root, chordType)).toEqual({
      id: 'g-maj-open',
      label: 'Open chord',
      rootString: 6,
      source: 'curated',
      strings: [3, 2, 0, 0, 0, 3],
    });
  });
});

describe('buildGuitarVoicings', () => {
  it('returns multiple voicings with curated options first', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'c')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;
    const voicings = buildGuitarVoicings(root, chordType);

    expect(voicings.map((voicing) => voicing.id)).toEqual([
      'c-maj-open',
      'c-maj-barre',
      'c-maj-e',
    ]);
  });

  it('falls back to generated voicings when there is no curated override', () => {
    const root = ROOT_NOTES.find((note) => note.id === 'bb')!;
    const chordType = CHORD_TYPES.find((type) => type.id === 'maj')!;
    const voicings = buildGuitarVoicings(root, chordType);

    expect(voicings).toHaveLength(2);
    expect(voicings[0]).toMatchObject({
      id: 'bb-maj-a',
      label: '5th-string root shape',
      source: 'generated',
      strings: [null, 1, 3, 3, 3, 1],
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

describe('getKeyboardRange', () => {
  const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);

  it('always starts and ends on a white key', () => {
    // C major: C E G — all white keys, range should start and end cleanly
    const range = getKeyboardRange([60, 64, 67]);
    expect(WHITE_PITCH_CLASSES.has(range[0] % 12)).toBe(true);
    expect(WHITE_PITCH_CLASSES.has(range[range.length - 1] % 12)).toBe(true);
  });

  it('shows at least 10 white keys so the chord does not feel cramped', () => {
    // F# major: F# A# C# — black-heavy chord that needs range expansion
    const range = getKeyboardRange([54, 58, 61]);
    const whiteCount = range.filter((note) => WHITE_PITCH_CLASSES.has(note % 12)).length;
    expect(whiteCount).toBeGreaterThanOrEqual(10);
  });

  it('includes all active notes in the range', () => {
    // G dominant 7: G B D F
    const midiNotes = [55, 59, 62, 65];
    const range = getKeyboardRange(midiNotes);
    midiNotes.forEach((note) => {
      expect(range).toContain(note);
    });
  });
});
