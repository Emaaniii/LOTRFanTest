'use client';

import { useState } from 'react';

const MAX_LEN = 20;

/**
 * The first screen — the player chooses a nickname before any game
 * begins. The nickname is then carried into the games hub and used
 * throughout (greetings, win/lose screens, combat log, etc.).
 *
 * @param {{ onSubmit: (name: string) => void }} props
 */
export default function Nickname({ onSubmit }) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
  };

  return (
    <section className="nickname-screen">
      <div className="gloomy-clouds" aria-hidden="true">
        <span className="g-cloud g-cloud-1" />
        <span className="g-cloud g-cloud-2" />
        <span className="g-cloud g-cloud-3" />
        <span className="g-cloud g-cloud-4" />
      </div>

      <div className="nickname-card">
        <h2>What name shall we sing of you?</h2>
        <p className="nickname-hint">
          Speak a name, and the gates of Middle-earth shall remember you.
        </p>
        <input
          type="text"
          className="nickname-input"
          placeholder="Frodo, Aragorn, Galadriel, …"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          maxLength={MAX_LEN}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="button"
          className="btn-stone"
          onClick={submit}
          disabled={value.trim().length === 0}
        >
          Enter →
        </button>
      </div>
    </section>
  );
}
