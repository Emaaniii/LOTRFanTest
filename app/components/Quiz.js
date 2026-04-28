'use client';

import { useEffect, useState } from 'react';
import { fetchQuestions, WIN_THRESHOLD } from '../data/questions';

/**
 * The parchment quiz. Fetches a fresh batch of questions from Open Trivia DB
 * on mount, owns its question/score state internally, and reports a single
 * result string to the parent when finished.
 *
 * @param {{ onFinish: (result: 'win' | 'lose') => void }} props
 */
export default function Quiz({ onFinish }) {
  /* ---- async data ---- */
  const [questions, setQuestions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  /* ---- quiz progress ---- */
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [chosenIdx, setChosenIdx] = useState(null);

  /* fetch on mount + whenever the user retries */
  useEffect(() => {
    let cancelled = false;
    setQuestions(null);
    setLoadError(null);

    fetchQuestions()
      .then((qs) => {
        if (!cancelled) setQuestions(qs);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'An unknown shadow fell.');
      });

    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  /* ---- loading state ---- */
  if (!questions && !loadError) {
    return (
      <section className="quiz show">
        <div className="parchment">
          <div className="quiz-status">
            <h2 className="qtitle">The Council is gathering riddles…</h2>
            <div className="parchment-spinner" aria-hidden="true" />
            <p className="qfeedback">A raven flies forth to the great library.</p>
          </div>
        </div>
      </section>
    );
  }

  /* ---- error state ---- */
  if (loadError) {
    return (
      <section className="quiz show">
        <div className="parchment">
          <div className="quiz-status">
            <h2 className="qtitle">The palantír clouds over…</h2>
            <p className="qfeedback">{loadError}</p>
            <div className="qcontrols">
              <button
                className="btn-stone"
                onClick={() => setRetryToken((t) => t + 1)}
              >
                Send the Raven Again →
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---- ready: render the quiz ---- */
  const currentQ = questions[qIndex];
  const total = questions.length;
  const isLast = qIndex + 1 >= total;
  const progressPct =
    chosenIdx === null
      ? (qIndex / total) * 100
      : ((qIndex + 1) / total) * 100;
  const feedback =
    chosenIdx === null
      ? ''
      : chosenIdx === currentQ.answer
      ? currentQ.light
      : currentQ.shadow;

  const handleChoose = (i) => {
    if (chosenIdx !== null) return;
    setChosenIdx(i);
    if (i === currentQ.answer) setScore((s) => s + 1);
    else setShadow((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      onFinish?.(score >= WIN_THRESHOLD ? 'win' : 'lose');
    } else {
      setQIndex((i) => i + 1);
      setChosenIdx(null);
    }
  };

  return (
    <section className="quiz show">
      <div className="parchment">
        <div className="quiz-header">
          <span className="qcount">
            Question <strong>{qIndex + 1}</strong> of <strong>{total}</strong>
          </span>
          <span className="qscore">
            Light: <strong>{score}</strong> · Shadow: <strong>{shadow}</strong>
          </span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progressPct}%` }} />
        </div>

        {currentQ.category && (
          <p className="qcategory">
            {currentQ.category} · {currentQ.difficulty}
          </p>
        )}

        <h2 className="qtitle">{currentQ.q}</h2>

        <ul className="qchoices">
          {currentQ.choices.map((choice, i) => (
            <ChoiceItem
              key={`${qIndex}-${i}`}
              choice={choice}
              chosen={chosenIdx !== null}
              isCorrect={chosenIdx !== null && i === currentQ.answer}
              isWrong={chosenIdx !== null && i === chosenIdx && i !== currentQ.answer}
              onPick={() => handleChoose(i)}
            />
          ))}
        </ul>

        <p className="qfeedback">{feedback}</p>

        <div className="qcontrols">
          <button
            className={`btn-stone${chosenIdx === null ? ' hidden' : ''}`}
            onClick={handleNext}
          >
            {isLast ? 'See Your Fate →' : 'Continue →'}
          </button>
        </div>
      </div>
    </section>
  );
}

function ChoiceItem({ choice, chosen, isCorrect, isWrong, onPick }) {
  const cls = [chosen ? 'locked' : '', isCorrect ? 'correct' : '', isWrong ? 'wrong' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <li
      className={cls}
      onClick={onPick}
      style={chosen ? { pointerEvents: 'none' } : undefined}
    >
      {choice}
    </li>
  );
}
