'use client';

/**
 * Tiny fixed-position link in the upper-left corner of any in-game
 * screen. Lets the player abandon the current game and return to
 * the games hub.
 *
 * @param {{ onExit: () => void }} props
 */
export default function BackToHub({ onExit }) {
  return (
    <button type="button" className="back-to-hub" onClick={onExit} aria-label="Return to games hub">
      ← Hub
    </button>
  );
}
