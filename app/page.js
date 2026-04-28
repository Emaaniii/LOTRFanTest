'use client';

import { useEffect, useState } from 'react';

import PhialCursor from './components/PhialCursor';
import MusicPlayer from './components/MusicPlayer';
import RingHeader from './components/RingHeader';
import Shire from './components/Shire';
import DurinDoors from './components/DurinDoors';
import Quiz from './components/Quiz';
import WinScreen from './components/WinScreen';
import LoseScreen from './components/LoseScreen';

/**
 * Top-level orchestrator.
 *
 * Owns only the single piece of state needed to choose what's on screen:
 * `screen ∈ { 'shire' | 'durin' | 'quiz' | 'win' | 'lose' }`.
 *
 * Each child manages its own internal state (input, score, etc.) and
 * communicates outward through a single callback prop.
 */
export default function Home() {
  const [screen, setScreen] = useState('shire');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  const restart = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <>
      <PhialCursor />
      <MusicPlayer />
      <RingHeader />

      {screen === 'shire' && <Shire onBegin={() => setScreen('durin')} />}
      {screen === 'durin' && <DurinDoors onActivated={() => setScreen('quiz')} />}
      {screen === 'quiz'  && <Quiz       onFinish={(result) => setScreen(result)} />}
      {screen === 'win'   && <WinScreen  onRestart={restart} />}
      {screen === 'lose'  && <LoseScreen onRestart={restart} />}
    </>
  );
}
