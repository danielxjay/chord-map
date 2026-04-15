import { useState } from 'react';
import { playChord } from '../lib/audio';

type PlaybackButtonProps = {
  midiNotes: number[];
};

export function PlaybackButton({ midiNotes }: PlaybackButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  async function handleClick() {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);

    try {
      await playChord(midiNotes);
      // 1400ms matches the 1.35s audio duration plus a small buffer for the fade-out.
      window.setTimeout(() => setIsPlaying(false), 1400);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <button type="button" className="play-button" onClick={handleClick}>
      {isPlaying ? 'Playing...' : 'Play chord'}
    </button>
  );
}

