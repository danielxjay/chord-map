import { useEffect, useMemo, useState } from 'react';
import { CHORD_TYPES, ROOT_NOTES } from './data/music';
import { findChordTypeById, buildGuitarVoicings, buildPianoVoicing, spellChordNotes } from './lib/chords';
import { ChordDetail } from './components/ChordDetail';
import { ChordTypeList } from './components/ChordTypeList';
import { RootNotePicker } from './components/RootNotePicker';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function App() {
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedChordTypeId, setSelectedChordTypeId] = useState(CHORD_TYPES[0].id);
  const [activeStep, setActiveStep] = useState<'root' | 'variation'>('root');
  const [selectedGuitarVoicingIndex, setSelectedGuitarVoicingIndex] = useState(0);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (localStorage.getItem('theme')) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }

  const selectedRoot = ROOT_NOTES.find((root) => root.id === selectedRootId) ?? null;
  const selectedChordType = findChordTypeById(selectedChordTypeId);
  const guitarVoicings = useMemo(
    () => (selectedRoot ? buildGuitarVoicings(selectedRoot, selectedChordType) : []),
    [selectedRoot, selectedChordType],
  );

  useEffect(() => {
    setSelectedGuitarVoicingIndex(0);
  }, [selectedRootId, selectedChordTypeId]);

  function handleRootSelect(rootId: string) {
    setSelectedRootId(rootId);
    setActiveStep('variation');
  }

  function handleChordSelect(rootId: string, chordTypeId: string) {
    setSelectedRootId(rootId);
    setSelectedChordTypeId(chordTypeId);
    setActiveStep('variation');
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <h1 onClick={() => { setSelectedRootId(null); setActiveStep('root'); }}>Chord Map</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <main className={`workspace ${selectedRoot ? '' : 'workspace--landing'}`.trim()}>
        <aside className="control-column">
          {activeStep === 'root' ? (
            <RootNotePicker
              roots={ROOT_NOTES}
              selectedRootId={selectedRoot?.id ?? null}
              onSelect={handleRootSelect}
            />
          ) : selectedRoot ? (
            <ChordTypeList
              chordTypes={CHORD_TYPES}
              root={selectedRoot}
              selectedChordTypeId={selectedChordType.id}
              onSelect={setSelectedChordTypeId}
              onBack={() => setActiveStep('root')}
            />
          ) : null}
        </aside>

        {selectedRoot ? (
          <ChordDetail
            chordType={selectedChordType}
            root={selectedRoot}
            chordNotes={spellChordNotes(selectedRoot, selectedChordType)}
            guitarVoicing={guitarVoicings[selectedGuitarVoicingIndex] ?? guitarVoicings[0]}
            guitarVoicingCount={guitarVoicings.length}
            guitarVoicingIndex={selectedGuitarVoicingIndex}
            onSelectPreviousGuitarVoicing={() =>
              setSelectedGuitarVoicingIndex((currentIndex) =>
                currentIndex === 0 ? guitarVoicings.length - 1 : currentIndex - 1,
              )
            }
            onSelectNextGuitarVoicing={() =>
              setSelectedGuitarVoicingIndex((currentIndex) =>
                currentIndex === guitarVoicings.length - 1 ? 0 : currentIndex + 1,
              )
            }
            pianoVoicing={buildPianoVoicing(selectedRoot, selectedChordType)}
            onSelectChord={handleChordSelect}
          />
        ) : (
          <section className="hero-card hero-card--empty">
            <div className="hero-card__copy">
              <h2>Map chords across guitar and piano</h2>
              <p className="hero-card__description">
                Browse curated chord variations for guitar and piano, then preview the notes and hear the
                voicing.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
