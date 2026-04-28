'use client';

import { useEffect, useState } from 'react';

import PhialCursor from './components/PhialCursor';
import MusicPlayer from './components/MusicPlayer';
import RingHeader from './components/RingHeader';
import Nickname from './components/Nickname';
import GamesHub from './components/GamesHub';
import GameLOTR from './components/GameLOTR';
import GameBookworm from './components/GameBookworm';
import GameTactics from './components/GameTactics';

/**
 * Top-level orchestrator.
 *
 * State machine:
 *   1. Nickname screen — until the player picks a name.
 *   2. Games hub      — three game cards, one per game.
 *   3. Active game    — `GameLOTR | GameBookworm | GameTactics`.
 *
 * Each game manages its own internal flow (intro → play → result)
 * and reports back to this parent only via `onExit`, which returns
 * the player to the hub.
 */
export default function Home() {
  const [nickname, setNickname] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nickname, activeGame]);

  const exitToHub = () => setActiveGame(null);

  return (
    <>
      <PhialCursor />
      <MusicPlayer />
      <RingHeader />

      {!nickname && <Nickname onSubmit={setNickname} />}

      {nickname && !activeGame && (
        <GamesHub nickname={nickname} onSelect={setActiveGame} />
      )}

      {nickname && activeGame === 'lotr' && (
        <GameLOTR nickname={nickname} onExit={exitToHub} />
      )}
      {nickname && activeGame === 'bookworm' && (
        <GameBookworm nickname={nickname} onExit={exitToHub} />
      )}
      {nickname && activeGame === 'tactics' && (
        <GameTactics nickname={nickname} onExit={exitToHub} />
      )}
    </>
  );
}
