import { buildTabLines, getDiagramWindow } from '../lib/chords';

type GuitarChordDiagramProps = {
  chordLabel: string;
  strings: Array<number | null>;
  voicingLabel: string;
  voicingCount: number;
  voicingIndex: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function GuitarChordDiagram({
  chordLabel,
  strings,
  voicingLabel,
  voicingCount,
  voicingIndex,
  onPrevious,
  onNext,
}: GuitarChordDiagramProps) {
  const { baseFret, fretCount } = getDiagramWindow(strings);
  const tabLines = buildTabLines(strings);

  return (
    <section className="panel panel--compact">
      <div className="card-header">
        <div>
          <p className="eyebrow">Guitar</p>
          <h3>{chordLabel}</h3>
        </div>
        <div className="guitar-toolbar">
          <span className="tag">{voicingLabel}</span>
          {voicingCount > 1 ? (
            <div className="guitar-toolbar__actions">
              <span className="fine-print guitar-toolbar__count">
                Voicing {voicingIndex + 1} of {voicingCount}
              </span>
              <button type="button" className="mini-button" onClick={onPrevious} aria-label="Previous guitar voicing">
                Prev
              </button>
              <button type="button" className="mini-button" onClick={onNext} aria-label="Next guitar voicing">
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="guitar-diagram">
        {baseFret > 1 ? (
          <p className="fine-print guitar-diagram__window-note">
            Diagram shows frets {baseFret} to {baseFret + fretCount - 1}.
          </p>
        ) : null}

        {/* The tab output below is the accessible text form; the visual diagram is decorative. */}
        <div className="guitar-diagram__top" aria-hidden="true">
          {strings.map((fret, index) => (
            <span key={`marker-${index}`} className="guitar-diagram__marker">
              {fret === null ? 'x' : fret === 0 ? 'o' : ''}
            </span>
          ))}
        </div>

        <div className={`guitar-diagram__frame ${baseFret > 1 ? 'guitar-diagram__frame--offset' : ''}`} aria-hidden="true">
          {baseFret > 1 ? <span className="guitar-diagram__base-fret">{baseFret}fr</span> : null}
          <div
            className="guitar-diagram__grid"
            style={{ gridTemplateRows: `repeat(${fretCount}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: fretCount }, (_, rowIndex) =>
              strings.map((fret, stringIndex) => {
                const displayFret = baseFret + rowIndex;
                const isActive = fret !== null && fret > 0 && fret === displayFret;
                const isNutRow = baseFret === 1 && rowIndex === 0;

                return (
                  <div
                    key={`${stringIndex}-${rowIndex}`}
                    className={`guitar-diagram__cell ${isNutRow ? 'guitar-diagram__cell--nut' : ''}`}
                  >
                    {isActive ? <span className="guitar-diagram__dot" /> : null}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="guitar-diagram__labels" aria-hidden="true">
          {['E', 'A', 'D', 'G', 'B', 'E'].map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>

      <div className="detail-block">
        <pre className="tab-panel" aria-label={`${chordLabel} guitar tab`}>
          <code>{tabLines.join('\n')}</code>
        </pre>
      </div>
    </section>
  );
}
