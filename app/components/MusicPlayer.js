'use client';

import { useEffect, useRef, useState } from 'react';

const TRACK_SRC = '/music/may-it-be.mp3';
const TRACK_VOLUME = 0.45;

/**
 * Background music — Enya's "May It Be".
 *
 * Browsers block autoplaying audio, so playback starts on the user's first
 * click or keypress anywhere on the page. A small toggle button sits in
 * the corner so the user can mute/unmute at will.
 *
 * Drop the MP3 file at `public/music/may-it-be.mp3`.
 */
export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFile, setHasFile] = useState(true);

  // Auto-start on first user interaction.
  useEffect(() => {
    const start = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = TRACK_VOLUME;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          /* user gesture required again, or file missing — handled by onError */
        });
    };
    document.addEventListener('pointerdown', start, { once: true });
    document.addEventListener('keydown', start, { once: true });
    return () => {
      document.removeEventListener('pointerdown', start);
      document.removeEventListener('keydown', start);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !hasFile) return;
    if (audio.paused) {
      audio.volume = TRACK_VOLUME;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const label = !hasFile
    ? 'Add public/music/may-it-be.mp3'
    : isPlaying
    ? 'Pause music'
    : 'Play music';

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasFile(false)}
      />
      <button
        type="button"
        className={`music-toggle${isPlaying ? ' playing' : ''}${!hasFile ? ' missing' : ''}`}
        onClick={toggle}
        aria-label={label}
        title={label}
      >
        <span className="music-icon" aria-hidden="true">
          {!hasFile ? '⚠' : isPlaying ? '♪' : '♪'}
        </span>
        {isPlaying && (
          <span className="music-bars" aria-hidden="true">
            <span /><span /><span />
          </span>
        )}
      </button>
    </>
  );
}
