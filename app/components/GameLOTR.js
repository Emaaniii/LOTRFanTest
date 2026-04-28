'use client';

import { useEffect, useState } from 'react';
import Shire from './Shire';
import DurinDoors from './DurinDoors';
import Quiz from './Quiz';
import WinScreen from './WinScreen';
import LoseScreen from './LoseScreen';
import BackToHub from './BackToHub';

/**
 * The original LOTR game flow extracted into its own component so
 * the top-level page only has to know about the active game id.
 *
 *   Shire → DurinDoors → Quiz → (WinScreen | LoseScreen)
 *
 * Holds its own `screen` state. Restart resets to 'shire'; the
 * "Hub" button on the win/lose screens (or the corner BackToHub
 * link) calls the parent's `onExit`.
 *
 * @param {{ nickname: string, onExit: () => void }} props
 */
export default function GameLOTR({ nickname, onExit }) {
  const [screen, setScreen] = useState('shire');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  const restart = () => setScreen('shire');

  return (
    <>
      <BackToHub onExit={onExit} />
      {screen === 'shire' && <Shire onBegin={() => setScreen('durin')} />}
      {screen === 'durin' && <DurinDoors onActivated={() => setScreen('quiz')} />}
      {screen === 'quiz'  && <Quiz       onFinish={(result) => setScreen(result)} />}
      {screen === 'win'   && (
        <WinScreen nickname={nickname} onRestart={restart} onExit={onExit} />
      )}
      {screen === 'lose'  && (
        <LoseScreen nickname={nickname} onRestart={restart} onExit={onExit} />
      )}
    </>
  );
}
