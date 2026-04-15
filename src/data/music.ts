import type { ChordType, GuitarTemplate, GuitarVoicing, RootNote } from '../types';

export const ROOT_NOTES: RootNote[] = [
  { id: 'c', label: 'C', displayName: 'C', pitchClass: 0, letter: 'C', accidental: 0, preferFlats: false },
  {
    id: 'db',
    label: 'C#',
    displayName: 'C#',
    alternateDisplayName: 'Db',
    pitchClass: 1,
    letter: 'C',
    accidental: 1,
    preferFlats: false,
  },
  { id: 'd', label: 'D', displayName: 'D', pitchClass: 2, letter: 'D', accidental: 0, preferFlats: false },
  { id: 'eb', label: 'Eb', displayName: 'Eb', pitchClass: 3, letter: 'E', accidental: -1, preferFlats: true },
  { id: 'e', label: 'E', displayName: 'E', pitchClass: 4, letter: 'E', accidental: 0, preferFlats: false },
  { id: 'f', label: 'F', displayName: 'F', pitchClass: 5, letter: 'F', accidental: 0, preferFlats: false },
  {
    id: 'gb',
    label: 'F#',
    displayName: 'F#',
    alternateDisplayName: 'Gb',
    pitchClass: 6,
    letter: 'F',
    accidental: 1,
    preferFlats: false,
  },
  { id: 'g', label: 'G', displayName: 'G', pitchClass: 7, letter: 'G', accidental: 0, preferFlats: false },
  { id: 'ab', label: 'Ab', displayName: 'Ab', pitchClass: 8, letter: 'A', accidental: -1, preferFlats: true },
  { id: 'a', label: 'A', displayName: 'A', pitchClass: 9, letter: 'A', accidental: 0, preferFlats: false },
  { id: 'bb', label: 'Bb', displayName: 'Bb', pitchClass: 10, letter: 'B', accidental: -1, preferFlats: true },
  { id: 'b', label: 'B', displayName: 'B', pitchClass: 11, letter: 'B', accidental: 0, preferFlats: false },
];

export const CHORD_TYPES: ChordType[] = [
  {
    id: 'maj',
    suffix: 'maj',
    label: 'Major',
    description: 'Bright, stable triad.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 4, label: '3' },
      { degree: 5, semitones: 7, label: '5' },
    ],
  },
  {
    id: 'min',
    suffix: 'min',
    label: 'Minor',
    description: 'Darker triad with a flattened third.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 3, label: 'b3' },
      { degree: 5, semitones: 7, label: '5' },
    ],
  },
  {
    id: '7',
    suffix: '7',
    label: 'Dominant 7',
    description: 'Classic blues and jazz tension.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 4, label: '3' },
      { degree: 5, semitones: 7, label: '5' },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'maj7',
    suffix: 'maj7',
    label: 'Major 7',
    description: 'Open, smooth, and modern sounding.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 4, label: '3' },
      { degree: 5, semitones: 7, label: '5' },
      { degree: 7, semitones: 11, label: '7' },
    ],
  },
  {
    id: 'min7',
    suffix: 'min7',
    label: 'Minor 7',
    description: 'Soft minor color with a seventh.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 3, label: 'b3' },
      { degree: 5, semitones: 7, label: '5' },
      { degree: 7, semitones: 10, label: 'b7' },
    ],
  },
  {
    id: 'sus2',
    suffix: 'sus2',
    label: 'Suspended 2',
    description: 'Replaces the third with a second.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 2, semitones: 2, label: '2' },
      { degree: 5, semitones: 7, label: '5' },
    ],
  },
  {
    id: 'sus4',
    suffix: 'sus4',
    label: 'Suspended 4',
    description: 'Replaces the third with a fourth.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 4, semitones: 5, label: '4' },
      { degree: 5, semitones: 7, label: '5' },
    ],
  },
  {
    id: 'dim',
    suffix: 'dim',
    label: 'Diminished',
    description: 'Compressed triad with a flattened fifth.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 3, label: 'b3' },
      { degree: 5, semitones: 6, label: 'b5' },
    ],
  },
  {
    id: 'aug',
    suffix: 'aug',
    label: 'Augmented',
    description: 'Expanded triad with a raised fifth.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 4, label: '3' },
      { degree: 5, semitones: 8, label: '#5' },
    ],
  },
  {
    id: 'add9',
    suffix: 'add9',
    label: 'Add 9',
    description: 'Major triad with the ninth added on top.',
    intervals: [
      { degree: 1, semitones: 0, label: '1' },
      { degree: 3, semitones: 4, label: '3' },
      { degree: 5, semitones: 7, label: '5' },
      { degree: 9, semitones: 14, label: '9' },
    ],
  },
];

export const GUITAR_TEMPLATES: Record<string, GuitarTemplate[]> = {
  maj: [
    { id: 'maj-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 2, 1, 0, 0] },
    { id: 'maj-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 2, 2, 0] },
  ],
  min: [
    { id: 'min-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 2, 0, 0, 0] },
    { id: 'min-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 2, 1, 0] },
  ],
  '7': [
    { id: 'dom7-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 0, 1, 0, 0] },
    { id: 'dom7-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 0, 2, 0] },
  ],
  maj7: [
    { id: 'maj7-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 1, 1, 0, 0] },
    { id: 'maj7-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 1, 2, 0] },
  ],
  min7: [
    { id: 'min7-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 0, 0, 0, 0] },
    { id: 'min7-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 0, 1, 0] },
  ],
  sus2: [
    { id: 'sus2-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 2, 0, 0] },
    { id: 'sus2-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 4, 4, 0, 0] },
  ],
  sus4: [
    { id: 'sus4-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 2, 3, 0] },
    { id: 'sus4-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 2, 2, 0, 0] },
  ],
  dim: [
    { id: 'dim-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 1, 2, 1, null] },
  ],
  aug: [
    { id: 'aug-e', label: '6th-string root shape', rootString: 6, frets: [0, 3, 2, 1, 1, 0] },
  ],
  add9: [
    { id: 'add9-a', label: '5th-string root shape', rootString: 5, frets: [null, 0, 2, 4, 2, 0] },
    { id: 'add9-e', label: '6th-string root shape', rootString: 6, frets: [0, 2, 4, 1, 0, 0] },
  ],
};

export const GUITAR_CURATED_VOICINGS: Record<string, GuitarVoicing[]> = {
  'a:7': [
    { id: 'a-7-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 0, 2, 0], source: 'curated' },
  ],
  'a:maj': [
    { id: 'a-maj-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 2, 2, 0], source: 'curated' },
  ],
  'a:min': [
    { id: 'a-min-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 2, 1, 0], source: 'curated' },
  ],
  'a:min7': [
    { id: 'a-min7-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 0, 1, 0], source: 'curated' },
  ],
  'a:sus2': [
    { id: 'a-sus2-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 2, 0, 0], source: 'curated' },
  ],
  'a:sus4': [
    { id: 'a-sus4-open', label: 'Open chord', rootString: 5, strings: [null, 0, 2, 2, 3, 0], source: 'curated' },
  ],
  'c:maj': [
    { id: 'c-maj-open', label: 'Open chord', rootString: 5, strings: [null, 3, 2, 0, 1, 0], source: 'curated' },
    { id: 'c-maj-barre', label: 'Barre shape', rootString: 5, strings: [null, 3, 5, 5, 5, 3], source: 'curated' },
  ],
  'c:maj7': [
    { id: 'c-maj7-open', label: 'Open chord', rootString: 5, strings: [null, 3, 2, 0, 0, 0], source: 'curated' },
  ],
  'c:add9': [
    { id: 'c-add9-open', label: 'Open chord', rootString: 5, strings: [null, 3, 2, 0, 3, 0], source: 'curated' },
  ],
  'd:7': [
    { id: 'd-7-open', label: 'Open chord', rootString: 4, strings: [null, null, 0, 2, 1, 2], source: 'curated' },
  ],
  'd:maj': [
    { id: 'd-maj-open', label: 'Open chord', rootString: 4, strings: [null, null, 0, 2, 3, 2], source: 'curated' },
  ],
  'd:min': [
    { id: 'd-min-open', label: 'Open chord', rootString: 4, strings: [null, null, 0, 2, 3, 1], source: 'curated' },
  ],
  'd:sus2': [
    { id: 'd-sus2-open', label: 'Open chord', rootString: 4, strings: [null, null, 0, 2, 3, 0], source: 'curated' },
  ],
  'd:sus4': [
    { id: 'd-sus4-open', label: 'Open chord', rootString: 4, strings: [null, null, 0, 2, 3, 3], source: 'curated' },
  ],
  'e:7': [
    { id: 'e-7-open', label: 'Open chord', rootString: 6, strings: [0, 2, 0, 1, 0, 0], source: 'curated' },
  ],
  'e:maj': [
    { id: 'e-maj-open', label: 'Open chord', rootString: 6, strings: [0, 2, 2, 1, 0, 0], source: 'curated' },
  ],
  'e:min': [
    { id: 'e-min-open', label: 'Open chord', rootString: 6, strings: [0, 2, 2, 0, 0, 0], source: 'curated' },
  ],
  'e:min7': [
    { id: 'e-min7-open', label: 'Open chord', rootString: 6, strings: [0, 2, 0, 0, 0, 0], source: 'curated' },
  ],
  'g:7': [
    { id: 'g-7-open', label: 'Open chord', rootString: 6, strings: [3, 2, 0, 0, 0, 1], source: 'curated' },
  ],
  'g:add9': [
    { id: 'g-add9-open', label: 'Open chord', rootString: 6, strings: [3, 2, 0, 2, 0, 3], source: 'curated' },
  ],
  'g:maj': [
    { id: 'g-maj-open', label: 'Open chord', rootString: 6, strings: [3, 2, 0, 0, 0, 3], source: 'curated' },
    { id: 'g-maj-full-open', label: 'Open chord alt', rootString: 6, strings: [3, 2, 0, 0, 3, 3], source: 'curated' },
  ],
  'g:sus2': [
    { id: 'g-sus2-open', label: 'Open chord', rootString: 6, strings: [3, 0, 0, 0, 3, 3], source: 'curated' },
  ],
  'g:sus4': [
    { id: 'g-sus4-open', label: 'Open chord', rootString: 6, strings: [3, 3, 0, 0, 1, 3], source: 'curated' },
  ],
};
