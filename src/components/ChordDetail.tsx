import {
  formatIntervalSet,
  getAlternateChordLabel,
  getChordLabel,
  getLongFormChordLabel,
} from '../lib/chords';
import type { ChordType, GuitarVoicing, RootNote } from '../types';
import { GuitarChordDiagram } from './GuitarChordDiagram';
import { PianoKeyboardDiagram } from './PianoKeyboardDiagram';
import { PlaybackButton } from './PlaybackButton';

type ChordDetailProps = {
  chordType: ChordType;
  root: RootNote;
  chordNotes: string[];
  pianoVoicing: number[];
  guitarVoicing: GuitarVoicing;
  guitarVoicingCount: number;
  guitarVoicingIndex: number;
  onSelectPreviousGuitarVoicing: () => void;
  onSelectNextGuitarVoicing: () => void;
};

export function ChordDetail({
  chordType,
  root,
  chordNotes,
  pianoVoicing,
  guitarVoicing,
  guitarVoicingCount,
  guitarVoicingIndex,
  onSelectPreviousGuitarVoicing,
  onSelectNextGuitarVoicing,
}: ChordDetailProps) {
  const chordLabel = getChordLabel(root, chordType);
  const alternateChordLabel = getAlternateChordLabel(root, chordType);
  const longFormChordLabel = getLongFormChordLabel(root, chordType);

  return (
    <section className="detail-layout">
      <section className="hero-card">
        <div className="hero-card__copy">
          <p className="eyebrow">Selected chord</p>
          <h2>
            {chordLabel}
            {alternateChordLabel ? <span className="hero-card__alternate"> ({alternateChordLabel})</span> : null}
          </h2>
          <p className="hero-card__long-name">{longFormChordLabel}</p>
          <p className="hero-card__description">{chordType.description}</p>
        </div>

        <div className="hero-card__meta">
          <div className="detail-block">
            <p className="detail-label">Chord tones</p>
            <p className="detail-value">{chordNotes.join(' • ')}</p>
          </div>
          <div className="detail-block">
            <p className="detail-label">Formula</p>
            <p className="detail-value">{formatIntervalSet(chordType)}</p>
          </div>
          <PlaybackButton midiNotes={pianoVoicing} />
        </div>
      </section>

      <div className="instrument-grid">
        <GuitarChordDiagram
          chordLabel={chordLabel}
          strings={guitarVoicing.strings}
          voicingLabel={guitarVoicing.label}
          voicingCount={guitarVoicingCount}
          voicingIndex={guitarVoicingIndex}
          onPrevious={onSelectPreviousGuitarVoicing}
          onNext={onSelectNextGuitarVoicing}
        />
        <PianoKeyboardDiagram activeMidiNotes={pianoVoicing} noteLabels={chordNotes} />
      </div>
    </section>
  );
}
