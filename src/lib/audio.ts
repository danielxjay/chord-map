let audioContext: AudioContext | null = null;

function requestPlaybackAudioSession() {
  if (typeof navigator === 'undefined' || !navigator.audioSession) {
    return;
  }

  try {
    navigator.audioSession.type = 'playback';
  } catch {
    // Ignore unsupported or rejected audio-session hints and continue with playback.
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextCtor = window.AudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

function midiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export async function playChord(midiNotes: number[]): Promise<void> {
  requestPlaybackAudioSession();

  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  // Small lookahead prevents scheduling glitches if the main thread is busy.
  const startTime = context.currentTime + 0.02;
  // Total note length in seconds. PlaybackButton uses a matching timeout.
  const duration = 1.35;

  midiNotes.forEach((midiNote, index) => {
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();
    const gain = context.createGain();
    // 12ms between notes simulates a natural upward strum.
    const toneDelay = index * 0.012;
    const noteStart = startTime + toneDelay;
    const noteEnd = noteStart + duration;
    const frequency = midiToFrequency(midiNote);

    // Triangle wave is richer than sine but less harsh than square or sawtooth.
    // The sine overtone one octave up (×2) adds warmth without changing the perceived pitch.
    fundamental.type = 'triangle';
    overtone.type = 'sine';
    fundamental.frequency.value = frequency;
    overtone.frequency.value = frequency * 2;

    // Envelope: fast attack (40ms), quick decay to sustain level (200ms), then fade out.
    // 0.0001 is used instead of 0 because exponentialRamp cannot ramp to zero.
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.15, noteStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.085, noteStart + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    fundamental.connect(gain);
    overtone.connect(gain);
    gain.connect(context.destination);

    fundamental.start(noteStart);
    overtone.start(noteStart);
    fundamental.stop(noteEnd);
    overtone.stop(noteEnd);
  });
}
