import { buildTabLines, getDiagramWindow } from '../lib/chords';

type GuitarChordDiagramProps = {
  chordLabel: string;
  strings: Array<number | null>;
  voicingLabel: string;
};

export function GuitarChordDiagram({ chordLabel, strings, voicingLabel }: GuitarChordDiagramProps) {
  const { baseFret, fretCount } = getDiagramWindow(strings);
  const frettedStrings = strings.filter((fret): fret is number => fret !== null && fret > 0);
  const tabLines = buildTabLines(strings);

  return (
    <section className="panel panel--compact">
      <div className="card-header">
        <div>
          <p className="eyebrow">Guitar</p>
          <h3>{chordLabel}</h3>
        </div>
        <span className="tag">{voicingLabel}</span>
      </div>

      <div className="guitar-diagram">
        <div className="guitar-diagram__top">
          {strings.map((fret, index) => (
            <span key={`marker-${index}`} className="guitar-diagram__marker">
              {fret === null ? 'x' : fret === 0 ? 'o' : ''}
            </span>
          ))}
        </div>

        <div className="guitar-diagram__frame">
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

        <div className="guitar-diagram__labels">
          {['E', 'A', 'D', 'G', 'B', 'E'].map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>

      <div className="detail-block">
        <p className="detail-label">Frets</p>
        <p className="detail-value">
          {strings.map((fret) => (fret === null ? 'x' : fret)).join(' • ')}
        </p>
      </div>

      <div className="detail-block">
        <p className="detail-label">Chord tab</p>
        <pre className="tab-panel">
          <code>{tabLines.join('\n')}</code>
        </pre>
      </div>

      {frettedStrings.length === 0 ? null : (
        <p className="fine-print">Playable diagram window: frets {baseFret} to {baseFret + fretCount - 1}.</p>
      )}
    </section>
  );
}
