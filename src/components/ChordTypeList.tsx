import { getChordLabel } from '../lib/chords';
import type { ChordType, RootNote } from '../types';

type ChordTypeListProps = {
  chordTypes: ChordType[];
  root: RootNote;
  selectedChordTypeId: string;
  onSelect: (chordTypeId: string) => void;
  onBack: () => void;
};

export function ChordTypeList({
  chordTypes,
  root,
  selectedChordTypeId,
  onSelect,
  onBack,
}: ChordTypeListProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Step 2</p>
          <h2>Choose a variation</h2>
        </div>
        <div className="section-actions">
          <button type="button" className="tag" onClick={onBack}>{root.label}</button>
          <button type="button" className="ghost-button" onClick={onBack}>
            Change root
          </button>
        </div>
      </div>
      <div className="variation-grid" role="list" aria-label={`${root.label} chord variations`}>
        {chordTypes.map((chordType) => (
          <button
            key={chordType.id}
            type="button"
            className={`variation-chip ${selectedChordTypeId === chordType.id ? 'variation-chip--active' : ''}`}
            onClick={() => onSelect(chordType.id)}
          >
            {getChordLabel(root, chordType)}
          </button>
        ))}
      </div>
    </section>
  );
}
