import { getKeyboardRange } from '../lib/chords';

type PianoKeyboardDiagramProps = {
  activeMidiNotes: number[];
  noteLabels: string[];
};

const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);

const WHITE_NOTE_LETTER: Record<number, string> = {
  0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B',
};

function midiOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function PianoKeyboardDiagram({ activeMidiNotes, noteLabels }: PianoKeyboardDiagramProps) {
  const range = getKeyboardRange(activeMidiNotes);
  const activeSet = new Set(activeMidiNotes);
  const whiteKeys = range.filter((note) => WHITE_PITCH_CLASSES.has(note % 12));
  const blackKeys = range
    .map((note) => ({ midi: note, pitchClass: note % 12 }))
    .filter(({ pitchClass }) => !WHITE_PITCH_CLASSES.has(pitchClass));

  // Map from midi note to the spelled chord tone label (e.g. "Bb", "F#")
  const activeNoteLabel = new Map(activeMidiNotes.map((midi, i) => [midi, noteLabels[i]]));

  return (
    <section className="panel panel--compact">
      <div className="card-header">
        <div>
          <p className="eyebrow">Piano</p>
          <h3>Keyboard diagram</h3>
        </div>
        <span className="tag">{noteLabels.join(' • ')}</span>
      </div>

      {/* Chord tones are conveyed as text in the tag above; the keyboard is decorative. */}
      <div className="keyboard-shell" aria-hidden="true">
        <div
          className="keyboard keyboard--white"
          style={{ gridTemplateColumns: `repeat(${whiteKeys.length}, var(--white-key-width))` }}
        >
          {whiteKeys.map((note) => {
            const letter = WHITE_NOTE_LETTER[note % 12];
            const isC = note % 12 === 0;
            const chordLabel = activeNoteLabel.get(note);

            return (
              <div
                key={note}
                className={`key key--white ${activeSet.has(note) ? 'key--active' : ''}`}
              >
                <span className={`key__label ${chordLabel ? 'key__label--active' : 'key__label--passive'}`}>
                  {chordLabel ?? letter}
                </span>
                {isC && <span className="key__octave">{midiOctave(note)}</span>}
              </div>
            );
          })}
        </div>
        <div
          className="keyboard keyboard--black"
          style={{ width: `calc(${whiteKeys.length} * var(--white-key-width))` }}
        >
          {blackKeys.map(({ midi }) => {
            const whiteBefore = range.filter(
              (note) => note < midi && WHITE_PITCH_CLASSES.has(note % 12),
            ).length;
            const chordLabel = activeNoteLabel.get(midi);

            return (
              <div
                key={midi}
                className={`key key--black ${activeSet.has(midi) ? 'key--active' : ''}`}
                style={{ left: `calc(${whiteBefore} * var(--white-key-width))` }}
              >
                {chordLabel && <span className="key__label key__label--active">{chordLabel}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
