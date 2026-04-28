'use client';

import { useEffect, useMemo, useState } from 'react';
import { VOCAB, BOOKWORM_AMOUNT, BOOKWORM_THRESHOLD } from '../data/vocabulary';
import BackToHub from './BackToHub';

/**
 * Bookworm — vocabulary match. A word is shown; the player picks the
 * correct definition out of four. Three distractor definitions are
 * picked at random from the rest of the vocabulary list, then all
 * four choices are shuffled.
 *
 * Mirrors the LOTR Quiz scoring shape: track Light vs Shadow tally,
 * pass with `score >= BOOKWORM_THRESHOLD`.
 *
 * @param {{ nickname: string, onExit: () => void }} props
 */
export default function GameBookworm({ nickname, onExit }) {
  const questions = useMemo(() => buildQuestions(VOCAB, BOOKWORM_AMOUNT), []);

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [version, setVersion] = useState(0);  // bumps to rebuild questions on restart

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [qIndex, result]);

  const currentQ = questions[qIndex];
  const total = questions.length;
  const isLast = qIndex + 1 >= total;
  const progressPct =
    chosenIdx === null ? (qIndex / total) * 100 : ((qIndex + 1) / total) * 100;

  const handleChoose = (i) => {
    if (chosenIdx !== null) return;
    setChosenIdx(i);
    if (i === currentQ.answer) setScore((s) => s + 1);
    else setShadow((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setResult(score >= BOOKWORM_THRESHOLD ? 'win' : 'lose');
    } else {
      setQIndex((i) => i + 1);
      setChosenIdx(null);
    }
  };

  const restart = () => {
    setQIndex(0);
    setScore(0);
    setShadow(0);
    setChosenIdx(null);
    setResult(null);
    setVersion((v) => v + 1);
  };

  /* ---- result screens ---- */
  if (result === 'win') {
    return (
      <ResultCard
        kind="win"
        nickname={nickname}
        score={score}
        total={total}
        onRestart={restart}
        onExit={onExit}
      />
    );
  }
  if (result === 'lose') {
    return (
      <ResultCard
        kind="lose"
        nickname={nickname}
        score={score}
        total={total}
        onRestart={restart}
        onExit={onExit}
      />
    );
  }

  /* ---- main game ---- */
  return (
    <>
      <BackToHub onExit={onExit} />
      <section className="quiz show bookworm-quiz" key={version}>
        <div className="parchment">
          <div className="quiz-header">
            <span className="qcount">
              Word <strong>{qIndex + 1}</strong> of <strong>{total}</strong>
            </span>
            <span className="qscore">
              Right: <strong>{score}</strong> · Wrong: <strong>{shadow}</strong>
            </span>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progressPct}%` }} />
          </div>

          <p className="qcategory">Bookworm · Vocabulary</p>
          <h2 className="qtitle bookworm-word">{currentQ.word}</h2>
          <p className="bookworm-prompt">What does this word mean?</p>

          <ul className="qchoices">
            {currentQ.choices.map((choice, i) => (
              <Choice
                key={`${qIndex}-${i}`}
                choice={choice}
                chosen={chosenIdx !== null}
                isCorrect={chosenIdx !== null && i === currentQ.answer}
                isWrong={chosenIdx !== null && i === chosenIdx && i !== currentQ.answer}
                onPick={() => handleChoose(i)}
              />
            ))}
          </ul>

          <p className="qfeedback">
            {chosenIdx === null
              ? ''
              : chosenIdx === currentQ.answer
              ? 'Well read.'
              : `Not quite — the right meaning is highlighted above.`}
          </p>

          <div className="qcontrols">
            <button
              className={`btn-stone${chosenIdx === null ? ' hidden' : ''}`}
              onClick={handleNext}
            >
              {isLast ? 'See Your Mark →' : 'Continue →'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function Choice({ choice, chosen, isCorrect, isWrong, onPick }) {
  const cls = [chosen ? 'locked' : '', isCorrect ? 'correct' : '', isWrong ? 'wrong' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <li className={cls} onClick={onPick} style={chosen ? { pointerEvents: 'none' } : undefined}>
      {choice}
    </li>
  );
}

function ResultCard({ kind, nickname, score, total, onRestart, onExit }) {
  const isWin = kind === 'win';
  return (
    <>
      <BackToHub onExit={onExit} />
      <section className={`bookworm-result ${isWin ? 'win' : 'lose'}`}>
        <div className="parchment result-parchment">
          <h2>
            {isWin ? 'Word Master' : 'The Pages Turned Against You'}
            {isWin ? ', ' : ', '}
            <span className="result-name">{nickname}</span>
          </h2>
          <p className="bookworm-score">
            You answered <strong>{score}</strong> of <strong>{total}</strong> correctly.
          </p>
          <p>
            {isWin
              ? 'The wizards of the Lexicon nod gravely. The dictionary is yours.'
              : 'The scribes mutter and turn the page. Try once more, and read with care.'}
          </p>
          <div className="result-actions">
            <button className="btn-stone" onClick={onRestart}>
              {isWin ? 'Read Again' : 'Try Again'}
            </button>
            <button className="btn-stone btn-stone-ghost" onClick={onExit}>
              ← Hub
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- helpers ---- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(vocab, count) {
  const picks = shuffle(vocab).slice(0, count);
  return picks.map((entry) => {
    const distractors = shuffle(vocab.filter((v) => v.word !== entry.word))
      .slice(0, 3)
      .map((v) => v.definition);
    const choices = shuffle([entry.definition, ...distractors]);
    return {
      word: entry.word,
      choices,
      answer: choices.indexOf(entry.definition),
    };
  });
}
